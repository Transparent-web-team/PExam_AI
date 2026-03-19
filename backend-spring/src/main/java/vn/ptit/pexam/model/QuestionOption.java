package vn.ptit.pexam.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class QuestionOption {
    private String id;
    private String content;
    private int displayOrder;
    private boolean isCorrect;
}
