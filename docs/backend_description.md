# Mô tả Backend – PExam (Spring Boot)

> **Stack:** Java 21 · Spring Boot 3.x · Spring Security 6 + JWT · PostgreSQL · Flyway · OpenAPI 3

---

## 1. Tổng quan kiến trúc

PExam backend được xây dựng theo mô hình **Layered Architecture (MVC mở rộng)**:

```
Frontend (HTML/JS)
        ↓ HTTP / REST API
┌─────────────────────────────────────┐
│          Controller Layer           │  ← Nhận request, validate input, trả response
│  (Spring MVC @RestController)       │
├─────────────────────────────────────┤
│           Service Layer             │  ← Business logic, tính điểm, phân quyền nghiệp vụ
│  (@Service, @Transactional)         │
├─────────────────────────────────────┤
│         Repository Layer            │  ← Truy vấn DB (Spring Data JPA)
│  (JpaRepository / custom queries)  │
├─────────────────────────────────────┤
│        Entity / Domain Layer        │  ← Ánh xạ bảng DB (JPA Entity, UUID PK)
│  (Hibernate ORM)                    │
└─────────────────────────────────────┘
        ↓
   PostgreSQL 15+
```

---

## 2. Cấu trúc thư mục dự án

```
pexam-backend/
├── src/main/java/vn/ptit/pexam/
│   ├── PExamApplication.java           ← Entry point
│   ├── config/
│   │   ├── SecurityConfig.java         ← Spring Security, JWT filter, CORS
│   │   ├── SwaggerConfig.java          ← OpenAPI 3 / Swagger UI
│   │   └── RedisConfig.java            ← Cache config (tùy chọn)
│   ├── controller/
│   │   ├── AuthController.java         ← /auth/**, /me
│   │   ├── AdminUserController.java    ← /admin/users/**
│   │   ├── SubjectController.java      ← /subjects/**
│   │   ├── QuestionController.java     ← /questions/**
│   │   ├── ClassController.java        ← /classes/**
│   │   ├── ExamTemplateController.java ← /exam-templates/**
│   │   ├── ExamEventController.java    ← /exam-events/**
│   │   ├── AttemptController.java      ← /attempts/**
│   │   └── SystemController.java       ← /system/health
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── SubjectService.java
│   │   ├── QuestionService.java
│   │   ├── ClassService.java
│   │   ├── ExamTemplateService.java
│   │   ├── ExamEventService.java
│   │   ├── AttemptService.java         ← Tính điểm, autosave, submit
│   │   └── GradebookService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ExamTemplateRepository.java
│   │   ├── ExamEventRepository.java
│   │   ├── AttemptRepository.java
│   │   └── ...
│   ├── entity/
│   │   ├── User.java
│   │   ├── Subject.java
│   │   ├── Question.java
│   │   ├── QuestionOption.java
│   │   ├── ExamClass.java
│   │   ├── ExamTemplate.java
│   │   ├── TemplateQuestion.java
│   │   ├── ExamEvent.java
│   │   ├── Attempt.java
│   │   └── StudentAnswer.java
│   ├── dto/
│   │   ├── request/                    ← Input DTOs (validated)
│   │   └── response/                  ← Output DTOs (clean response)
│   ├── security/
│   │   ├── JwtTokenProvider.java       ← Tạo & xác thực JWT
│   │   ├── JwtAuthFilter.java          ← Filter gắn vào SecurityChain
│   │   └── UserDetailsServiceImpl.java ← Load user từ DB
│   └── exception/
│       ├── GlobalExceptionHandler.java ← @ControllerAdvice xử lý lỗi
│       └── ...
├── src/main/resources/
│   ├── application.yml                 ← Cấu hình app (port, DB, JWT, Redis)
│   └── db/migration/
│       ├── V1__create_tables.sql       ← Flyway migration: tạo bảng
│       ├── V2__seed_data.sql           ← Flyway migration: dữ liệu mẫu
│       └── ...
└── pom.xml                             ← Maven dependencies
```

---

## 3. Cơ sở dữ liệu (PostgreSQL + Flyway)

### 3.1. Sơ đồ Entity (ERD tóm tắt)

```
users ──────────────── exam_class_students ─── exam_classes
  │                                               │
  │ (created_by)                                  │ (class_id)
  ↓                                               ↓
exam_templates ────── template_questions ──── questions ── question_options
  │                                               │
  │ (template_id)                                 └── subject_id ── subjects
  ↓
exam_events ─── attempts ─── student_answers
```

### 3.2. Các bảng chính

| Bảng | Mô tả | PK |
|---|---|---|
| `users` | Tài khoản (role: STUDENT/TEACHER/ADMIN) | UUID |
| `subjects` | Môn học | UUID |
| `questions` | Câu hỏi (level: EASY/MEDIUM/HARD) | UUID |
| `question_options` | Đáp án A/B/C/D, is_correct | UUID |
| `exam_classes` | Lớp học (code, semester) | UUID |
| `exam_class_students` | Quan hệ nhiều-nhiều user ↔ class | — |
| `exam_templates` | Đề thi (shuffle, duration) | UUID |
| `template_questions` | Quan hệ đề ↔ câu hỏi + điểm | — |
| `exam_events` | Kỳ thi (lịch, attemptLimit, passScore) | UUID |
| `attempts` | Lần làm bài (startedAt, submittedAt, score) | UUID |
| `student_answers` | Đáp án sinh viên đã chọn | UUID |

### 3.3. Flyway Migration

Schema được quản lý qua file SQL versioned trong `db/migration/`:
- `V1__create_tables.sql` — Tạo toàn bộ bảng
- `V2__seed_data.sql` — Insert dữ liệu mẫu (admin, môn học, câu hỏi mẫu)
- Mỗi thay đổi schema → tạo file `V{n+1}__description.sql` mới

---

## 4. Bảo mật (Spring Security 6 + JWT)

### 4.1. Luồng xác thực

```
[Client] POST /auth/login
    → [AuthController] → [AuthService] → [UserDetailsServiceImpl]
    → So sánh password (BCryptPasswordEncoder)
    → [JwtTokenProvider.generateAccessToken()] → accessToken (15–60 phút)
    → [JwtTokenProvider.generateRefreshToken()] → refreshToken (7 ngày)
    → Trả về { accessToken, refreshToken, user }

[Client] GET /me (kèm Bearer token)
    → [JwtAuthFilter] lấy token từ header
    → [JwtTokenProvider.validateToken()]
    → Gắn Authentication vào SecurityContextHolder
    → Request đến Controller bình thường
```

### 4.2. Phân quyền

| Annotation / Config | Áp dụng |
|---|---|
| `@PreAuthorize("hasRole('ADMIN')")` | Chỉ Admin |
| `@PreAuthorize("hasAnyRole('ADMIN','TEACHER')")` | Admin hoặc Teacher |
| `permitAll()` trong SecurityConfig | Public endpoints |
| `authenticated()` | Tất cả role cần token |

### 4.3. Refresh Token

- accessToken hết hạn sau **1 giờ** (configurable)
- refreshToken hết hạn sau **7 ngày**
- `POST /auth/refresh` → server verify refreshToken → cấp accessToken mới
- `POST /auth/logout` → đưa refreshToken vào **blacklist** (Redis hoặc DB)

---

## 5. Xử lý Logic Quan trọng

### 5.1. Bắt đầu làm bài (`POST /exam-events/{eventId}/attempts`)

1. Kiểm tra sinh viên có trong lớp của kỳ thi không
2. Kiểm tra kỳ thi đang trong thời gian cho phép (`startAt ≤ now ≤ endAt`)
3. Kiểm tra số lần đã thi không vượt `attemptLimit`
4. Lấy danh sách câu hỏi từ template, **shuffle** nếu `shuffleQuestions = true`
5. Shuffle từng đáp án nếu `shuffleOptions = true`
6. Tạo bản ghi `attempts` với `startedAt`, `expiresAt`
7. Trả về đề thi **không có đáp án đúng** (`correctKeys` bị ẩn)

### 5.2. Autosave (`PUT /attempts/{id}/answers`)

1. Kiểm tra attempt còn hạn (`now < expiresAt`)
2. Kiểm tra attempt chưa submit (`submittedAt IS NULL`)
3. Upsert bảng `student_answers` cho từng câu được gửi
4. Trả về `remainingTime`

### 5.3. Nộp bài và Tính điểm (`POST /attempts/{id}/submit`)

1. Lock attempt (đánh dấu `submittedAt = now`)
2. Fetch tất cả `student_answers` + `correctKeys` từ DB
3. Tính điểm từng câu: `pointsEarned = points nếu selectedKeys == correctKeys, else 0`
4. Tổng điểm → `score = Σ pointsEarned`
5. So sánh với `passScore` → set `passed`
6. Lưu vào bảng `attempts`

---

## 6. Validate Input (Jakarta Bean Validation)

```java
// Ví dụ DTO có validation
public class LoginRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 8)
    private String password;
}

// GlobalExceptionHandler xử lý MethodArgumentNotValidException → 422
```

---

## 7. API Documentation (Swagger UI)

Sau khi chạy server:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

---

## 8. Cấu hình (`application.yml`)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/pexam
    username: postgres
    password: 123456
  jpa:
    hibernate:
      ddl-auto: validate  # Flyway quản lý schema, JPA chỉ validate
  flyway:
    enabled: true
    locations: classpath:db/migration

jwt:
  secret: "super_secret_key_for_pexam_2026_spring_boot"
  access-token-expiry: 3600      # 1 giờ (giây)
  refresh-token-expiry: 604800   # 7 ngày (giây)

redis:  # Tùy chọn
  host: localhost
  port: 6379
```

---

## 9. Khởi động dự án

```bash
# Yêu cầu: Java 21, Maven 3.9+, PostgreSQL 15+

# 1. Tạo database
createdb pexam

# 2. Build project
mvn clean package -DskipTests

# 3. Chạy server
java -jar target/pexam-backend-1.0.0.jar

# Hoặc dùng Maven
mvn spring-boot:run

# Hoặc Docker Compose (tùy chọn)
docker-compose up -d
```

---

## 10. Dependencies (pom.xml)

| Dependency | Mục đích |
|---|---|
| `spring-boot-starter-web` | REST API (Spring MVC) |
| `spring-boot-starter-security` | Spring Security 6 |
| `spring-boot-starter-data-jpa` | JPA / Hibernate ORM |
| `spring-boot-starter-validation` | Jakarta Bean Validation |
| `spring-boot-starter-actuator` | Health check & metrics |
| `postgresql` | PostgreSQL JDBC driver |
| `flyway-core` | Database migration |
| `jjwt-api` + `jjwt-impl` | JWT (JJWT library) |
| `springdoc-openapi-starter-webmvc-ui` | Swagger UI / OpenAPI 3 |
| `spring-boot-starter-data-redis` | Redis cache (tùy chọn) |
| `lombok` | Giảm boilerplate (getter/setter) |
