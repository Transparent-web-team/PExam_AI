# Danh sách API – Hệ thống Thi Trắc Nghiệm PExam

> **Stack:** Node.js · Express.js · MSSQL (SQL Server)  
> **Base URL:** `http://localhost:5000`  
> **Auth:** JWT Bearer Token — `Authorization: Bearer <token>`

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|---|---|
| 🔓 | Public – không cần token |
| 🔐 | Cần xác thực (Admin hoặc Student) |
| 👑 | Chỉ Admin |

**Response lỗi chuẩn:** `{ "message": "Mô tả lỗi" }`

---

## 1. Auth – `/api/auth`

### `POST /api/auth/login` 🔓
**Input:**
```json
{ "username": "admin", "password": "123456" }
```
**Output 200:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "username": "admin", "name": "Quản trị viên", "role": "admin" }
}
```
**Errors:** `400` thiếu field · `401` sai user/pass · `500`

---

### `POST /api/auth/register` 🔓
**Input:**
```json
{ "username": "sv001", "password": "123456", "name": "Nguyễn Văn A", "email": "sv001@ptit.edu.vn", "role": "student" }
```
**Output 201:** `{ "id": 5, "message": "User registered successfully" }`

**Errors:** `400` trùng username · `500`

---

### `GET /api/auth/me` 🔐
**Output 200:**
```json
{
  "user": {
    "id": 2, "username": "sv001", "name": "Nguyễn Văn A",
    "email": "sv001@ptit.edu.vn", "student_id": "B21DCCN001",
    "role": "student", "class_name": "D21CQCN01-B", "avatar": "NA"
  }
}
```
**Errors:** `401` · `404` · `500`

---

## 2. Users – `/api/users` 👑

### `GET /api/users` 👑
Danh sách toàn bộ người dùng (không có password_hash).

---

### `GET /api/users/:id` 👑
Chi tiết một người dùng.

**Errors:** `404` · `500`

---

### `POST /api/users` 👑
**Input:**
```json
{
  "username": "sv002", "password": "123456", "name": "Trần Thị B",
  "email": "sv002@ptit.edu.vn", "studentId": "B21DCCN002",
  "role": "student", "className": "D21CQCN01-B", "avatar": "TB"
}
```
**Output 201:** `{ "id": 6, "message": "User created successfully" }`

---

### `PUT /api/users/:id` 👑
Tất cả field đều optional:
```json
{ "name": "...", "email": "...", "password": "...", "className": "...", "role": "...", "avatar": "..." }
```
**Output 200:** `{ "message": "User updated successfully" }`

---

### `DELETE /api/users/:id` 👑
**Output 200:** `{ "message": "User deleted successfully" }`

**Errors:** `400` xóa chính mình · `500`

---

## 3. Exams – `/api/exams` 🔐

### `GET /api/exams` 🔐
- **Admin:** Tất cả bài thi  
- **Student:** Chỉ status `open`, `scheduled`, `completed`

**Output 200:** Mảng exam objects.

---

### `GET /api/exams/:id` 🔐
Chi tiết bài thi **kèm toàn bộ câu hỏi và đáp án** (is_correct được trả về để trang kết quả dùng).

**Output 200:**
```json
{
  "id": 1, "title": "Lập trình OOP – Giữa kỳ", "duration": 60,
  "question_count": 2, "total_score": 10.0,
  "questions": [
    {
      "id": 101, "content": "Tính đóng gói trong OOP là gì?",
      "explanation": "Encapsulation là...",
      "options": [
        { "id": 401, "content": "Che giấu dữ liệu", "display_order": 0, "is_correct": true },
        { "id": 402, "content": "Kế thừa thuộc tính", "display_order": 1, "is_correct": false }
      ]
    }
  ]
}
```

**Errors:** `404` · `500`

---

### `POST /api/exams` 👑
**Input:**

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `title` | string | ✅ | Tên bài thi |
| `subject` | string | ✅ | Môn học |
| `description` | string | ❌ | Mô tả |
| `type` | string | ❌ | `practice`/`midterm`/`final` |
| `status` | string | ❌ | `draft`/`scheduled`/`open`/`completed` |
| `duration` | int | ❌ | Phút (default: 60) |
| `totalScore` | number | ❌ | (default: 10) |
| `passingScore` | number | ❌ | (default: 5) |
| `startTime` | datetime | ❌ | ISO 8601 |
| `endTime` | datetime | ❌ | ISO 8601 |
| `allowRetake` | boolean | ❌ | (default: false) |

**Output 201:** `{ "id": 3, "message": "Exam created successfully" }`

---

### `PUT /api/exams/:id` 👑
Giống POST, tất cả optional. **Output 200:** `{ "message": "Exam updated successfully" }`

---

### `DELETE /api/exams/:id` 👑
**Output 200:** `{ "message": "Exam deleted successfully" }`

---

### `POST /api/exams/:examId/questions` 👑
Thêm một câu hỏi + đáp án vào bài thi (dùng transaction).

**Input:**
```json
{
  "content": "Abstract class khác interface ở điểm nào?",
  "explanation": "Abstract class có thể có phương thức có thân hàm...",
  "options": [
    { "content": "Abstract class có thể có constructor", "is_correct": false, "display_order": 0 },
    { "content": "Abstract class có thể có phương thức có thân hàm", "is_correct": true, "display_order": 1 },
    { "content": "Interface cho phép đa kế thừa", "is_correct": false, "display_order": 2 },
    { "content": "Abstract class không có thuộc tính", "is_correct": false, "display_order": 3 }
  ]
}
```
**Output 201:** `{ "id": 105, "message": "Question added successfully" }`

---

### `PUT /api/exams/:examId/questions` 👑
**Thay thế toàn bộ** câu hỏi (dùng khi import CSV hoặc lưu từ editor).

**Input:** Mảng câu hỏi (tương tự POST bên trên).

**Output 200:** `{ "message": "Questions updated successfully" }`

---

### `DELETE /api/exams/:examId/questions/:questionId` 👑
**Output 200:** `{ "message": "Question deleted successfully" }`

---

## 4. Results – `/api/results` 🔐

### `POST /api/results/submit` 🔐
Nộp bài. **Server tự tính điểm** (không tin client-side).

**Input:**
```json
{
  "examId": 1,
  "duration": 2340,
  "answers": [
    { "questionId": 101, "selectedOptionId": 401 },
    { "questionId": 102, "selectedOptionId": null }
  ]
}
```

**Output 201:**
```json
{
  "message": "Exam submitted successfully",
  "result": {
    "id": 50, "score": 8.33,
    "correctAnswers": 25, "totalQuestions": 30, "examTotalScore": 10
  }
}
```
**Errors:** `400` payload không hợp lệ · `404` exam không tồn tại · `500`

---

### `GET /api/results/my-results` 🔐
Lịch sử tất cả bài đã thi của người dùng hiện tại.

**Output 200:** Mảng kết quả kèm `exam_title`, `subject`, `exam_total_score`.

---

### `GET /api/results/exam-result/:examId` 🔐
Kết quả + chi tiết đáp án đã chọn của user hiện tại cho 1 bài thi.

**Output 200:**
```json
{
  "id": 50, "score": 8.33, "correct_answers": 25, "total_questions": 30,
  "exam_total_score": 10.0, "passing_score": 5.0, "exam_title": "...",
  "studentAnswers": [
    { "question_id": 101, "selected_option_id": 401, "selected_option_order": 0, "question_content": "..." }
  ]
}
```

**Errors:** `404` · `500`

---

### `GET /api/results/exam/:examId` 👑
Tất cả kết quả của 1 bài thi (Admin).

**Output 200:** Mảng kết quả kèm `username`, `name`, `student_id`, `class_name`.

---

### `GET /api/results` 👑
Tất cả kết quả trong hệ thống (Admin).

---

## 5. Bảng tổng hợp

| # | Method | Endpoint | Auth | Mô tả |
|---|---|---|---|---|
| 1 | POST | `/api/auth/login` | 🔓 | Đăng nhập |
| 2 | POST | `/api/auth/register` | 🔓 | Đăng ký tài khoản |
| 3 | GET | `/api/auth/me` | 🔐 | Thông tin bản thân |
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
| 18 | GET | `/api/results/my-results` | 🔐 | Lịch sử thi của tôi |
| 19 | GET | `/api/results/exam-result/:examId` | 🔐 | Kết quả chi tiết 1 bài |
| 20 | GET | `/api/results/exam/:examId` | 👑 | Tất cả kết quả 1 bài |
| 21 | GET | `/api/results` | 👑 | Tất cả kết quả hệ thống |

---

## 6. API đề xuất bổ sung

| API | Mục đích |
|---|---|
| `GET /api/results/student/:userId` | Admin xem lịch sử thi của 1 sinh viên |
| `POST /api/auth/change-password` | Tự đổi mật khẩu |
| `GET /api/users/search?q=...` | Tìm kiếm sinh viên theo tên/mã SV |
| `GET /api/exams/:examId/stats` | Thống kê điểm của 1 bài thi |
