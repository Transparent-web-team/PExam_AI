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
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final MockDataStore db;

    private Map<String, Object> examToMap(Exam e, boolean withQuestions) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", e.getId());
        m.put("title", e.getTitle());
        m.put("subject", Optional.ofNullable(e.getSubject()).orElse(""));
        m.put("description", Optional.ofNullable(e.getDescription()).orElse(""));
        m.put("type", e.getType());
        m.put("status", e.getStatus());
        m.put("duration", e.getDuration());
        m.put("question_count", e.getQuestionCount());
        m.put("total_score", e.getTotalScore());
        m.put("passing_score", e.getPassingScore());
        m.put("start_time", e.getStartTime());
        m.put("end_time", e.getEndTime());
        m.put("created_by", e.getCreatedBy());
        m.put("created_at", e.getCreatedAt());
        m.put("attempts", e.getAttempts());
        m.put("allow_retake", e.isAllowRetake());
        if (withQuestions) {
            m.put("questions", db.getQuestions(e.getId()).stream().map(this::questionToMap).toList());
        }
        return m;
    }

    private Map<String, Object> questionToMap(Question q) {
        return Map.of(
            "id", q.getId(),
            "content", q.getContent(),
            "explanation", Optional.ofNullable(q.getExplanation()).orElse(""),
            "options", q.getOptions().stream().map(o -> Map.of(
                "id", o.getId(),
                "content", o.getContent(),
                "display_order", o.getDisplayOrder(),
                "is_correct", o.isCorrect()
            )).toList()
        );
    }

    // GET /api/exams — student: open/scheduled/completed; admin: all
    @GetMapping
    public ResponseEntity<?> list(Authentication auth) {
        var authorities = auth.getAuthorities();
        boolean isAdmin = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        List<Exam> list = isAdmin ? db.exams :
            db.exams.stream().filter(e -> List.of("open","scheduled","completed").contains(e.getStatus())).toList();
        return ResponseEntity.ok(list.stream().map(e -> examToMap(e, false)).toList());
    }

    // GET /api/exams/:id — detail with questions
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        return db.findExamById(id)
            .map(e -> ResponseEntity.ok(examToMap(e, true)))
            .orElse(ResponseEntity.status(404).build());
    }

    // POST /api/exams
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body, Authentication auth) {
        String newId = "ex" + (db.exams.size() + 1);
        Exam e = new Exam();
        e.setId(newId);
        e.setTitle((String) body.getOrDefault("title", "Bài thi mới"));
        e.setSubject((String) body.getOrDefault("subject", ""));
        e.setDescription((String) body.getOrDefault("description", ""));
        e.setType((String) body.getOrDefault("type", "practice"));
        e.setStatus((String) body.getOrDefault("status", "draft"));
        e.setDuration(toInt(body.getOrDefault("duration", 60)));
        e.setTotalScore(toDouble(body.getOrDefault("totalScore", 10)));
        e.setPassingScore(toDouble(body.getOrDefault("passingScore", 5)));
        e.setStartTime((String) body.get("startTime"));
        e.setEndTime((String) body.get("endTime"));
        e.setAllowRetake(Boolean.TRUE.equals(body.getOrDefault("allowRetake", false)));
        e.setCreatedBy((String) auth.getPrincipal());
        e.setCreatedAt(Instant.now().toString().substring(0, 10));
        e.setQuestionCount(0);
        e.setAttempts(0);
        db.exams.add(e);
        return ResponseEntity.status(201).body(Map.of("id", newId, "message", "Exam created successfully"));
    }

    // PUT /api/exams/:id
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<Exam> opt = db.findExamById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy bài thi"));
        Exam e = opt.get();
        if (body.containsKey("title"))       e.setTitle((String) body.get("title"));
        if (body.containsKey("subject"))     e.setSubject((String) body.get("subject"));
        if (body.containsKey("description")) e.setDescription((String) body.get("description"));
        if (body.containsKey("type"))        e.setType((String) body.get("type"));
        if (body.containsKey("status"))      e.setStatus((String) body.get("status"));
        if (body.containsKey("duration"))    e.setDuration(toInt(body.get("duration")));
        if (body.containsKey("totalScore"))  e.setTotalScore(toDouble(body.get("totalScore")));
        if (body.containsKey("passingScore"))e.setPassingScore(toDouble(body.get("passingScore")));
        if (body.containsKey("startTime"))   e.setStartTime((String) body.get("startTime"));
        if (body.containsKey("endTime"))     e.setEndTime((String) body.get("endTime"));
        if (body.containsKey("allowRetake")) e.setAllowRetake(Boolean.TRUE.equals(body.get("allowRetake")));
        return ResponseEntity.ok(Map.of("message", "Exam updated successfully"));
    }

    // DELETE /api/exams/:id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        boolean removed = db.exams.removeIf(e -> e.getId().equals(id));
        if (removed) db.questions.remove(id);
        return removed
            ? ResponseEntity.ok(Map.of("message", "Exam deleted successfully"))
            : ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy bài thi"));
    }

    // POST /api/exams/:examId/questions — add single question
    @PostMapping("/{examId}/questions")
    public ResponseEntity<?> addQuestion(@PathVariable String examId, @RequestBody Map<String, Object> body) {
        if (db.findExamById(examId).isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy bài thi"));
        List<Question> qs = new ArrayList<>(db.getQuestions(examId));
        String qId = examId + "q" + (qs.size() + 1);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> opts = (List<Map<String, Object>>) body.get("options");
        List<QuestionOption> options = new ArrayList<>();
        if (opts != null) {
            for (var opt : opts) {
                options.add(new QuestionOption(
                    qId + "o" + options.size(),
                    (String) opt.getOrDefault("content", ""),
                    toInt(opt.getOrDefault("display_order", options.size())),
                    Boolean.TRUE.equals(opt.get("is_correct"))
                ));
            }
        }
        qs.add(new Question(qId, (String) body.get("content"), (String) body.get("explanation"), options));
        db.questions.put(examId, qs);
        db.findExamById(examId).ifPresent(e -> e.setQuestionCount(qs.size()));
        return ResponseEntity.status(201).body(Map.of("id", qId, "message", "Question added successfully"));
    }

    // PUT /api/exams/:examId/questions — replace all questions
    @PutMapping("/{examId}/questions")
    public ResponseEntity<?> replaceQuestions(@PathVariable String examId, @RequestBody List<Map<String, Object>> body) {
        if (db.findExamById(examId).isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy bài thi"));
        List<Question> qs = new ArrayList<>();
        for (var qBody : body) {
            String qId = examId + "q" + qs.size();
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> opts = (List<Map<String, Object>>) qBody.get("options");
            List<QuestionOption> options = new ArrayList<>();
            if (opts != null) {
                for (var opt : opts) {
                    options.add(new QuestionOption(
                        qId + "o" + options.size(),
                        (String) opt.getOrDefault("content", ""),
                        toInt(opt.getOrDefault("display_order", options.size())),
                        Boolean.TRUE.equals(opt.get("is_correct"))
                    ));
                }
            }
            qs.add(new Question(qId, (String) qBody.get("content"), (String) qBody.get("explanation"), options));
        }
        db.questions.put(examId, qs);
        db.findExamById(examId).ifPresent(e -> e.setQuestionCount(qs.size()));
        return ResponseEntity.ok(Map.of("message", "Questions updated successfully"));
    }

    // DELETE /api/exams/:examId/questions/:questionId
    @DeleteMapping("/{examId}/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String examId, @PathVariable String questionId) {
        List<Question> qs = new ArrayList<>(db.getQuestions(examId));
        boolean removed = qs.removeIf(q -> q.getId().equals(questionId));
        if (!removed) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy câu hỏi"));
        db.questions.put(examId, qs);
        db.findExamById(examId).ifPresent(e -> e.setQuestionCount(qs.size()));
        return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
    }

    private int toInt(Object v) {
        if (v instanceof Number n) return n.intValue();
        try { return Integer.parseInt(v.toString()); } catch (Exception e) { return 0; }
    }
    private double toDouble(Object v) {
        if (v instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(v.toString()); } catch (Exception e) { return 0; }
    }
}
