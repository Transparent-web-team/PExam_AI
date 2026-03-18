# Hệ thống Thi Trực tuyến PTIT (PExam)

Hệ thống quản lý và tổ chức thi trắc nghiệm trực tuyến được phát triển dành riêng cho sinh viên và giảng viên Học viện Công nghệ Bưu chính Viễn thông (PTIT). Dự án cung cấp giao diện trực quan, dễ sử dụng, hỗ trợ cả hai vai trò: Quản trị viên (Giảng viên) và Người dùng (Sinh viên).

## Chức năng chính

### Dành cho Sinh viên (User)
- **Đăng ký / Đăng nhập:** Hệ thống xác thực bằng tài khoản sinh viên.
- **Trang chủ (Dashboard):** Hiển thị tổng quan các bài thi sắp tới, bài thi đã hoàn thành.
- **Làm bài thi (Exam):** Giao diện làm bài thi trắc nghiệm đếm ngược thời gian, có tự động nộp bài khi hết giờ.
- **Xem kết quả (Results):** Xem lại điểm số, số câu đúng/sai, số lần thi (nếu có).

### Dành cho Quản trị viên (Admin)
- **Quản lý Sinh viên (Users):** Thêm, sửa, xóa, tìm kiếm danh sách sinh viên tham gia hệ thống.
- **Quản lý Đề thi (Exam Editor):** Tạo đề thi mới, chỉnh sửa ngân hàng câu hỏi, thiết lập thời gian và điểm số.
- **Quản lý Kết quả (Student Results):** Theo dõi quá trình thi và xem điểm số chi tiết của từng sinh viên.
- **Thống kê (Statistics):** Biểu đồ, báo cáo trực quan về tình hình thi cử, số lượng sinh viên đạt/trượt.

## Công nghệ sử dụng
- **Giao diện:** HTML5, CSS3 tinh chỉnh (Vanilla CSS), FontAwesome 6
- **Logic / Xử lý dữ liệu:** JavaScript (Vanilla JS), LocalStorage giả lập cơ sở dữ liệu (tệp `data.js`)

## Hướng dẫn cài đặt & chạy dự án để test

Hệ thống PExam hiện tại hoạt động theo mô hình Client-Server, bao gồm phần Backend (Node.js + SQL Server) và Frontend (Vanilla JS). Cần chạy cả hai để hệ thống hoạt động đầy đủ.

### Bước 1: Thiết lập Database (SQL Server)
1. Cài đặt **SQL Server** và công cụ quản lý **SQL Server Management Studio (SSMS)**.
2. Tạo một cơ sở dữ liệu có tên là `pexam`.
3. Kiểm tra thông tin tài khoản SQL Server (VD: Username là `sa`, Password là `123456`) để điền vào phần Backend ở bước sau.

### Bước 2: Chạy Backend (API Server)
1. Yêu cầu đã cài đặt **Node.js** trên máy.
2. Mở Terminal hoặc Command Prompt, di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
3. Cài đặt các thư viện (Dependencies):
   ```bash
   npm install
   ```
4. Cấu hình môi trường (nếu chưa có, tạo file `.env` trong thư mục `backend/` với nội dung sau và thay đổi tài khoản DB cho phù hợp):
   ```env
   PORT=5000
   JWT_SECRET=super_secret_jwt_key_for_pexam_2026
   DB_USER=sa
   DB_PASSWORD=123456
   DB_SERVER=localhost
   DB_NAME=pexam
   ```
5. Bật server Backend:
   ```bash
   npm start
   # Hoặc dùng lệnh sau để tự chạy lại khi có thay đổi code:
   # npm run dev 
   ```
   Nếu thành công, terminal sẽ báo: `Server is running on port 5000` và `Connected to SQL Server`.

### Bước 3: Chạy Frontend (Giao diện Web)
Sau khi Backend đã chạy, mở một Terminal mới để chạy Frontend.

**Cách 1: Chạy bằng Visual Studio Code (Live Server)**
1. Mở thư mục gốc của dự án `PExam/` bằng VS Code.
2. Cài đặt extension **Live Server** của Ritwick Dey.
3. Bấm chuột phải vào tệp `index.html` và chọn **Open with Live Server**.

**Cách 2: Chạy bằng Python HTTP Server (Khuyên dùng)**
1. Mở Terminal mới tại thư mục gốc `PExam/`.
2. Chạy lệnh sau để tạo server local:
   ```bash
   python -m http.server 8080
   ```
3. Mở trình duyệt và truy cập vào: [http://localhost:8080](http://localhost:8080)

## Tài khoản Demo

Để xem trước các tính năng, có thể sử dụng các tài khoản có sẵn trong `js/data.js`:

- Trải nghiệm giao diện **Người dùng**: 
  - Tài khoản: `sinhvien01`
  - Mật khẩu: `123456`
- Trải nghiệm giao diện **Quản trị viên**:
  - Tài khoản: `admin`
  - Mật khẩu: `admin123`

---
*Dự án được xây dựng với mục tiêu cung cấp giải pháp thi trực tuyến an toàn, linh hoạt và tiện lợi.*
