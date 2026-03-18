# BÁO CÁO THIẾT KẾ API – Hệ thống PExam (Spring Boot)

> **Stack:** Spring Boot 3.x · Spring Security 6 + JWT · PostgreSQL · Flyway · OpenAPI 3 / Swagger UI  
> **Base URL:** `http://localhost:8080/api/v1`  
> **Auth:** JWT Bearer — `Authorization: Bearer <accessToken>`

---

## Quy ước chung

| Ký hiệu | Ý nghĩa |
|---|---|
| 🔓 | Public – không cần token |
| 🔐 | Cần xác thực (bất kỳ role) |
| 👨‍🎓 | Student only |
| 👨‍🏫 | Teacher hoặc Admin |
| 👑 | Admin only |

### Cấu trúc Response chuẩn
```json
{
  "success": true | false,
  "data": { ... },
  "message": "Mô tả kết quả"
}
```

### Cấu trúc Pagination chuẩn
```json
"pagination": {
  "page": 1, "size": 20,
  "total": 120, "totalPages": 6
}
```

---

## 1. Xác Thực & Tài Khoản `/auth`, `/me`

### `POST /auth/register` 🔓
Sinh viên tự đăng ký tài khoản.

**Input:**
```json
{ "email": "sv01@edu.vn", "password": "Secret123!", "fullName": "Nguyen Van A" }
```
**Output 201:**
```json
{
  "success": true,
  "data": { "userId": "uuid", "email": "sv01@edu.vn", "role": "STUDENT" },
  "message": "Đăng ký thành công"
}
```
**Errors:** `400` email tồn tại · `422` dữ liệu không hợp lệ

---

### `POST /auth/login` 🔓
Đăng nhập, nhận accessToken + refreshToken.

**Input:**
```json
{ "email": "admin@edu.vn", "password": "Secret123!" }
```
**Output 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600,
    "user": { "id": "uuid", "email": "admin@edu.vn", "fullName": "Admin User", "role": "ADMIN" }
  },
  "message": "Đăng nhập thành công"
}
```
**Errors:** `401` sai mật khẩu · `404` email không tồn tại

---

### `POST /auth/refresh` 🔓
Làm mới accessToken mà không cần đăng nhập lại.

**Input:** `{ "refreshToken": "eyJ..." }`

**Output 200:**
```json
{ "success": true, "data": { "accessToken": "eyJ...", "expiresIn": 3600 } }
```
**Errors:** `401` refresh token không hợp lệ

---

### `POST /auth/logout` 🔐
Vô hiệu hóa refresh token.

**Input:** `{ "refreshToken": "eyJ..." }`

**Output 200:** `{ "success": true, "data": { "loggedOut": true }, "message": "Đã đăng xuất" }`

---

### `GET /me` 🔐
Lấy thông tin người dùng hiện tại.

**Output 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid", "email": "sv01@edu.vn", "fullName": "Nguyen Van A",
    "role": "STUDENT", "createdAt": "2026-03-10T00:00:00Z", "lastLoginAt": "2026-03-13T08:30:00Z"
  }
}
```

---

### `PUT /me/password` 🔐
Đổi mật khẩu (yêu cầu mật khẩu cũ).

**Input:** `{ "oldPassword": "Secret123!", "newPassword": "NewSecret123!" }`

**Output 200:** `{ "success": true, "data": { "changed": true }, "message": "Mật khẩu đã được thay đổi" }`

**Errors:** `400` mật khẩu cũ sai · `422` mật khẩu mới không đủ mạnh

---

## 2. Quản Trị Người Dùng `/admin/users` 👑

### `GET /admin/users` 👑
Danh sách user, lọc theo role/keyword, phân trang.

**Query:** `?keyword=nguyen&role=STUDENT&page=1&size=20`

**Output 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "email": "sv01@edu.vn", "fullName": "Nguyen Van A",
        "role": "STUDENT", "status": "ACTIVE", "createdAt": "2026-03-10T00:00:00Z" }
    ],
    "pagination": { "page": 1, "size": 20, "total": 120, "totalPages": 6 }
  }
}
```

---

### `POST /admin/users` 👑
Admin tạo tài khoản cho sinh viên/giáo viên.

**Input:**
```json
{ "email": "gv01@edu.vn", "password": "Secret123!", "fullName": "Teacher B", "role": "TEACHER" }
```
**Output 201:** `{ "success": true, "data": { "id": "uuid", "email": "gv01@edu.vn", "fullName": "Teacher B", "role": "TEACHER", "status": "ACTIVE" }, "message": "Tài khoản đã được tạo" }`

---

### `PATCH /admin/users/{id}/status` 👑
Khóa (LOCKED) hoặc mở (ACTIVE) tài khoản.

**Input:** `{ "status": "LOCKED" }`

**Output 200:** `{ "success": true, "data": { "id": "uuid", "status": "LOCKED" }, "message": "Trạng thái tài khoản đã được cập nhật" }`

---

## 3. Môn Học `/subjects`

### `GET /subjects` 🔐
Danh sách tất cả môn học.

**Output 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "code": "MATH", "name": "Toán" },
      { "id": "uuid", "code": "ENG", "name": "Tiếng Anh" }
    ]
  }
}
```

---

### `POST /subjects` 👑
**Input:** `{ "code": "MATH", "name": "Toán" }`

**Output 201:** `{ "success": true, "data": { "id": "uuid", "code": "MATH", "name": "Toán" }, "message": "Môn học đã được tạo" }`

**Errors:** `400` code trùng · `403`

---

### `PUT /subjects/{id}` 👑
**Input:** `{ "code": "MATH", "name": "Toán Cao Cấp" }`

**Output 200:** `{ "success": true, "data": { "id": "uuid", "code": "MATH", "name": "Toán Cao Cấp" }, "message": "Môn học đã được cập nhật" }`

---

### `DELETE /subjects/{id}` 👑
**Output 200:** `{ "success": true, "data": { "deleted": true }, "message": "Môn học đã được xóa" }`

**Errors:** `404` · `409` có câu hỏi liên kết

---

## 4. Ngân Hàng Câu Hỏi `/questions`

### `POST /questions` 👨‍🏫
Tạo câu hỏi trắc nghiệm (hỗ trợ nhiều đáp án đúng).

**Input:**
```json
{
  "subjectId": "uuid",
  "content": "1 + 1 = ?",
  "level": "EASY",
  "options": [
    { "key": "A", "text": "1" }, { "key": "B", "text": "2" },
    { "key": "C", "text": "3" }, { "key": "D", "text": "4" }
  ],
  "correctKeys": ["B"],
  "explanation": "1 + 1 = 2 (phép cộng cơ bản)",
  "tags": ["basic", "arithmetic"]
}
```
**Output 201:** `{ "success": true, "data": { "id": "uuid", "subjectId": "uuid", "content": "1 + 1 = ?", "level": "EASY", "createdAt": "..." }, "message": "Câu hỏi đã được tạo" }`

---

### `PUT /questions/{id}` 👨‍🏫
Cập nhật câu hỏi. **Input:** tương tự POST.

**Output 200:** `{ "success": true, "data": { "id": "uuid", "updatedAt": "..." }, "message": "Câu hỏi đã được cập nhật" }`

---

### `DELETE /questions/{id}` 👨‍🏫
Xóa câu hỏi (nếu chưa được dùng trong đề thi nào).

**Output 200:** `{ "success": true, "data": { "deleted": true }, "message": "Câu hỏi đã được xóa" }`

**Errors:** `404` · `409` đã được dùng trong đề

---

### `GET /questions` 👨‍🏫
Danh sách câu hỏi, lọc theo môn/level, phân trang.

**Query:** `?subjectId=uuid&level=EASY&page=1&size=20`

**Output 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid", "subjectId": "uuid", "content": "1 + 1 = ?", "level": "EASY",
        "options": [{"key":"A","text":"1"},{"key":"B","text":"2"},{"key":"C","text":"3"},{"key":"D","text":"4"}],
        "correctKeys": ["B"], "tags": ["basic"], "createdAt": "..."
      }
    ],
    "pagination": { "page": 1, "size": 20, "total": 150, "totalPages": 8 }
  }
}
```

---

### `POST /questions/import` 👨‍🏫
Import câu hỏi từ file Excel/CSV.

**Input:** `multipart/form-data` — `file: <file.xlsx>`, `subjectId: uuid`

**Output 200:**
```json
{
  "success": true,
  "data": {
    "imported": 100, "failed": 2,
    "errors": [
      { "row": 5, "message": "Thiếu nội dung câu hỏi" },
      { "row": 12, "message": "Số đáp án không hợp lệ" }
    ]
  },
  "message": "Import hoàn tất. 100 thành công, 2 thất bại"
}
```

---

## 5. Lớp Học `/classes` 👑

### `POST /classes` 👑
**Input:** `{ "code": "SE123", "name": "Lớp SE123", "semester": "2025-2026-2" }`

**Output 201:** `{ "success": true, "data": { "id": "uuid", "code": "SE123", "name": "Lớp SE123", "semester": "2025-2026-2", "studentCount": 0 }, "message": "Lớp học đã được tạo" }`

---

### `GET /classes` 👑
**Query:** `?page=1&size=20`

**Output 200:** Danh sách lớp học kèm `studentCount` và `pagination`.

---

### `POST /classes/{id}/students` 👑
Thêm 1 hoặc nhiều sinh viên vào lớp.

**Input:** `{ "studentIds": ["uuid1", "uuid2"] }`

**Output 200:** `{ "success": true, "data": { "added": 2, "alreadyExist": 0 }, "message": "Đã thêm 2 sinh viên vào lớp" }`

---

### `DELETE /classes/{id}/students/{studentId}` 👑
**Output 200:** `{ "success": true, "data": { "removed": true }, "message": "Đã xóa sinh viên khỏi lớp" }`

---

## 6. Đề Thi `/exam-templates`

### `POST /exam-templates` 👨‍🏫
Tạo đề thi từ ngân hàng câu hỏi.

**Input:**
```json
{
  "title": "Đề thi Toán Kỳ 1",
  "subjectId": "uuid",
  "durationMinutes": 45,
  "shuffleQuestions": true,
  "shuffleOptions": true,
  "questions": [
    { "questionId": "uuid1", "points": 1 },
    { "questionId": "uuid2", "points": 2 }
  ]
}
```
**Output 201:** `{ "success": true, "data": { "id": "uuid", "title": "...", "totalQuestions": 2, "totalPoints": 3, "createdAt": "..." }, "message": "Đề thi đã được tạo" }`

---

### `GET /exam-templates/{id}` 👨‍🏫
Chi tiết đề thi kèm danh sách câu hỏi.

**Output 200:** Trả về đầy đủ: `id`, `title`, `subjectName`, `durationMinutes`, `shuffleQuestions`, `shuffleOptions`, `totalQuestions`, `totalPoints`, `questions[]`.

---

### `PUT /exam-templates/{id}` 👨‍🏫
Cập nhật đề. **Input:** tương tự POST.

---

### `DELETE /exam-templates/{id}` 👨‍🏫
Xóa đề (nếu chưa tạo kỳ thi từ đề này).

**Errors:** `409` đã có kỳ thi liên kết

---

### `GET /exam-templates` 👨‍🏫
**Query:** `?subjectId=uuid&page=1&size=20`

**Output 200:** Danh sách đề với `id`, `title`, `subjectName`, `totalQuestions`, `totalPoints`, `createdAt` và `pagination`.

---

## 7. Kỳ Thi `/exam-events`

### `POST /exam-events` 👨‍🏫
Tạo kỳ thi từ đề, gán cho lớp, đặt lịch.

**Input:**
```json
{
  "templateId": "uuid",
  "classId": "uuid",
  "title": "Kỳ thi Toán Giữa Kỳ - Lớp SE123",
  "startAt": "2026-03-20T08:00:00Z",
  "endAt": "2026-03-20T09:00:00Z",
  "attemptLimit": 1,
  "passScore": 5.0
}
```
**Output 201:** `{ "success": true, "data": { "id": "uuid", "title": "...", "status": "SCHEDULED", "startAt": "...", "endAt": "..." }, "message": "Kỳ thi đã được tạo" }`

---

### `GET /exam-events/{id}` 🔐
Chi tiết kỳ thi (sinh viên chỉ thấy kỳ thi của lớp mình).

**Output 200:** Trả về `id`, `title`, `templateId`, `classId`, `className`, `startAt`, `endAt`, `durationMinutes`, `attemptLimit`, `passScore`, `status`, `totalStudents`, `submittedAttempts`.

---

### `GET /exam-events` 🔐
Danh sách kỳ thi. Sinh viên thấy lớp mình; Admin/Teacher thấy tất cả.

**Query:** `?classId=uuid&status=SCHEDULED&page=1&size=20`

---

## 8. Làm Bài (Attempt) `/exam-events/{eventId}/attempts`, `/attempts`

### `POST /exam-events/{eventId}/attempts` 👨‍🎓
Sinh viên bắt đầu làm bài (tạo attempt mới).

**Input:** `{ "clientInfo": { "device": "web", "userAgent": "..." } }`

**Output 201:**
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "startedAt": "2026-03-20T08:10:00Z",
    "expiresAt": "2026-03-20T08:55:00Z",
    "remainingTime": 2700,
    "exam": {
      "eventId": "uuid", "title": "...", "durationMinutes": 45,
      "totalQuestions": 2, "totalPoints": 3,
      "questions": [
        {
          "questionId": "uuid", "content": "1 + 1 = ?",
          "options": [{"key":"A","text":"1"},{"key":"B","text":"2"},{"key":"C","text":"3"},{"key":"D","text":"4"}],
          "points": 1, "order": 1
        }
      ]
    }
  },
  "message": "Bài thi đã bắt đầu"
}
```
**Errors:** `400` hết thời gian / đã hết lần thi · `403` không phải sinh viên của lớp

---

### `PUT /attempts/{attemptId}/answers` 👨‍🎓
Lưu đáp án (autosave, gọi liên tục khi làm bài).

**Input:**
```json
{
  "answers": [
    { "questionId": "uuid1", "selectedKeys": ["B"] },
    { "questionId": "uuid2", "selectedKeys": ["A", "D"] }
  ]
}
```
**Output 200:** `{ "success": true, "data": { "saved": true, "savedAt": "...", "remainingTime": 2100 }, "message": "Đáp án đã được lưu" }`

**Errors:** `400` attempt hết hạn

---

### `POST /attempts/{attemptId}/submit` 👨‍🎓
Nộp bài (không thể sửa sau đó). Server tự chấm điểm.

**Input:** `{ "confirm": true }`

**Output 200:**
```json
{
  "success": true,
  "data": {
    "submitted": true, "attemptId": "uuid",
    "score": 8.5, "totalPoints": 10,
    "correctCount": 17, "totalQuestions": 20,
    "passScore": 5.0, "passed": true,
    "submittedAt": "2026-03-20T08:40:00Z"
  },
  "message": "Bài thi đã được nộp. Bạn đã vượt qua (8.5/10)"
}
```

---

### `GET /attempts/{attemptId}/result` 🔐
Xem kết quả chi tiết (đáp án đúng/sai, giải thích, điểm từng câu).

**Output 200:**
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid", "eventTitle": "...",
    "score": 8.5, "totalPoints": 10,
    "correctCount": 17, "totalQuestions": 20, "passScore": 5.0, "passed": true,
    "submittedAt": "...",
    "details": [
      {
        "questionId": "uuid", "order": 1, "content": "1 + 1 = ?",
        "selectedKeys": ["B"], "correctKeys": ["B"],
        "isCorrect": true, "pointsEarned": 1, "totalPoints": 1,
        "explanation": "1 + 1 = 2 (phép cộng cơ bản)"
      }
    ]
  }
}
```

---

### `GET /me/exam-attempts` 👨‍🎓
Lịch sử thi của sinh viên hiện tại.

**Query:** `?page=1&size=10`

**Output 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      { "attemptId": "uuid", "eventTitle": "...", "score": 8.5, "totalPoints": 10, "passed": true, "submittedAt": "..." }
    ],
    "pagination": { "page": 1, "size": 10, "total": 5, "totalPages": 1 }
  }
}
```

---

## 9. Báo Cáo & Thống Kê `/exam-events/{eventId}/...`

### `GET /exam-events/{eventId}/gradebook` 👨‍🏫
Bảng điểm theo kỳ thi (phân trang, có thể sort).

**Query:** `?page=1&size=20&sortBy=score&sortOrder=desc`

**Output 200:**
```json
{
  "success": true,
  "data": {
    "eventId": "uuid", "eventTitle": "...",
    "totalStudents": 35, "submitted": 34, "notSubmitted": 1,
    "avgScore": 7.2, "passRate": 0.97,
    "items": [
      { "studentId": "uuid", "studentName": "Nguyen Van A", "email": "sv01@edu.vn",
        "score": 9.5, "totalPoints": 10, "correctCount": 19, "totalQuestions": 20,
        "passed": true, "submittedAt": "..." }
    ],
    "pagination": { "page": 1, "size": 20, "total": 34, "totalPages": 2 }
  }
}
```

---

### `GET /exam-events/{eventId}/question-stats` 👨‍🏫
Thống kê độ khó và tỉ lệ trả lời đúng từng câu hỏi.

**Output 200:**
```json
{
  "success": true,
  "data": {
    "eventId": "uuid", "totalAttempts": 34,
    "items": [
      {
        "questionId": "uuid", "order": 1, "content": "1 + 1 = ?", "level": "EASY",
        "correctRate": 0.97, "attemptCount": 34, "correctCount": 33,
        "optionPickRate": { "A": 0.03, "B": 0.97, "C": 0.0, "D": 0.0 }
      }
    ]
  }
}
```

---

## 10. Hệ Thống `/system`

### `GET /system/health` 🔓
Health check (dùng cho monitoring/Spring Boot Actuator).

**Output 200:**
```json
{
  "success": true,
  "data": {
    "status": "UP", "timestamp": "2026-03-13T12:00:00Z",
    "components": { "database": "UP", "redis": "UP", "memory": "UP" }
  }
}
```

---

## Bảng Tổng Hợp API

| # | Method | Endpoint | Auth | Mô tả |
|---|---|---|---|---|
| 1 | POST | `/auth/register` | 🔓 | Đăng ký tài khoản |
| 2 | POST | `/auth/login` | 🔓 | Đăng nhập |
| 3 | POST | `/auth/refresh` | 🔓 | Làm mới token |
| 4 | POST | `/auth/logout` | 🔐 | Đăng xuất |
| 5 | GET | `/me` | 🔐 | Xem profile |
| 6 | PUT | `/me/password` | 🔐 | Đổi mật khẩu |
| 7 | GET | `/admin/users` | 👑 | Danh sách user |
| 8 | POST | `/admin/users` | 👑 | Tạo user |
| 9 | PATCH | `/admin/users/{id}/status` | 👑 | Khóa/mở tài khoản |
| 10 | GET | `/subjects` | 🔐 | Danh sách môn học |
| 11 | POST | `/subjects` | 👑 | Tạo môn học |
| 12 | PUT | `/subjects/{id}` | 👑 | Sửa môn học |
| 13 | DELETE | `/subjects/{id}` | 👑 | Xóa môn học |
| 14 | GET | `/questions` | 👨‍🏫 | Danh sách câu hỏi |
| 15 | POST | `/questions` | 👨‍🏫 | Tạo câu hỏi |
| 16 | PUT | `/questions/{id}` | 👨‍🏫 | Sửa câu hỏi |
| 17 | DELETE | `/questions/{id}` | 👨‍🏫 | Xóa câu hỏi |
| 18 | POST | `/questions/import` | 👨‍🏫 | Import từ Excel/CSV |
| 19 | POST | `/classes` | 👑 | Tạo lớp |
| 20 | GET | `/classes` | 👑 | Danh sách lớp |
| 21 | POST | `/classes/{id}/students` | 👑 | Thêm SV vào lớp |
| 22 | DELETE | `/classes/{id}/students/{studentId}` | 👑 | Xóa SV khỏi lớp |
| 23 | POST | `/exam-templates` | 👨‍🏫 | Tạo đề thi |
| 24 | GET | `/exam-templates` | 👨‍🏫 | Danh sách đề |
| 25 | GET | `/exam-templates/{id}` | 👨‍🏫 | Chi tiết đề |
| 26 | PUT | `/exam-templates/{id}` | 👨‍🏫 | Sửa đề |
| 27 | DELETE | `/exam-templates/{id}` | 👨‍🏫 | Xóa đề |
| 28 | POST | `/exam-events` | 👨‍🏫 | Tạo kỳ thi |
| 29 | GET | `/exam-events` | 🔐 | Danh sách kỳ thi |
| 30 | GET | `/exam-events/{id}` | 🔐 | Chi tiết kỳ thi |
| 31 | POST | `/exam-events/{eventId}/attempts` | 👨‍🎓 | Bắt đầu làm bài |
| 32 | PUT | `/attempts/{attemptId}/answers` | 👨‍🎓 | Lưu đáp án (autosave) |
| 33 | POST | `/attempts/{attemptId}/submit` | 👨‍🎓 | Nộp bài |
| 34 | GET | `/attempts/{attemptId}/result` | 🔐 | Xem kết quả chi tiết |
| 35 | GET | `/me/exam-attempts` | 👨‍🎓 | Lịch sử thi của tôi |
| 36 | GET | `/exam-events/{eventId}/gradebook` | 👨‍🏫 | Bảng điểm kỳ thi |
| 37 | GET | `/exam-events/{eventId}/question-stats` | 👨‍🏫 | Thống kê câu hỏi |
| 38 | GET | `/system/health` | 🔓 | Health check |

---

## Công Nghệ Triển Khai

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Spring Boot** | 3.x | Framework backend chính |
| **Spring Security 6 + JWT** | 6.x | Xác thực & phân quyền |
| **Spring Data JPA / Hibernate** | — | ORM – tầng dữ liệu |
| **PostgreSQL** | 15+ | Cơ sở dữ liệu quan hệ |
| **Flyway** | — | Database migration (version control schema) |
| **OpenAPI 3 / Swagger UI** | — | Tự sinh tài liệu API tương tác |
| **Jakarta Bean Validation** | — | Validate input (`@NotBlank`, `@Email`...) |
| **Redis** *(tùy chọn)* | — | Cache token blacklist & session |
| **Docker + Docker Compose** *(tùy chọn)* | — | Container hóa toàn bộ stack |
| **Spring Boot Actuator** *(tùy chọn)* | — | Health check & monitoring |
