package vn.ptit.pexam.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class ExamResult {
    private String id;
    private String userId;
    private String examId;
    private double score;
    private int correctAnswers;
    private int totalQuestions;
    private int duration; // minutes
    private String submitTime;
    private List<Integer> answers; // display_order of selected option per question, -1 = skipped
}
