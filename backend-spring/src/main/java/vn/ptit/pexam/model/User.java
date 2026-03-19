package vn.ptit.pexam.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class User {
    private String id;
    private String username;
    private String password;
    private String name;
    private String email;
    private String role; // "admin" | "student"
    private String avatar;
    private String studentId;
    private String className;
}
