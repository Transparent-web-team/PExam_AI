# Mô tả Backend – Hệ thống PExam

> **Stack:** Node.js · Express.js 5 · Microsoft SQL Server (MSSQL) · JWT · bcryptjs

---

## 1. Tổng quan kiến trúc

Hệ thống backend PExam được xây dựng theo mô hình **MVC phân tầng**:

- **Model** → `db/database.js` (kết nối & khởi tạo DB, seed data)
- **Controller** → các file trong `routes/` (mỗi file = 1 nhóm tài nguyên)
- **Middleware** → `middleware/auth.js` (JWT verify, role check)
- **View** → Không có (REST API thuần, frontend độc lập)

```
PExam/backend/
├── server.js               ← Entry point
├── .env                    ← Biến môi trường
├── package.json
├── db/
│   └── database.js         ← Kết nối MSSQL, tạo bảng, seed data
├── middleware/
│   └── auth.js             ← JWT authentication & role authorization
└── routes/
    ├── auth.js             ← Đăng nhập, đăng ký, /me
    ├── users.js            ← CRUD người dùng (Admin only)
    ├── exams.js            ← CRUD bài thi + câu hỏi
    └── results.js          ← Nộp bài, lấy kết quả
```

---

## 2. Cấu hình & Khởi động

### Biến môi trường (`.env`)

| Biến | Ví dụ | Mô tả |
|---|---|---|
| `PORT` | `5000` | Cổng server lắng nghe |
| `JWT_SECRET` | `super_secret_...` | Khóa ký JWT |
| `DB_USER` | `sa` | Tên đăng nhập SQL Server |
| `DB_PASSWORD` | `123456` | Mật khẩu SQL Server |
| `DB_SERVER` | `localhost` | Host SQL Server |
| `DB_NAME` | `pexam` | Tên database |

### Khởi động

```bash
cd backend
npm install       # lần đầu
npm run dev       # nodemon – tự restart khi sửa code
npm start         # production
```

Luồng khởi động (`server.js`):
1. Load `.env` → khởi tạo Express + CORS + JSON middleware
2. Gọi `initDb()` → tạo bảng nếu chưa có → seed dữ liệu mẫu nếu DB rỗng
3. Đăng ký routes → lắng nghe trên `PORT`

---

## 3. Lớp Cơ sở dữ liệu (`db/database.js`)

### Kết nối MSSQL (Singleton Pool)

```javascript
async function getDbConnection() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config).connect();
    }
    return poolPromise; // Tái dùng cho mọi request
}
```

### 6 Bảng trong DB

| Bảng | Mô tả |
|---|---|
| `users` | Tài khoản sinh viên & admin |
| `exams` | Thông tin đề thi |
| `questions` | Câu hỏi của từng đề thi |
| `question_options` | Đáp án A/B/C/D |
| `exam_results` | Kết quả mỗi lần nộp bài |
| `student_answers` | Chi tiết đáp án sinh viên đã chọn |

**Cascade delete:** `questions` ON DELETE CASCADE từ `exams`; `question_options` từ `questions`; `student_answers` từ `exam_results`.

### Seed Data (auto khi DB rỗng)

- **6 tài khoản:** 5 sinh viên (`sinhvien01–05`, pass: `123456`) + 1 admin (`admin`, pass: `admin123`)
- **6 đề thi mẫu:** Lập trình Web, CSDL, Mạng máy tính, OOP, An toàn thông tin, Hệ điều hành
- **Kết quả mẫu** cho `sinhvien01` và `sinhvien02`

---

## 4. Middleware xác thực (`middleware/auth.js`)

### `authenticateToken`
Kiểm tra `Authorization: Bearer <token>`:
- Không có token → `401`
- Token invalid/hết hạn → `403`
- Hợp lệ → gắn `req.user = { id, username, role }` → `next()`

### `requireAdmin`
Dùng sau `authenticateToken`:
- `req.user.role !== 'admin'` → `403`
- Là admin → `next()`

---

## 5. Routes (Controllers)

### `routes/auth.js`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/login` | 🔓 | Đăng nhập, nhận JWT (24h) |
| POST | `/api/auth/register` | 🔓 | Đăng ký tài khoản mới |
| GET | `/api/auth/me` | 🔐 | Thông tin user từ token |

**Logic login:** Tìm user theo username → `bcrypt.compare()` → JWT sign `{ id, username, role }` 24h.

---

### `routes/users.js` (Admin only)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/users` | Danh sách người dùng |
| GET | `/api/users/:id` | Chi tiết một người dùng |
| POST | `/api/users` | Tạo người dùng |
| PUT | `/api/users/:id` | Cập nhật (dynamic SQL) |
| DELETE | `/api/users/:id` | Xóa (không thể tự xóa mình) |

---

### `routes/exams.js`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/exams` | 🔐 | Admin thấy tất cả; Student thấy open/scheduled/completed |
| GET | `/api/exams/:id` | 🔐 | Chi tiết + câu hỏi + đáp án |
| POST | `/api/exams` | 👑 | Tạo bài thi |
| PUT | `/api/exams/:id` | 👑 | Sửa bài thi |
| DELETE | `/api/exams/:id` | 👑 | Xóa bài thi |
| POST | `/api/exams/:examId/questions` | 👑 | Thêm câu hỏi (transaction) |
| PUT | `/api/exams/:examId/questions` | 👑 | Thay thế toàn bộ câu hỏi |
| DELETE | `/api/exams/:examId/questions/:qId` | 👑 | Xóa câu hỏi |

**Lưu ý:** Mọi thao tác câu hỏi dùng **MSSQL Transaction**. `question_count` được cập nhật tự động.

---

### `routes/results.js`

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/results/submit` | 🔐 | Nộp bài, server tự tính điểm |
| GET | `/api/results/my-results` | 🔐 | Lịch sử thi của bản thân |
| GET | `/api/results/exam-result/:examId` | 🔐 | Kết quả + đáp án đã chọn |
| GET | `/api/results/exam/:examId` | 👑 | Tất cả kết quả 1 bài (Admin) |
| GET | `/api/results` | 👑 | Tất cả kết quả hệ thống |

**Logic tính điểm khi submit:**
1. Fetch đáp án đúng từ DB (server-side, không tin client)
2. So sánh `selectedOptionId` với đáp án đúng
3. `score = (correctAnswers / totalQuestions) × exam.total_score`
4. Lưu vào `exam_results` + `student_answers` trong 1 transaction

---

## 6. Bảo mật

| Kỹ thuật | Áp dụng |
|---|---|
| **bcryptjs** (cost 10) | Hash mật khẩu |
| **JWT** (HS256, 24h) | Xác thực stateless |
| **Parameterized Query** | `.input()` của mssql → chống SQL Injection |
| **Role-based Auth** | Middleware `requireAdmin` |
| **CORS** | Cho phép frontend cross-origin |
| **Server-side scoring** | Điểm tính trên server, không tin client |

---

## 7. Dependencies

| Package | Phiên bản | Mục đích |
|---|---|---|
| `express` | ^5.2.1 | Web framework |
| `mssql` | ^12.2.0 | Driver SQL Server |
| `jsonwebtoken` | ^9.0.3 | JWT |
| `bcryptjs` | ^3.0.3 | Hash mật khẩu |
| `cors` | ^2.8.6 | Cross-origin |
| `dotenv` | ^17.3.1 | Biến môi trường |
| `nodemon` (dev) | ^3.1.14 | Auto-restart |
