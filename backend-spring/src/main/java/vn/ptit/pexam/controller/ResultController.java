package vn.ptit.pexam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.ptit.pexam.data.MockDataStore;
import vn.ptit.pexam.model.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final MockDataStore db;

    // POST /api/results/submit
    @PostMapping("/submit")
    public ResponseEntity<?> submit(@RequestBody Map<String, Object> body, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        String examId = String.valueOf(body.get("examId"));
        int durationMins = toInt(body.getOrDefault("duration", 0));

        Optional<Exam> examOpt = db.findExamById(examId);
        if (examOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy bài thi"));

        Exam exam = examOpt.get();
        List<Question> questions = db.getQuestions(examId);
        if (questions.isEmpty()) return ResponseEntity.badRequest().body(Map.of("message", "Bài thi chưa có câu hỏi"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> answersPayload = (List<Map<String, Object>>) body.getOrDefault("answers", List.of());

        // Grade
        int correct = 0;
        List<Integer> answerIndices = new ArrayList<>(Collections.nCopies(questions.size(), -1));

        for (var ans : answersPayload) {
            String questionId      = String.valueOf(ans.get("questionId"));
            String selectedOptId   = ans.get("selectedOptionId") == null ? null : String.valueOf(ans.get("selectedOptionId"));
            int qIdx = -1;
            for (int i = 0; i < questions.size(); i++) {
                if (questions.get(i).getId().equals(questionId)) { qIdx = i; break; }
            }
            if (qIdx == -1 || selectedOptId == null) continue;

            Question q = questions.get(qIdx);
            for (int j = 0; j < q.getOptions().size(); j++) {
                QuestionOption opt = q.getOptions().get(j);
                if (opt.getId().equals(selectedOptId)) {
                    answerIndices.set(qIdx, j);
                    if (opt.isCorrect()) correct++;
                    break;
                }
            }
        }

        double score = (questions.size() > 0)
            ? Math.round((double) correct / questions.size() * exam.getTotalScore() * 100.0) / 100.0
            : 0.0;

        ExamResult result = new ExamResult(
            db.nextResultId(), userId, examId, score, correct, questions.size(),
            durationMins, Instant.now().toString(), answerIndices
        );

        // Upsert
        db.results.removeIf(r -> r.getUserId().equals(userId) && r.getExamId().equals(examId));
        db.results.add(result);

        return ResponseEntity.status(201).body(Map.of(
            "message", "Exam submitted successfully",
            "result", Map.of(
                "id", result.getId(),
                "score", score,
                "correctAnswers", correct,
                "totalQuestions", questions.size(),
                "examTotalScore", exam.getTotalScore()
            )
        ));
    }

    // GET /api/results/my-results
    @GetMapping("/my-results")
    public ResponseEntity<?> myResults(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        List<Map<String, Object>> list = db.getResultsByUser(userId).stream().map(r -> {
            Exam exam = db.findExamById(r.getExamId()).orElse(null);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.getId());
            m.put("exam_id", r.getExamId());
            m.put("user_id", r.getUserId());
            m.put("score", r.getScore());
            m.put("correct_answers", r.getCorrectAnswers());
            m.put("total_questions", r.getTotalQuestions());
            m.put("duration", r.getDuration());
            m.put("submit_time", r.getSubmitTime());
            m.put("exam_title", exam != null ? exam.getTitle() : "");
            m.put("subject", exam != null ? exam.getSubject() : "");
            m.put("exam_total_score", exam != null ? exam.getTotalScore() : 10);
            m.put("passing_score", exam != null ? exam.getPassingScore() : 5);
            return m;
        }).toList();
        return ResponseEntity.ok(list);
    }

    // GET /api/results/exam-result/:examId — own result with student answers
    @GetMapping("/exam-result/{examId}")
    public ResponseEntity<?> examResult(@PathVariable String examId, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        Optional<ExamResult> rOpt = db.findResult(userId, examId);
        if (rOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy kết quả"));

        ExamResult r = rOpt.get();
        Exam exam = db.findExamById(examId).orElse(null);
        List<Question> questions = db.getQuestions(examId);

        List<Map<String, Object>> studentAnswers = new ArrayList<>();
        List<Integer> ans = r.getAnswers();
        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);
            int picked = (ans != null && i < ans.size()) ? ans.get(i) : -1;
            String selectedOptId = (picked >= 0 && picked < q.getOptions().size()) ? q.getOptions().get(picked).getId() : null;
            studentAnswers.add(Map.of(
                "question_id", q.getId(),
                "question_content", q.getContent(),
                "selected_option_id", selectedOptId != null ? selectedOptId : "",
                "selected_option_order", picked
            ));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", r.getId());
        result.put("exam_id", r.getExamId());
        result.put("user_id", r.getUserId());
        result.put("score", r.getScore());
        result.put("correct_answers", r.getCorrectAnswers());
        result.put("total_questions", r.getTotalQuestions());
        result.put("duration", r.getDuration());
        result.put("submit_time", r.getSubmitTime());
        result.put("exam_title", exam != null ? exam.getTitle() : "");
        result.put("exam_total_score", exam != null ? exam.getTotalScore() : 10);
        result.put("passing_score", exam != null ? exam.getPassingScore() : 5);
        result.put("studentAnswers", studentAnswers);
        return ResponseEntity.ok(result);
    }

    // GET /api/results/exam/:examId — all results for exam (admin)
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> examResults(@PathVariable String examId) {
        List<Map<String, Object>> list = db.getResultsByExam(examId).stream().map(r -> {
            User user = db.findUserById(r.getUserId()).orElse(null);
            Exam exam = db.findExamById(r.getExamId()).orElse(null);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.getId());
            m.put("exam_id", r.getExamId());
            m.put("user_id", r.getUserId());
            m.put("score", r.getScore());
            m.put("correct_answers", r.getCorrectAnswers());
            m.put("total_questions", r.getTotalQuestions());
            m.put("duration", r.getDuration());
            m.put("submit_time", r.getSubmitTime());
            m.put("username", user != null ? user.getUsername() : "");
            m.put("name", user != null ? user.getName() : "");
            m.put("student_id", user != null && user.getStudentId() != null ? user.getStudentId() : "");
            m.put("class_name", user != null && user.getClassName() != null ? user.getClassName() : "");
            m.put("exam_title", exam != null ? exam.getTitle() : "");
            m.put("exam_total_score", exam != null ? exam.getTotalScore() : 10);
            return m;
        }).toList();
        return ResponseEntity.ok(list);
    }

    // GET /api/results — all results (admin)
    @GetMapping
    public ResponseEntity<?> allResults() {
        List<Map<String, Object>> list = db.results.stream().map(r -> {
            User user = db.findUserById(r.getUserId()).orElse(null);
            Exam exam = db.findExamById(r.getExamId()).orElse(null);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.getId());
            m.put("exam_id", r.getExamId());
            m.put("user_id", r.getUserId());
            m.put("score", r.getScore());
            m.put("correct_answers", r.getCorrectAnswers());
            m.put("total_questions", r.getTotalQuestions());
            m.put("duration", r.getDuration());
            m.put("submit_time", r.getSubmitTime());
            m.put("username", user != null ? user.getUsername() : "");
            m.put("name", user != null ? user.getName() : "");
            m.put("student_id", user != null && user.getStudentId() != null ? user.getStudentId() : "");
            m.put("class_name", user != null && user.getClassName() != null ? user.getClassName() : "");
            m.put("exam_title", exam != null ? exam.getTitle() : "");
            m.put("exam_total_score", exam != null ? exam.getTotalScore() : 10);
            return m;
        }).toList();
        return ResponseEntity.ok(list);
    }

    private int toInt(Object v) {
        if (v instanceof Number n) return n.intValue();
        try { return Integer.parseInt(v.toString()); } catch (Exception e) { return 0; }
    }
}
