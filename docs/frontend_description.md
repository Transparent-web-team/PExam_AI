# Mô tả Frontend – Hệ thống PExam

> **Stack:** HTML5 · Vanilla CSS · Vanilla JavaScript (ES6+) · FontAwesome 6

---

## 1. Tổng quan kiến trúc

Frontend PExam là ứng dụng **Multi-Page Application (MPA)** không dùng framework. Mỗi trang HTML là một file tĩnh độc lập, sử dụng JavaScript thuần để gọi API backend và cập nhật DOM.

```
PExam/
├── index.html                  ← Trang đăng nhập sinh viên (landing page)
├── css/
│   └── main.css                ← Stylesheet duy nhất toàn hệ thống (~28KB)
├── js/
│   ├── auth.js                 ← Module xác thực (gọi API login, quản lý token/session)
│   ├── utils.js                ← Helper functions (format ngày, điểm, alert, toast...)
│   └── data.js                 ← Dữ liệu mock cũ (LocalStorage, dùng khi không có backend)
├── admin/                      ← Giao diện Admin (Giảng viên)
│   ├── login.html              ← Đăng nhập Admin
│   ├── dashboard.html          ← Tổng quan thống kê
│   ├── users.html              ← Quản lý sinh viên
│   ├── exam-editor.html        ← Soạn thảo đề thi & câu hỏi
│   ├── student-results.html    ← Xem kết quả thi sinh viên
│   └── statistics.html         ← Thống kê & biểu đồ
└── user/                       ← Giao diện Sinh viên
    ├── dashboard.html          ← Danh sách bài thi
    ├── exam.html               ← Làm bài thi trực tuyến
    └── results.html            ← Xem kết quả bài thi
```

---

## 2. CSS & Design System (`css/main.css`)

File CSS duy nhất (~28KB) định nghĩa toàn bộ design system bao gồm:

### 2.1. CSS Variables (Custom Properties)
```css
:root {
    --ptit-red: #cc0000;        /* Màu chủ đạo PTIT */
    --ptit-dark: #8b0000;
    --ptit-navy: #1a237e;
    --surface: #ffffff;
    --surface2: #f8f9fa;
    --text: #1a1a2e;
    --text-muted: #6c757d;
    --radius: 12px;
    /* ... và nhiều biến khác */
}
```

### 2.2. Các Component CSS chính

| Component | Class | Mô tả |
|---|---|---|
| Nút bấm | `.btn`, `.btn-primary`, `.btn-dark` | Nút với hiệu ứng hover/scale |
| Form | `.form-group`, `.form-control`, `.input-group` | Input có icon, validation |
| Card | `.card`, `.stat-card` | Thẻ nội dung với shadow |
| Alert | `.alert`, `.alert-success`, `.alert-danger` | Thông báo màu |
| Badge | `.badge`, `.badge-success` | Nhãn trạng thái nhỏ |
| Modal | `.modal`, `.modal-overlay` | Hộp thoại popup |
| Table | `.table`, `.table-striped` | Bảng dữ liệu có hover |
| Sidebar | `.sidebar`, `.sidebar-nav` | Thanh điều hướng admin |
| Auth | `.auth-page`, `.auth-card` | Layout trang đăng nhập |

### 2.3. Responsive & Animation
- Responsive cho mobile thông qua media queries
- CSS transitions trên button, input, card hover
- Loading spinner (`fa-spin`)

---

## 3. JavaScript Core (`js/`)

### 3.1. `js/auth.js` – Module xác thực

Module xử lý toàn bộ luồng xác thực, giao tiếp với API backend:

**Hàm chính:**
```javascript
Auth.login(username, password)
// → Gọi POST /api/auth/login
// → Lưu token vào localStorage
// → Trả về { success, user, error }

Auth.logout()
// → Xóa token và user khỏi localStorage
// → Redirect về trang login

Auth.getSession()
// → Trả về object user từ localStorage (hoặc null)

Auth.getToken()
// → Trả về JWT token string

Auth.fetchWithAuth(url, options)
// → Wrapper của fetch() tự gắn Authorization header
```

**Bảo vệ trang:** Mỗi trang HTML có đoạn script kiểm tra session ngay khi load:
```javascript
// Admin pages
(function () {
    const s = Auth.getSession();
    if (!s || s.role !== 'admin') location.href = '../admin/login.html';
})();

// User pages
(function () {
    const s = Auth.getSession();
    if (!s) location.href = '../index.html';
})();
```

### 3.2. `js/utils.js` – Tiện ích chung

| Hàm | Mô tả |
|---|---|
| `Utils.formatDate(date)` | Định dạng ngày giờ tiếng Việt |
| `Utils.formatScore(score)` | Làm tròn điểm 2 chữ số thập phân |
| `Utils.formatDuration(seconds)` | `2340s` → `"39 phút 0 giây"` |
| `Utils.showToast(msg, type)` | Thông báo nổi góc màn hình |
| `Utils.showAlert(el, msg, type)` | Hiển thị alert trong element |
| `Utils.debounce(fn, delay)` | Chống gọi hàm quá nhiều lần |

### 3.3. `js/data.js` – Dữ liệu mock (Legacy)

File này chứa dữ liệu mẫu dạng JavaScript thuần (users, exams, questions) và module `Auth` gọi LocalStorage, được dùng khi **không có backend**. Khi backend đã chạy, `js/auth.js` override và gọi API thật.

---

## 4. Trang Admin

### 4.1. `admin/login.html` – Đăng nhập Admin

- Form username + password với toggle hiển thị mật khẩu
- Tự redirect đến `dashboard.html` nếu đã có session admin
- Hiển thị thông tin demo account
- Liên kết quay về trang sinh viên

**API gọi:** `POST /api/auth/login`

---

### 4.2. `admin/dashboard.html` – Tổng quan

- **Header Admin:** Tên admin, nút logout
- **Sidebar điều hướng:** Dashboard, Quản lý sinh viên, Quản lý đề thi, Kết quả, Thống kê
- **Stat Cards:** Tổng số bài thi / sinh viên / lượt thi / điểm trung bình
- **Danh sách bài thi gần đây** với trạng thái (open/draft/scheduled/completed)
- **5 hoạt động gần nhất** của hệ thống

**API gọi:** `GET /api/exams`, `GET /api/results`, `GET /api/users`

---

### 4.3. `admin/users.html` – Quản lý sinh viên

- **Bảng danh sách sinh viên** (phân trang, tìm kiếm, lọc theo class)
- **Modal Thêm sinh viên:** Form nhập đầy đủ thông tin
- **Nút sửa / xóa:** Mở modal xác nhận trước khi xóa
- **Import hàng loạt** từ file (đề xuất)

**API gọi:** `GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`

---

### 4.4. `admin/exam-editor.html` – Soạn thảo đề thi

Trang phức tạp nhất (~37KB) với đầy đủ chức năng:

- **Danh sách đề thi** bên trái (sidebar), click để mở editor
- **Form thông tin đề thi:** Tiêu đề, môn học, loại, trạng thái, thời gian, điểm
- **Danh sách câu hỏi:** Hiển thị dạng accordion, có thể xóa từng câu
- **Modal thêm câu hỏi:** Nội dung + 4 đáp án + chọn đáp án đúng + giải thích
- **Import từ CSV:** Đọc file `.csv` theo template chuẩn, parse và gửi lên API
- **Tạo câu hỏi bằng AI** (tính năng mở rộng)

**API gọi:** `GET /api/exams`, `POST /api/exams`, `PUT /api/exams/:id`, `DELETE /api/exams/:id`, `PUT /api/exams/:id/questions`

---

### 4.5. `admin/student-results.html` – Kết quả thi sinh viên

- **Danh sách sinh viên** bên trái (phân trang)
- **Panel chi tiết** bên phải khi chọn sinh viên:
  - Thông tin cá nhân, ảnh đại diện
  - Thống kê tổng hợp: số bài đã thi, điểm TB, tỉ lệ đạt
  - Bảng lịch sử các bài thi đã hoàn thành (phân trang)

**API gọi:** `GET /api/users`, `GET /api/results/my-results` (cho từng sinh viên)

---

### 4.6. `admin/statistics.html` – Thống kê

- **Biểu đồ đường** điểm trung bình theo từng bài thi
- **Biểu đồ tròn** tỉ lệ đạt/trượt
- **Bảng xếp hạng sinh viên** theo điểm trung bình
- **Bộ lọc** theo môn học, thời gian

**API gọi:** `GET /api/results`, `GET /api/exams`, `GET /api/users`

---

## 5. Trang Sinh viên (User)

### 5.1. `index.html` – Đăng nhập sinh viên (Landing Page)

- Giao diện đăng nhập với ảnh nền gradient PTIT
- Form username + password
- Liên kết đến trang Admin
- Tự redirect về `user/dashboard.html` nếu đã đăng nhập

**API gọi:** `POST /api/auth/login`

---

### 5.2. `user/dashboard.html` – Trang chủ sinh viên

- **Header:** Tên sinh viên, mã SV, nút logout
- **Tabs bài thi:** Bài thi đang mở / Sắp tới / Đã hoàn thành
- **Thẻ bài thi (Exam Card):** Môn học, số câu, thời gian, badge trạng thái
  - Nút **"Bắt đầu"** → link đến `exam.html?examId=X`
  - Nút **"Làm lại"** → hiển thị nếu `allow_retake = true`
- **Thống kê cá nhân:** Số bài đã làm, điểm TB, tỉ lệ đạt

**API gọi:** `GET /api/exams`, `GET /api/results/my-results`, `GET /api/auth/me`

---

### 5.3. `user/exam.html` – Làm bài thi

Trang làm bài thi trực tuyến:

- **Query param:** `?examId=X` để load đề thi
- **Đồng hồ đếm ngược** thời gian, tự động nộp khi hết giờ
- **Thanh điều hướng câu hỏi** (sidebar): hiển thị trạng thái từng câu (chưa làm / đã làm)
- **Nội dung câu hỏi:** Text + 4 lựa chọn radio button
- **Điều hướng:** Nút Trước / Tiếp theo / Nộp bài
- **Modal xác nhận nộp bài:** Hiển thị số câu đã làm / chưa làm
- **Chống reload trang** khi đang làm bài (`beforeunload` event)

**API gọi:** `GET /api/exams/:id`, `POST /api/results/submit`

---

### 5.4. `user/results.html` – Xem kết quả

- **Query param:** `?examId=X` để load kết quả
- **Tổng quan kết quả:** Điểm số lớn, số câu đúng/sai, trạng thái đạt/không đạt
- **Biểu đồ tròn** tỉ lệ đúng/sai (canvas)
- **Review từng câu hỏi:** 
  - Câu đúng → border xanh
  - Câu sai → border đỏ, hiển thị đáp án đúng
  - Có phần giải thích cho mỗi câu
- **Nút:** Làm lại (nếu `allow_retake`) / Về trang chủ

**API gọi:** `GET /api/exams/:id`, `GET /api/results/exam-result/:examId`

---

## 6. Luồng dữ liệu chính

```
[Sinh viên]                         [Backend API]
    │                                     │
    ├─ Đăng nhập ─────────────────────── POST /api/auth/login
    │                ← token + user ──────┤
    │                                     │
    ├─ Xem bài thi ───────────────────── GET /api/exams
    │                ← exam list ─────────┤
    │                                     │
    ├─ Bắt đầu làm bài ──────────────── GET /api/exams/:id
    │                ← questions+options ─┤
    │                                     │
    ├─ Nộp bài ───────────────────────── POST /api/results/submit
    │                ← score + id ────────┤
    │                                     │
    └─ Xem kết quả ───────────────────── GET /api/results/exam-result/:examId
                     ← result+answers ───┘
```

---

## 7. Quy ước kỹ thuật

| Quy ước | Chi tiết |
|---|---|
| **Lưu trữ token** | `localStorage` với key `pexam_token` và `pexam_user` |
| **Gọi API** | `fetch()` native với `Auth.fetchWithAuth()` wrapper |
| **Xử lý lỗi** | `try/catch` trên mọi API call, hiển thị alert đỏ thông báo |
| **Loading state** | Disable button + thay text + icon spinner khi đang gọi API |
| **Navigation guard** | IIFE tại đầu mỗi trang kiểm tra session và redirect |
| **Query params** | Truyền `examId` qua URL `?examId=X` thay vì sessionStorage |
