package vn.ptit.pexam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.ptit.pexam.data.MockDataStore;
import vn.ptit.pexam.model.User;
import vn.ptit.pexam.security.JwtUtil;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MockDataStore db;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu username hoặc password"));

        Optional<User> userOpt = db.findByUsername(username);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password))
            return ResponseEntity.status(401).body(Map.of("message", "Tên đăng nhập hoặc mật khẩu không đúng"));

        User u = userOpt.get();
        String token = jwtUtil.generateToken(u.getId(), u.getUsername(), u.getRole());
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "token", token,
            "user", Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "name", u.getName(),
                "email", Optional.ofNullable(u.getEmail()).orElse(""),
                "role", u.getRole(),
                "avatar", Optional.ofNullable(u.getAvatar()).orElse(""),
                "student_id", Optional.ofNullable(u.getStudentId()).orElse(""),
                "class_name", Optional.ofNullable(u.getClassName()).orElse("")
            )
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String name     = body.get("name");
        String email    = body.get("email");

        if (username == null || username.length() < 4)
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập phải ít nhất 4 ký tự"));
        if (!username.matches("[a-zA-Z0-9_]+"))
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập chỉ gồm chữ, số và dấu gạch dưới"));
        if (password == null || password.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu phải ít nhất 6 ký tự"));
        if (db.findByUsername(username).isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại"));

        String avatar = (name != null && !name.isBlank())
            ? ("" + name.charAt(name.lastIndexOf(' ') > 0 ? name.lastIndexOf(' ') + 1 : 0)).toUpperCase()
            : "U";

        User newUser = new User(db.nextUserId(), username, password, name, email, "student", avatar, null, null);
        db.users.add(newUser);

        return ResponseEntity.status(201).body(Map.of("id", newUser.getId(), "message", "Đăng ký thành công"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Chưa đăng nhập"));
        String userId = (String) auth.getPrincipal();
        Optional<User> userOpt = db.findUserById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "Người dùng không tồn tại"));
        User u = userOpt.get();
        return ResponseEntity.ok(Map.of("user", Map.of(
            "id", u.getId(),
            "username", u.getUsername(),
            "name", u.getName(),
            "email", Optional.ofNullable(u.getEmail()).orElse(""),
            "role", u.getRole(),
            "avatar", Optional.ofNullable(u.getAvatar()).orElse(""),
            "student_id", Optional.ofNullable(u.getStudentId()).orElse(""),
            "class_name", Optional.ofNullable(u.getClassName()).orElse("")
        )));
    }
}
