package vn.ptit.pexam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.ptit.pexam.data.MockDataStore;
import vn.ptit.pexam.model.User;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final MockDataStore db;

    private Map<String, Object> toMap(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("name", u.getName());
        m.put("email", Optional.ofNullable(u.getEmail()).orElse(""));
        m.put("role", u.getRole());
        m.put("avatar", Optional.ofNullable(u.getAvatar()).orElse(""));
        m.put("student_id", Optional.ofNullable(u.getStudentId()).orElse(""));
        m.put("class_name", Optional.ofNullable(u.getClassName()).orElse(""));
        return m;
    }

    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(db.users.stream().map(this::toMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return db.findUserById(id)
            .map(u -> ResponseEntity.ok(toMap(u)))
            .orElse(ResponseEntity.status(404).build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        if (username == null || db.findByUsername(username).isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập không hợp lệ hoặc đã tồn tại"));
        User u = new User(
            db.nextUserId(),
            username,
            Optional.ofNullable(body.get("password")).orElse("123456"),
            body.get("name"),
            body.get("email"),
            Optional.ofNullable(body.get("role")).orElse("student"),
            body.get("avatar"),
            body.get("studentId"),
            body.get("className")
        );
        db.users.add(u);
        return ResponseEntity.status(201).body(Map.of("id", u.getId(), "message", "User created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<User> opt = db.findUserById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy user"));
        User u = opt.get();
        if (body.containsKey("name"))      u.setName(body.get("name"));
        if (body.containsKey("email"))     u.setEmail(body.get("email"));
        if (body.containsKey("avatar"))    u.setAvatar(body.get("avatar"));
        if (body.containsKey("role"))      u.setRole(body.get("role"));
        if (body.containsKey("className")) u.setClassName(body.get("className"));
        if (body.containsKey("password"))  u.setPassword(body.get("password"));
        return ResponseEntity.ok(Map.of("message", "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id, Authentication auth) {
        String currentUserId = (String) auth.getPrincipal();
        if (currentUserId.equals(id))
            return ResponseEntity.badRequest().body(Map.of("message", "Không thể xóa chính mình"));
        boolean removed = db.users.removeIf(u -> u.getId().equals(id));
        return removed
            ? ResponseEntity.ok(Map.of("message", "User deleted successfully"))
            : ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy user"));
    }
}
