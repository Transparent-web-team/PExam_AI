package vn.ptit.pexam.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class Exam {
    private String id;
    private String title;
    private String subject;
    private String description;
    private String type;       // practice | midterm | final
    private String status;     // open | scheduled | completed | draft
    private int duration;      // minutes
    private int questionCount;
    private double totalScore;
    private double passingScore;
    private String startTime;
    private String endTime;
    private String createdBy;
    private String createdAt;
    private int attempts;
    private boolean allowRetake;
    private List<Question> questions; // null when listing, populated for detail
}
