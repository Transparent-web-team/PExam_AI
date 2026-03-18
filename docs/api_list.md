# Danh sách API – Hệ thống Thi Trắc Nghiệm PExam

> **Stack:** Node.js · Express.js · MSSQL (SQL Server)  
> **Base URL:** `http://localhost:5000`  
> **Auth:** JWT Bearer Token — `Authorization: Bearer <token>`

---

## Quy ước chung

| Ký hiệu | Ý nghĩa |
|---|---|
| 🔓 | Public – không cần token |
| 🔐 | Cần xác thực (Admin hoặc Student) |
| 👑 | Chỉ Admin mới được gọi |

### Cấu trúc Response lỗi chuẩn
```json
{ "message": "Mô tả lỗi" }
```

---

## 1. Auth – `/api/auth`

### `POST /api/auth/login` 🔓
Đăng nhập, nhận JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response 200:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Quản trị viên",
    "email": "admin@ptit.edu.vn",
    "student_id": null,
    "role": "admin",
    "class_name": null,
    "avatar": "AD"
  }
}
```

**Errors:** `400 Bad Request` (thiếu field) · `401 Unauthorized` (sai user/pass) · `500`

---

### `POST /api/auth/register` 🔓
Đăng ký tài khoản mới (dùng trong quá trình dev/test).

**Request Body:**
```json
{
  "username": "sv001",
  "password": "123456",
  "name": "Nguyễn Văn A",
  "email": "sv001@ptit.edu.vn",
  "role": "student"
}
```

**Response 201:**
```json
{ "id": 5, "message": "User registered successfully" }
```

**Errors:** `400` (thiếu field / trùng username) · `500`

---

### `GET /api/auth/me` 🔐
Lấy thông tin người dùng hiện tại từ JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "user": {
    "id": 2,
    "username": "sv001",
    "name": "Nguyễn Văn A",
    "email": "sv001@ptit.edu.vn",
    "student_id": "B21DCCN001",
    "role": "student",
    "class_name": "D21CQCN01-B",
    "avatar": "NA"
  }
}
```

**Errors:** `401 Unauthorized` · `404 Not Found` · `500`

---

## 2. Users – `/api/users` 👑

> Tất cả route trong nhóm này yêu cầu token **Admin**.

### `GET /api/users` 👑
Lấy danh sách toàn bộ người dùng.

**Response 200:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "name": "Quản trị viên",
    "email": "admin@ptit.edu.vn",
    "student_id": null,
    "role": "admin",
    "class_name": null,
    "avatar": "AD"
  },
  {
    "id": 2,
    "username": "sv001",
    "name": "Nguyễn Văn A",
    "email": "sv001@ptit.edu.vn",
    "student_id": "B21DCCN001",
    "role": "student",
    "class_name": "D21CQCN01-B",
    "avatar": "NA"
  }
]
```

---

### `GET /api/users/:id` 👑
Lấy thông tin một người dùng cụ thể.

**Path Param:** `id` — ID số nguyên của user

**Response 200:**
```json
{
  "id": 2,
  "username": "sv001",
  "name": "Nguyễn Văn A",
  "email": "sv001@ptit.edu.vn",
  "student_id": "B21DCCN001",
  "role": "student",
  "class_name": "D21CQCN01-B",
  "avatar": "NA"
}
```

**Errors:** `404 Not Found` · `500`

---

### `POST /api/users` 👑
Tạo người dùng mới (Admin tạo thay).

**Request Body:**
```json
{
  "username": "sv002",
  "password": "123456",
  "name": "Trần Thị B",
  "email": "sv002@ptit.edu.vn",
  "studentId": "B21DCCN002",
  "role": "student",
  "className": "D21CQCN01-B",
  "avatar": "TB"
}
```

**Response 201:**
```json
{ "id": 6, "message": "User created successfully" }
```

**Errors:** `400` (thiếu field / trùng username/email/studentId) · `500`

---

### `PUT /api/users/:id` 👑
Cập nhật thông tin người dùng. Chỉ gửi các field cần thay đổi.

**Path Param:** `id`

**Request Body** _(tất cả optional)_:
```json
{
  "name": "Trần Thị B (updated)",
  "email": "sv002_new@ptit.edu.vn",
  "password": "newpass123",
  "studentId": "B21DCCN002",
  "role": "student",
  "className": "D21CQCN02-B",
  "avatar": "TB"
}
```

**Response 200:**
```json
{ "message": "User updated successfully" }
```

**Errors:** `404 Not Found` · `500`

---

### `DELETE /api/users/:id` 👑
Xóa người dùng. Không thể tự xóa chính mình.

**Path Param:** `id`

**Response 200:**
```json
{ "message": "User deleted successfully" }
```

**Errors:** `400` (xóa chính mình) · `500`

---

## 3. Exams – `/api/exams` 🔐

### `GET /api/exams` 🔐
Lấy danh sách bài thi.

- **Admin:** Trả về tất cả bài thi (mọi trạng thái)
- **Student:** Chỉ thấy bài thi có status `open`, `scheduled`, `completed`

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Lập trình OOP – Giữa kỳ",
    "subject": "OOP",
    "description": "Bài thi giữa kỳ môn Lập trình Hướng đối tượng",
    "type": "midterm",
    "status": "open",
    "duration": 60,
    "question_count": 30,
    "total_score": 10.0,
    "passing_score": 5.0,
    "start_time": "2026-03-15T08:00:00.000Z",
    "end_time": "2026-03-15T10:00:00.000Z",
    "allow_retake": false,
    "created_by": 1,
    "created_at": "2026-03-10T14:00:00.000Z"
  }
]
```

---

### `GET /api/exams/:id` 🔐
Lấy chi tiết một bài thi kèm toàn bộ câu hỏi và đáp án.

**Path Param:** `id`

**Response 200:**
```json
{
  "id": 1,
  "title": "Lập trình OOP – Giữa kỳ",
  "subject": "OOP",
  "duration": 60,
  "question_count": 2,
  "total_score": 10.0,
  "questions": [
    {
      "id": 101,
      "exam_id": 1,
      "content": "Tính đóng gói trong OOP là gì?",
      "explanation": "Encapsulation là che giấu dữ liệu nội bộ...",
      "options": [
        { "id": 401, "question_id": 101, "content": "Che giấu dữ liệu", "display_order": 0, "is_correct": true },
        { "id": 402, "question_id": 101, "content": "Kế thừa thuộc tính", "display_order": 1, "is_correct": false },
        { "id": 403, "question_id": 101, "content": "Đa hình", "display_order": 2, "is_correct": false },
        { "id": 404, "question_id": 101, "content": "Trừu tượng hóa", "display_order": 3, "is_correct": false }
      ]
    }
  ]
}
```

**Errors:** `404 Not Found` · `500`

---

### `POST /api/exams` 👑
Tạo bài thi mới (chưa có câu hỏi).

**Request Body:**
```json
{
  "title": "Lập trình OOP – Cuối kỳ",
  "subject": "OOP",
  "description": "Bài thi cuối kỳ",
  "type": "final",
  "status": "draft",
  "duration": 90,
  "questionCount": 0,
  "totalScore": 10,
  "passingScore": 5,
  "startTime": "2026-05-10T08:00:00",
  "endTime": "2026-05-10T10:30:00",
  "allowRetake": false
}
```

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `title` | string | ✅ | Tên bài thi |
| `subject` | string | ✅ | Môn học |
| `description` | string | ❌ | Mô tả |
| `type` | string | ❌ | `practice`/`midterm`/`final` (default: `practice`) |
| `status` | string | ❌ | `draft`/`scheduled`/`open`/`completed` (default: `draft`) |
| `duration` | int | ❌ | Phút (default: 60) |
| `totalScore` | number | ❌ | (default: 10) |
| `passingScore` | number | ❌ | (default: 5) |
| `startTime` | datetime | ❌ | ISO 8601 |
| `endTime` | datetime | ❌ | ISO 8601 |
| `allowRetake` | boolean | ❌ | (default: false) |

**Response 201:**
```json
{ "id": 3, "message": "Exam created successfully" }
```

---

### `PUT /api/exams/:id` 👑
Cập nhật thông tin bài thi.

**Path Param:** `id`

**Request Body** _(tương tự POST, tất cả optional)_:
```json
{
  "status": "open",
  "startTime": "2026-05-10T08:00:00"
}
```

**Response 200:**
```json
{ "message": "Exam updated successfully" }
```

---

### `DELETE /api/exams/:id` 👑
Xóa bài thi.

**Response 200:**
```json
{ "message": "Exam deleted successfully" }
```

---

### `POST /api/exams/:examId/questions` 👑
Thêm một câu hỏi (kèm đáp án) vào bài thi.

**Path Param:** `examId`

**Request Body:**
```json
{
  "content": "Abstract class khác interface ở điểm nào?",
  "explanation": "Abstract class có thể có phương thức có thân hàm, còn interface thì không (trước Java 8).",
  "options": [
    { "content": "Abstract class có thể có constructor", "is_correct": false, "display_order": 0 },
    { "content": "Abstract class có thể có phương thức có thân hàm", "is_correct": true, "display_order": 1 },
    { "content": "Interface cho phép đa kế thừa", "is_correct": false, "display_order": 2 },
    { "content": "Abstract class không có thuộc tính", "is_correct": false, "display_order": 3 }
  ]
}
```

**Response 201:**
```json
{ "id": 105, "message": "Question added successfully" }
```

---

### `PUT /api/exams/:examId/questions` 👑
**Thay thế toàn bộ** danh sách câu hỏi của bài thi (dùng khi import từ CSV/Excel hoặc lưu hàng loạt từ editor).

**Path Param:** `examId`

**Request Body:** _(mảng câu hỏi)_
```json
[
  {
    "content": "Câu hỏi 1",
    "explanation": "Giải thích câu 1",
    "options": [
      { "content": "Đáp án A", "is_correct": true, "display_order": 0 },
      { "content": "Đáp án B", "is_correct": false, "display_order": 1 },
      { "content": "Đáp án C", "is_correct": false, "display_order": 2 },
      { "content": "Đáp án D", "is_correct": false, "display_order": 3 }
    ]
  }
]
```

**Response 200:**
```json
{ "message": "Questions updated successfully" }
```

---

### `DELETE /api/exams/:examId/questions/:questionId` 👑
Xóa một câu hỏi khỏi bài thi.

**Response 200:**
```json
{ "message": "Question deleted successfully" }
```

---

## 4. Results – `/api/results` 🔐

### `POST /api/results/submit` 🔐
Nộp bài thi. Server sẽ tự tính điểm.

**Request Body:**
```json
{
  "examId": 1,
  "duration": 2340,
  "answers": [
    { "questionId": 101, "selectedOptionId": 401 },
    { "questionId": 102, "selectedOptionId": 405 },
    { "questionId": 103, "selectedOptionId": null }
  ]
}
```

| Field | Type | Mô tả |
|---|---|---|
| `examId` | int | ID bài thi |
| `duration` | int | Thời gian làm bài (giây) |
| `answers` | array | Mảng câu trả lời |
| `answers[].questionId` | int | ID câu hỏi |
| `answers[].selectedOptionId` | int/null | ID đáp án đã chọn (null nếu bỏ trống) |

**Response 201:**
```json
{
  "message": "Exam submitted successfully",
  "result": {
    "id": 50,
    "score": 8.33,
    "correctAnswers": 25,
    "totalQuestions": 30,
    "examTotalScore": 10
  }
}
```

**Errors:** `400` (payload không hợp lệ) · `404` (exam không tồn tại) · `500`

---

### `GET /api/results/my-results` 🔐
Lấy lịch sử tất cả bài đã thi của người dùng hiện tại.

**Response 200:**
```json
[
  {
    "id": 50,
    "user_id": 2,
    "exam_id": 1,
    "score": 8.33,
    "correct_answers": 25,
    "total_questions": 30,
    "duration": 2340,
    "submit_time": "2026-03-15T09:39:00.000Z",
    "exam_title": "Lập trình OOP – Giữa kỳ",
    "subject": "OOP",
    "exam_total_score": 10.0
  }
]
```

---

### `GET /api/results/exam-result/:examId` 🔐
Lấy kết quả của người dùng hiện tại cho một bài thi cụ thể, kèm chi tiết đáp án đã chọn.

**Path Param:** `examId`

**Response 200:**
```json
{
  "id": 50,
  "user_id": 2,
  "exam_id": 1,
  "score": 8.33,
  "correct_answers": 25,
  "total_questions": 30,
  "exam_total_score": 10.0,
  "passing_score": 5.0,
  "exam_title": "Lập trình OOP – Giữa kỳ",
  "submit_time": "2026-03-15T09:39:00.000Z",
  "studentAnswers": [
    {
      "question_id": 101,
      "selected_option_id": 401,
      "selected_option_order": 0,
      "question_content": "Tính đóng gói trong OOP là gì?"
    }
  ]
}
```

**Errors:** `404 Not Found` · `500`

---

### `GET /api/results/exam/:examId` 👑
Xem tất cả kết quả của một bài thi (dành cho Admin).

**Path Param:** `examId`

**Response 200:**
```json
[
  {
    "id": 50,
    "user_id": 2,
    "exam_id": 1,
    "score": 8.33,
    "correct_answers": 25,
    "total_questions": 30,
    "submit_time": "2026-03-15T09:39:00.000Z",
    "username": "sv001",
    "name": "Nguyễn Văn A",
    "student_id": "B21DCCN001",
    "class_name": "D21CQCN01-B"
  }
]
```

---

### `GET /api/results` 👑
Lấy tất cả kết quả thi trong hệ thống (Admin).

**Response 200:**
```json
[
  {
    "id": 50,
    "score": 8.33,
    "correct_answers": 25,
    "total_questions": 30,
    "submit_time": "2026-03-15T09:39:00.000Z",
    "exam_title": "Lập trình OOP – Giữa kỳ",
    "subject": "OOP",
    "username": "sv001",
    "user_name": "Nguyễn Văn A"
  }
]
```

---

## 5. Bảng tổng hợp API

| # | Method | Endpoint | Auth | Mô tả |
|---|---|---|---|---|
| 1 | POST | `/api/auth/login` | 🔓 | Đăng nhập |
| 2 | POST | `/api/auth/register` | 🔓 | Đăng ký tài khoản |
| 3 | GET | `/api/auth/me` | 🔐 | Lấy thông tin bản thân |
| 4 | GET | `/api/users` | 👑 | Danh sách người dùng |
| 5 | GET | `/api/users/:id` | 👑 | Chi tiết người dùng |
| 6 | POST | `/api/users` | 👑 | Tạo người dùng |
| 7 | PUT | `/api/users/:id` | 👑 | Sửa người dùng |
| 8 | DELETE | `/api/users/:id` | 👑 | Xóa người dùng |
| 9 | GET | `/api/exams` | 🔐 | Danh sách bài thi |
| 10 | GET | `/api/exams/:id` | 🔐 | Chi tiết bài thi + câu hỏi |
| 11 | POST | `/api/exams` | 👑 | Tạo bài thi |
| 12 | PUT | `/api/exams/:id` | 👑 | Sửa bài thi |
| 13 | DELETE | `/api/exams/:id` | 👑 | Xóa bài thi |
| 14 | POST | `/api/exams/:examId/questions` | 👑 | Thêm câu hỏi |
| 15 | PUT | `/api/exams/:examId/questions` | 👑 | Thay thế toàn bộ câu hỏi |
| 16 | DELETE | `/api/exams/:examId/questions/:questionId` | 👑 | Xóa câu hỏi |
| 17 | POST | `/api/results/submit` | 🔐 | Nộp bài thi |
| 18 | GET | `/api/results/my-results` | 🔐 | Lịch sử thi của mình |
| 19 | GET | `/api/results/exam-result/:examId` | 🔐 | Kết quả chi tiết theo bài |
| 20 | GET | `/api/results/exam/:examId` | 👑 | Tất cả kết quả 1 bài thi |
| 21 | GET | `/api/results` | 👑 | Tất cả kết quả hệ thống |

---

## 6. API còn thiếu / đề xuất bổ sung

| API đề xuất | Mục đích |
|---|---|
| `GET /api/results/student/:userId` | Admin xem toàn bộ lịch sử thi của 1 sinh viên |
| `GET /api/exams/stats` | Thống kê tổng quan: số bài thi, sinh viên thi, điểm TB |
| `POST /api/auth/change-password` | Tự đổi mật khẩu |
| `GET /api/users/search?q=...` | Tìm kiếm sinh viên theo tên/mã SV |
| `GET /api/exams/:examId/stats` | Thống kê điểm của 1 bài thi cụ thể |
| `POST /api/exams/:examId/import` | Import câu hỏi từ file CSV/Excel |
