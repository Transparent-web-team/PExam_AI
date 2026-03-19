package vn.ptit.pexam.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class Question {
    private String id;
    private String content;
    private String explanation;
    private List<QuestionOption> options;
}
