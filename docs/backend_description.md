# Mô tả Backend – Hệ thống PExam

> **Stack:** Node.js · Express.js 5 · Microsoft SQL Server (MSSQL) · JWT · bcryptjs

---

## 1. Tổng quan kiến trúc

Hệ thống backend PExam được xây dựng theo mô hình **MVC phân tầng** (Model–View–Controller), trong đó:

- **Model** → Lớp dữ liệu: `db/database.js` (kết nối & khởi tạo DB, seed data)
- **Controller** → Logic xử lý: các file trong `routes/` (mỗi file = 1 nhóm tài nguyên)
- **Middleware** → Bảo vệ route: `middleware/auth.js` (JWT verify, role check)
- **View** → Không có (backend là REST API thuần, frontend độc lập)

```
PExam/backend/
├── server.js               ← Entry point, khởi tạo Express app
├── .env                    ← Biến môi trường (cổng, JWT secret, DB config)
├── package.json            ← Khai báo dependencies
├── db/
│   └── database.js         ← Kết nối MSSQL, tạo bảng, seed data
├── middleware/
│   └── auth.js             ← JWT authentication & role authorization
└── routes/
    ├── auth.js             ← Đăng nhập, đăng ký, lấy thông tin bản thân
    ├── users.js            ← CRUD người dùng (Admin only)
    ├── exams.js            ← CRUD bài thi + quản lý câu hỏi (Admin + Student)
    └── results.js          ← Nộp bài, lấy kết quả thi
```

---

## 2. Cấu hình & Khởi động

### 2.1. Biến môi trường (`.env`)

| Biến | Ví dụ | Mô tả |
|---|---|---|
| `PORT` | `5000` | Cổng Express server lắng nghe |
| `JWT_SECRET` | `super_secret_...` | Khóa ký JWT token |
| `DB_USER` | `sa` | Tên đăng nhập SQL Server |
| `DB_PASSWORD` | `123456` | Mật khẩu SQL Server |
| `DB_SERVER` | `localhost` | Server/host SQL Server |
| `DB_NAME` | `pexam` | Tên database |

### 2.2. Khởi động server (`server.js`)

Luồng khởi động:
1. Load `.env` bằng `dotenv`
2. Khởi tạo Express app, gắn CORS và JSON middleware
3. Gọi `initDb()` → tạo bảng nếu chưa có → seed dữ liệu mẫu nếu DB rỗng
4. Đăng ký các route: `/api/auth`, `/api/users`, `/api/exams`, `/api/results`
5. Lắng nghe trên `PORT`

```bash
# Cài dependencies
cd backend && npm install

# Chạy development (tự reload khi sửa code)
npm run dev

# Chạy production
npm start
```

---

## 3. Lớp Cơ sở dữ liệu (`db/database.js`)

### 3.1. Kết nối MSSQL (Connection Pool)

```javascript
// Singleton pool – chỉ tạo 1 lần, tái dụng mọi request
async function getDbConnection() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config).connect();
    }
    return poolPromise;
}
```

Cấu hình sử dụng `trustServerCertificate: true` cho môi trường dev local.

### 3.2. Khởi tạo bảng (`initDb`)

Hàm `initDb()` tạo **6 bảng** với kiểm tra `IF NOT EXISTS`:

| Bảng | Mô tả |
|---|---|
| `users` | Tài khoản sinh viên & admin |
| `exams` | Thông tin đề thi |
| `questions` | Câu hỏi của từng đề thi |
| `question_options` | Đáp án A/B/C/D cho mỗi câu hỏi |
| `exam_results` | Kết quả mỗi lần nộp bài của sinh viên |
| `student_answers` | Chi tiết đáp án sinh viên đã chọn |

**Cascade delete:** `questions` ON DELETE CASCADE từ `exams`; `question_options` ON DELETE CASCADE từ `questions`; `student_answers` ON DELETE CASCADE từ `exam_results`.

### 3.3. Dữ liệu mẫu (Seed Data)

Nếu bảng `users` rỗng, hệ thống sẽ tự tạo:
- **6 tài khoản:** 5 sinh viên (`sinhvien01`–`05`, pass: `123456`) + 1 admin (`admin`, pass: `admin123`)
- **6 đề thi mẫu:**
  - Lập trình Web (15 câu, practice, open)
  - Cơ sở dữ liệu (10 câu, midterm, open)
  - Mạng máy tính (15 câu, final, scheduled – 10/06/2026)
  - Lập trình OOP (20 câu, practice, open)
  - An toàn thông tin (10 câu, practice, open)
  - Hệ điều hành (10 câu, midterm, open)
- **Kết quả mẫu** cho `sinhvien01` và `sinhvien02`

---

## 4. Middleware xác thực (`middleware/auth.js`)

### 4.1. `authenticateToken` – Xác thực JWT

Kiểm tra header `Authorization: Bearer <token>`:
- Token không có → `401 Unauthorized`
- Token không hợp lệ / hết hạn → `403 Forbidden`
- Token hợp lệ → gắn `req.user = { id, username, role }` và gọi `next()`

### 4.2. `requireAdmin` – Kiểm tra quyền Admin

Được dùng sau `authenticateToken`:
- `req.user.role !== 'admin'` → `403 Forbidden`
- Là admin → gọi `next()`

---

## 5. Routes (Controllers)

### 5.1. `routes/auth.js` – Xác thực người dùng

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Đăng nhập, nhận JWT |
| POST | `/api/auth/register` | Public | Đăng ký tài khoản mới |
| GET | `/api/auth/me` | 🔐 Token | Lấy thông tin user hiện tại |

**Logic đăng nhập:**
1. Tìm user theo `username` trong DB
2. So sánh password với `bcrypt.compare()`
3. Tạo JWT với payload `{ id, username, role }`, hết hạn sau 24h
4. Trả về token + thông tin user (đã loại `password_hash`)

### 5.2. `routes/users.js` – Quản lý người dùng (Admin only)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/users` | Danh sách người dùng |
| GET | `/api/users/:id` | Chi tiết một người dùng |
| POST | `/api/users` | Tạo người dùng mới |
| PUT | `/api/users/:id` | Cập nhật thông tin (dynamic UPDATE) |
| DELETE | `/api/users/:id` | Xóa người dùng (không thể tự xóa mình) |

**Lưu ý kỹ thuật:** `PUT /api/users/:id` xây dựng câu SQL động, chỉ UPDATE các field được truyền.

### 5.3. `routes/exams.js` – Quản lý bài thi & câu hỏi

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/exams` | 🔐 | Student thấy open/scheduled/completed; Admin thấy tất cả |
| GET | `/api/exams/:id` | 🔐 | Chi tiết bài thi + toàn bộ câu hỏi + đáp án |
| POST | `/api/exams` | 👑 Admin | Tạo bài thi (chưa có câu hỏi) |
| PUT | `/api/exams/:id` | 👑 Admin | Sửa thông tin bài thi |
| DELETE | `/api/exams/:id` | 👑 Admin | Xóa bài thi |
| POST | `/api/exams/:examId/questions` | 👑 Admin | Thêm một câu hỏi + đáp án (có transaction) |
| PUT | `/api/exams/:examId/questions` | 👑 Admin | Thay thế toàn bộ câu hỏi (bulk replace) |
| DELETE | `/api/exams/:examId/questions/:questionId` | 👑 Admin | Xóa một câu hỏi |

**Lưu ý kỹ thuật:**
- Các thao tác câu hỏi đều dùng **MSSQL Transaction** để đảm bảo tính nhất quán
- Sau mỗi thao tác câu hỏi, `question_count` của bảng `exams` được cập nhật tự động
- `PUT /:examId/questions` xóa toàn bộ câu hỏi cũ trước khi chèn mới (dùng khi import từ CSV)

### 5.4. `routes/results.js` – Kết quả thi

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/results/submit` | 🔐 | Nộp bài: server tự tính điểm |
| GET | `/api/results/my-results` | 🔐 | Lịch sử thi của bản thân |
| GET | `/api/results/exam-result/:examId` | 🔐 | Kết quả + chi tiết đáp án đã chọn |
| GET | `/api/results/exam/:examId` | 👑 Admin | Tất cả kết quả của 1 bài thi |
| GET | `/api/results` | 👑 Admin | Tất cả kết quả trong hệ thống |

**Logic tính điểm khi nộp bài (`POST /submit`):**
1. Lấy tất cả đáp án đúng của đề thi từ DB (server-side, không tin client)
2. So sánh `selectedOptionId` của sinh viên với đáp án đúng
3. Tính điểm: `score = (correctAnswers / totalQuestions) × exam.total_score`
4. Lưu kết quả vào `exam_results` + từng câu trả lời vào `student_answers` trong 1 transaction

---

## 6. Bảo mật

| Kỹ thuật | Áp dụng |
|---|---|
| **bcryptjs** (cost 10) | Hash mật khẩu trước khi lưu DB |
| **JWT** (HS256, 24h) | Xác thực stateless, không lưu session |
| **Parameterized Query** | Tất cả query dùng `.input()` của mssql → chống SQL Injection |
| **Role-based Authorization** | Middleware `requireAdmin` bảo vệ các route nhạy cảm |
| **CORS** | Cho phép frontend khác origin gọi API |
| **Server-side scoring** | Không tin điểm từ client, server tự tính dựa trên DB |

---

## 7. Dependencies

| Package | Phiên bản | Mục đích |
|---|---|---|
| `express` | ^5.2.1 | Web framework |
| `mssql` | ^12.2.0 | Driver kết nối SQL Server |
| `jsonwebtoken` | ^9.0.3 | Tạo & xác thực JWT |
| `bcryptjs` | ^3.0.3 | Hash mật khẩu |
| `cors` | ^2.8.6 | Cho phép cross-origin request |
| `dotenv` | ^17.3.1 | Đọc biến môi trường từ `.env` |
| `nodemon` (dev) | ^3.1.14 | Tự restart server khi thay đổi code |
