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

## Hướng dẫn cài đặt & chạy dự án

Dự án có thể chạy trực tiếp trên trình duyệt hoặc thông qua một máy chủ web cục bộ (Local Server) để các tính năng điều hướng hoạt động tốt nhất:

**Cách 1: Chạy bằng Visual Studio Code (Live Server)**
1. Mở thư mục gốc `PExam/` trong VS Code.
2. Cài đặt extension **Live Server**.
3. Bấm chuột phải vào tệp `index.html` và chọn **Open with Live Server**.

**Cách 2: Chạy bằng Python HTTP Server (Khuyên dùng)**
1. Mở Terminal / Command Prompt tại thư mục `PExam/`.
2. Chạy lệnh: `python -m http.server 8080`
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
