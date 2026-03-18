// ============================================================
//  PTIT EXAM SYSTEM — MOCK DATA (No backend, runs on GitHub Pages)
// ============================================================

const DB = {
  users: [
    { id: 'u1', username: 'sinhvien01', password: '123456', name: 'Nguyễn Văn An', email: 'an.nv@ptit.edu.vn', studentId: 'B21DCCN001', role: 'student', class: 'D21CQCN01-B', avatar: 'NA' },
    { id: 'u2', username: 'sinhvien02', password: '123456', name: 'Trần Thị Bình', email: 'binh.tt@ptit.edu.vn', studentId: 'B21DCCN002', role: 'student', class: 'D21CQCN01-B', avatar: 'TB' },
    { id: 'u3', username: 'sinhvien03', password: '123456', name: 'Lê Minh Cường', email: 'cuong.lm@ptit.edu.vn', studentId: 'B21DCCN003', role: 'student', class: 'D21CQCN02-B', avatar: 'LC' },
    { id: 'u4', username: 'sinhvien04', password: '123456', name: 'Phạm Thị Dung', email: 'dung.pt@ptit.edu.vn', studentId: 'B21DCCN004', role: 'student', class: 'D21CQCN02-B', avatar: 'PD' },
    { id: 'u5', username: 'sinhvien05', password: '123456', name: 'Hoàng Văn Em', email: 'em.hv@ptit.edu.vn', studentId: 'B21DCCN005', role: 'student', class: 'D21CQCN01-B', avatar: 'HE' },
    { id: 'u6', username: 'sinhvien06', password: '123456', name: 'Ngô Thị Phương', email: 'phuong.nt@ptit.edu.vn', studentId: 'B21DCCN006', role: 'student', class: 'D21CQCN03-B', avatar: 'NP' },
    { id: 'u7', username: 'sinhvien07', password: '123456', name: 'Đinh Trọng Giang', email: 'giang.dt@ptit.edu.vn', studentId: 'B21DCCN007', role: 'student', class: 'D21CQCN03-B', avatar: 'DG' },
    { id: 'u8', username: 'sinhvien08', password: '123456', name: 'Vũ Hồng Hà', email: 'ha.vh@ptit.edu.vn', studentId: 'B21DCCN008', role: 'student', class: 'D21CQCN01-B', avatar: 'VH' },
    { id: 'u9', username: 'sinhvien09', password: '123456', name: 'Trịnh Xuân Hùng', email: 'hung.tx@ptit.edu.vn', studentId: 'B21DCCN009', role: 'student', class: 'D21CQCN02-B', avatar: 'TH' },
    { id: 'u10', username: 'sinhvien10', password: '123456', name: 'Lê Thu Thủy', email: 'thuy.lt@ptit.edu.vn', studentId: 'B21DCCN010', role: 'student', class: 'D21CQCN03-B', avatar: 'LT' },
    { id: 'admin', username: 'admin', password: 'admin123', name: 'Nguyễn Thị Admin', email: 'admin@ptit.edu.vn', role: 'admin', avatar: 'AD' }
  ],

  exams: [
    { id: 'ex1', title: 'Lập trình Web — Luyện tập tuần 1', subject: 'Lập trình Web', description: 'Bài luyện tập các khái niệm cơ bản HTML, CSS và JavaScript.', type: 'practice', status: 'open', duration: 30, questionCount: 15, totalScore: 10, passingScore: 5, startTime: null, endTime: null, createdBy: 'admin', createdAt: '2025-01-10', attempts: 124, allowRetake: true },
    { id: 'ex2', title: 'Cơ sở dữ liệu — Giữa kỳ', subject: 'Cơ sở dữ liệu', description: 'Bài thi giữa kỳ môn Cơ sở dữ liệu, bao gồm SQL, ERD, chuẩn hoá.', type: 'midterm', status: 'open', duration: 60, questionCount: 10, totalScore: 10, passingScore: 5, startTime: '2025-03-15T08:00', endTime: '2025-03-15T10:00', createdBy: 'admin', createdAt: '2025-01-12', attempts: 89, allowRetake: false },
    { id: 'ex3', title: 'Mạng máy tính — Cuối kỳ', subject: 'Mạng máy tính', description: 'Bài thi cuối kỳ môn Mạng máy tính — TCP/IP, OSI, routing, switching.', type: 'final', status: 'scheduled', duration: 90, questionCount: 40, totalScore: 10, passingScore: 5, startTime: '2026-06-10T07:30', endTime: '2026-06-10T09:00', createdBy: 'admin', createdAt: '2025-01-15', attempts: 0, allowRetake: false },
    { id: 'ex4', title: 'Lập trình hướng đối tượng — Luyện tập', subject: 'Lập trình OOP', description: 'Luyện tập OOP với Java: class, interface, inheritance, polymorphism.', type: 'practice', status: 'open', duration: 45, questionCount: 20, totalScore: 10, passingScore: 5, startTime: null, endTime: null, createdBy: 'admin', createdAt: '2025-01-18', attempts: 211, allowRetake: true },
    { id: 'ex5', title: 'Toán rời rạc — Giữa kỳ', subject: 'Toán rời rạc', description: 'Logic mệnh đề, lý thuyết tập hợp, đồ thị, tổ hợp.', type: 'midterm', status: 'completed', duration: 60, questionCount: 25, totalScore: 10, passingScore: 5, startTime: '2025-11-20T08:00', endTime: '2025-11-20T09:00', createdBy: 'admin', createdAt: '2025-01-20', attempts: 156, allowRetake: true },
    { id: 'ex6', title: 'Cấu trúc dữ liệu & Giải thuật — Luyện tập', subject: 'CTDL & GT', description: 'Stack, Queue, Tree, Graph, Sorting, Searching algorithms.', type: 'practice', status: 'open', duration: 40, questionCount: 20, totalScore: 10, passingScore: 5, startTime: null, endTime: null, createdBy: 'admin', createdAt: '2025-02-01', attempts: 178, allowRetake: true }
  ],

  questions: {
    ex1: [
      { id: 'q1', content: 'Thẻ HTML nào dùng để khai báo đoạn văn bản?', options: [{id:'q1o0',content:'<span>',display_order:0,is_correct:false},{id:'q1o1',content:'<p>',display_order:1,is_correct:true},{id:'q1o2',content:'<div>',display_order:2,is_correct:false},{id:'q1o3',content:'<br>',display_order:3,is_correct:false}], explanation: 'Thẻ <p> (paragraph) dùng để tạo đoạn văn bản trong HTML.' },
      { id: 'q2', content: 'CSS viết tắt của từ gì?', options: [{id:'q2o0',content:'Colorful Style Sheets',display_order:0,is_correct:false},{id:'q2o1',content:'Computer Style Sheets',display_order:1,is_correct:false},{id:'q2o2',content:'Cascading Style Sheets',display_order:2,is_correct:true},{id:'q2o3',content:'Creative Style Sheets',display_order:3,is_correct:false}], explanation: 'CSS là viết tắt của Cascading Style Sheets.' },
      { id: 'q3', content: 'Thuộc tính nào dùng để thay đổi màu nền trong CSS?', options: [{id:'q3o0',content:'color',display_order:0,is_correct:false},{id:'q3o1',content:'bgcolor',display_order:1,is_correct:false},{id:'q3o2',content:'background-color',display_order:2,is_correct:true},{id:'q3o3',content:'background',display_order:3,is_correct:false}], explanation: 'Thuộc tính background-color dùng để đặt màu nền cho phần tử.' },
      { id: 'q4', content: 'Trong JavaScript, lệnh nào dùng để hiển thị hộp thoại thông báo?', options: [{id:'q4o0',content:'console.log()',display_order:0,is_correct:false},{id:'q4o1',content:'document.write()',display_order:1,is_correct:false},{id:'q4o2',content:'alert()',display_order:2,is_correct:true},{id:'q4o3',content:'prompt()',display_order:3,is_correct:false}], explanation: 'Hàm alert() hiển thị hộp thoại pop-up với nội dung thông báo.' },
      { id: 'q5', content: 'Đâu là cú pháp đúng để khai báo biến trong JavaScript (ES6)?', options: [{id:'q5o0',content:'variable x = 5',display_order:0,is_correct:false},{id:'q5o1',content:'var x = 5',display_order:1,is_correct:false},{id:'q5o2',content:'let x = 5',display_order:2,is_correct:true},{id:'q5o3',content:'int x = 5',display_order:3,is_correct:false}], explanation: 'Trong ES6, let và const là cách khai báo biến được khuyến khích.' },
      { id: 'q6', content: 'Thẻ nào dùng để tạo danh sách không có thứ tự?', options: [{id:'q6o0',content:'<ol>',display_order:0,is_correct:false},{id:'q6o1',content:'<list>',display_order:1,is_correct:false},{id:'q6o2',content:'<ul>',display_order:2,is_correct:true},{id:'q6o3',content:'<li>',display_order:3,is_correct:false}], explanation: '<ul> (unordered list) tạo danh sách không có thứ tự.' },
      { id: 'q7', content: 'Phương thức JavaScript nào chọn phần tử theo ID?', options: [{id:'q7o0',content:'getElement()',display_order:0,is_correct:false},{id:'q7o1',content:'getElementById()',display_order:1,is_correct:true},{id:'q7o2',content:'selectById()',display_order:2,is_correct:false},{id:'q7o3',content:'querySelector()',display_order:3,is_correct:false}], explanation: 'getElementById() trả về phần tử có id tương ứng.' },
      { id: 'q8', content: 'Thuộc tính CSS nào dùng để thiết lập chữ in đậm?', options: [{id:'q8o0',content:'font-style:bold',display_order:0,is_correct:false},{id:'q8o1',content:'text-weight:bold',display_order:1,is_correct:false},{id:'q8o2',content:'font-weight:bold',display_order:2,is_correct:true},{id:'q8o3',content:'font-bold:true',display_order:3,is_correct:false}], explanation: 'font-weight: bold; làm cho chữ in đậm.' },
      { id: 'q9', content: 'Cú pháp nào đúng để thêm liên kết trong HTML?', options: [{id:'q9o0',content:'<a url="url">text</a>',display_order:0,is_correct:false},{id:'q9o1',content:'<a href="url">text</a>',display_order:1,is_correct:true},{id:'q9o2',content:'<link href="url">text</link>',display_order:2,is_correct:false},{id:'q9o3',content:'<a link="url">text</a>',display_order:3,is_correct:false}], explanation: 'Thẻ <a href="..."> dùng để tạo liên kết (hyperlink).' },
      { id: 'q10', content: 'Trong CSS Flexbox, thuộc tính nào căn chỉnh theo trục chính?', options: [{id:'q10o0',content:'align-items',display_order:0,is_correct:false},{id:'q10o1',content:'justify-content',display_order:1,is_correct:true},{id:'q10o2',content:'flex-direction',display_order:2,is_correct:false},{id:'q10o3',content:'align-content',display_order:3,is_correct:false}], explanation: 'justify-content căn chỉnh các phần tử theo trục chính (main axis) của flex container.' },
      { id: 'q11', content: 'JavaScript là ngôn ngữ lập trình loại nào?', options: [{id:'q11o0',content:'Compiled',display_order:0,is_correct:false},{id:'q11o1',content:'Interpreted',display_order:1,is_correct:true},{id:'q11o2',content:'Assembly',display_order:2,is_correct:false},{id:'q11o3',content:'Machine code',display_order:3,is_correct:false}], explanation: 'JavaScript là ngôn ngữ thông dịch (interpreted), chạy trực tiếp trên trình duyệt.' },
      { id: 'q12', content: 'Thẻ meta nào dùng để thiết lập viewport cho trang responsive?', options: [{id:'q12o0',content:'<meta name="screen">',display_order:0,is_correct:false},{id:'q12o1',content:'<meta name="viewport">',display_order:1,is_correct:true},{id:'q12o2',content:'<meta name="responsive">',display_order:2,is_correct:false},{id:'q12o3',content:'<meta name="mobile">',display_order:3,is_correct:false}], explanation: '<meta name="viewport" content="width=device-width, initial-scale=1.0"> giúp trang web hiển thị đúng trên thiết bị di động.' },
      { id: 'q13', content: 'Cách nào để chọn tất cả thẻ <p> trong CSS?', options: [{id:'q13o0',content:'#p',display_order:0,is_correct:false},{id:'q13o1',content:'.p',display_order:1,is_correct:false},{id:'q13o2',content:'p',display_order:2,is_correct:true},{id:'q13o3',content:'*p',display_order:3,is_correct:false}], explanation: 'Selector kiểu (type selector) "p" chọn tất cả các phần tử <p>.' },
      { id: 'q14', content: 'Hàm nào trong JavaScript dùng để làm tròn số thực?', options: [{id:'q14o0',content:'Math.round()',display_order:0,is_correct:false},{id:'q14o1',content:'Math.floor()',display_order:1,is_correct:false},{id:'q14o2',content:'Math.ceil()',display_order:2,is_correct:false},{id:'q14o3',content:'Tất cả đều đúng',display_order:3,is_correct:true}], explanation: 'Math.round() làm tròn thông thường, Math.floor() xuống, Math.ceil() lên.' },
      { id: 'q15', content: 'Đâu là selector CSS đúng để chọn phần tử có class "active"?', options: [{id:'q15o0',content:'#active',display_order:0,is_correct:false},{id:'q15o1',content:'*active',display_order:1,is_correct:false},{id:'q15o2',content:'.active',display_order:2,is_correct:true},{id:'q15o3',content:'active',display_order:3,is_correct:false}], explanation: 'Selector class dùng dấu chấm (.) trước tên class: .active' }
    ],
    ex2: [
      { id: 'db1', content: 'Mô hình cơ sở dữ liệu phổ biến nhất hiện nay là gì?', options: [{id:'db1o0',content:'Mô hình phân cấp',display_order:0,is_correct:false},{id:'db1o1',content:'Mô hình mạng',display_order:1,is_correct:false},{id:'db1o2',content:'Mô hình quan hệ',display_order:2,is_correct:true},{id:'db1o3',content:'Mô hình hướng đối tượng',display_order:3,is_correct:false}], explanation: 'Mô hình cơ sở dữ liệu quan hệ (RDBMS) hiện đang được sử dụng phổ biến nhất.' },
      { id: 'db2', content: 'Trong SQL, từ khoá nào dùng để lấy dữ liệu từ một bảng?', options: [{id:'db2o0',content:'GET',display_order:0,is_correct:false},{id:'db2o1',content:'EXTRACT',display_order:1,is_correct:false},{id:'db2o2',content:'RETRIEVE',display_order:2,is_correct:false},{id:'db2o3',content:'SELECT',display_order:3,is_correct:true}], explanation: 'SELECT dùng để truy vấn dữ liệu từ bảng.' },
      { id: 'db3', content: 'Khóa chính (Primary Key) có đặc điểm nào sau đây?', options: [{id:'db3o0',content:'Có thể chứa giá trị NULL',display_order:0,is_correct:false},{id:'db3o1',content:'Không được phép trùng lặp và không NULL',display_order:1,is_correct:true},{id:'db3o2',content:'Mỗi bảng có thể có nhiều Khóa chính',display_order:2,is_correct:false},{id:'db3o3',content:'Chỉ dùng cho dữ liệu số',display_order:3,is_correct:false}], explanation: 'Khóa chính dùng để định danh duy nhất mỗi dòng dữ liệu, không được NULL và phải Unique.' },
      { id: 'db4', content: 'Chuẩn hóa dữ liệu (Normalization) nhằm mục đích gì?', options: [{id:'db4o0',content:'Tăng tốc độ truy vấn',display_order:0,is_correct:false},{id:'db4o1',content:'Giảm thiểu dư thừa dữ liệu và tránh dị thường dữ liệu',display_order:1,is_correct:true},{id:'db4o2',content:'Mã hóa dữ liệu bảo mật',display_order:2,is_correct:false},{id:'db4o3',content:'Tạo khóa ngoại tự động',display_order:3,is_correct:false}], explanation: 'Chuẩn hóa giúp loại bỏ sự dư thừa và đảm bảo tính nhất quán của dữ liệu.' },
      { id: 'db5', content: 'Lệnh SQL nào dùng để xóa bảng và toàn bộ dữ liệu của nó?', options: [{id:'db5o0',content:'DELETE TABLE',display_order:0,is_correct:false},{id:'db5o1',content:'REMOVE TABLE',display_order:1,is_correct:false},{id:'db5o2',content:'DROP TABLE',display_order:2,is_correct:true},{id:'db5o3',content:'CLEAR TABLE',display_order:3,is_correct:false}], explanation: 'DROP TABLE xóa cấu trúc bảng và mọi dữ liệu bên trong.' },
      { id: 'db6', content: 'Trong ERD, thực thể (Entity) thường được biểu diễn bằng hình gì?', options: [{id:'db6o0',content:'Hình tròn',display_order:0,is_correct:false},{id:'db6o1',content:'Hình thoi',display_order:1,is_correct:false},{id:'db6o2',content:'Hình chữ nhật',display_order:2,is_correct:true},{id:'db6o3',content:'Hình tam giác',display_order:3,is_correct:false}], explanation: 'Thực thể được biểu diễn bằng hình chữ nhật trong sơ đồ ERD.' },
      { id: 'db7', content: 'Hệ quản trị CSDL quan hệ mã nguồn mở nào phổ biến nhất?', options: [{id:'db7o0',content:'Oracle',display_order:0,is_correct:false},{id:'db7o1',content:'SQL Server',display_order:1,is_correct:false},{id:'db7o2',content:'MySQL',display_order:2,is_correct:true},{id:'db7o3',content:'MongoDB',display_order:3,is_correct:false}], explanation: 'MySQL là hệ quản trị CSDL quan hệ mã nguồn mở phổ biến nhất. (MongoDB là NoSQL)' },
      { id: 'db8', content: 'RDBMS là viết tắt của từ gì?', options: [{id:'db8o0',content:'Relational Database Management System',display_order:0,is_correct:true},{id:'db8o1',content:'Rapid Data Base Making System',display_order:1,is_correct:false},{id:'db8o2',content:'Realtime Data Broadcast Management Software',display_order:2,is_correct:false},{id:'db8o3',content:'Row Data Backup Management System',display_order:3,is_correct:false}], explanation: 'RDBMS nghĩa là Hệ quản trị cơ sở dữ liệu quan hệ.' },
      { id: 'db9', content: 'Lệnh JOIN nào trả về tất cả kết quả từ cả hai bảng kể cả khi không có sự khớp nối?', options: [{id:'db9o0',content:'INNER JOIN',display_order:0,is_correct:false},{id:'db9o1',content:'LEFT JOIN',display_order:1,is_correct:false},{id:'db9o2',content:'RIGHT JOIN',display_order:2,is_correct:false},{id:'db9o3',content:'FULL OUTER JOIN',display_order:3,is_correct:true}], explanation: 'FULL OUTER JOIN trả về mọi bản ghi ở cả hai bảng, giá trị không khớp sẽ là NULL.' },
      { id: 'db10', content: 'Trong SQL, từ khoá nào dùng để thêm mới một bản ghi?', options: [{id:'db10o0',content:'UPDATE',display_order:0,is_correct:false},{id:'db10o1',content:'INSERT INTO',display_order:1,is_correct:true},{id:'db10o2',content:'ADD ROW',display_order:2,is_correct:false},{id:'db10o3',content:'CREATE',display_order:3,is_correct:false}], explanation: 'INSERT INTO dùng để chèn bản ghi mới vào một bảng.' }
    ],
    ex4: [
      { id: 'oop1', content: 'OOP viết tắt của gì?', options: [{id:'oop1o0',content:'Object Oriented Protocol',display_order:0,is_correct:false},{id:'oop1o1',content:'Object Oriented Programming',display_order:1,is_correct:true},{id:'oop1o2',content:'Online Object Programming',display_order:2,is_correct:false},{id:'oop1o3',content:'Object Optimizer Program',display_order:3,is_correct:false}], explanation: 'OOP là Object-Oriented Programming — Lập trình hướng đối tượng.' },
      { id: 'oop2', content: 'Đặc điểm nào KHÔNG phải của OOP?', options: [{id:'oop2o0',content:'Encapsulation',display_order:0,is_correct:false},{id:'oop2o1',content:'Inheritance',display_order:1,is_correct:false},{id:'oop2o2',content:'Polymorphism',display_order:2,is_correct:false},{id:'oop2o3',content:'Compilation',display_order:3,is_correct:true}], explanation: 'Bốn đặc điểm chính của OOP: Encapsulation, Inheritance, Polymorphism, Abstraction.' },
      { id: 'oop3', content: 'Trong Java, từ khoá nào dùng để tạo lớp con kế thừa?', options: [{id:'oop3o0',content:'implements',display_order:0,is_correct:false},{id:'oop3o1',content:'inherits',display_order:1,is_correct:false},{id:'oop3o2',content:'extends',display_order:2,is_correct:true},{id:'oop3o3',content:'super',display_order:3,is_correct:false}], explanation: 'Từ khoá extends dùng để khai báo kế thừa trong Java.' },
      { id: 'oop4', content: 'Constructor là gì?', options: [{id:'oop4o0',content:'Phương thức huỷ đối tượng',display_order:0,is_correct:false},{id:'oop4o1',content:'Phương thức tĩnh của lớp',display_order:1,is_correct:false},{id:'oop4o2',content:'Phương thức khởi tạo đối tượng',display_order:2,is_correct:true},{id:'oop4o3',content:'Phương thức trả về giá trị',display_order:3,is_correct:false}], explanation: 'Constructor là phương thức đặc biệt có cùng tên với class, được gọi khi tạo đối tượng mới.' },
      { id: 'oop5', content: 'Interface trong Java có thể có phương thức nào?', options: [{id:'oop5o0',content:'Chỉ abstract method',display_order:0,is_correct:false},{id:'oop5o1',content:'Abstract và static method',display_order:1,is_correct:false},{id:'oop5o2',content:'Abstract, default và static method',display_order:2,is_correct:true},{id:'oop5o3',content:'Không thể có phương thức',display_order:3,is_correct:false}], explanation: 'Từ Java 8, interface có thể có abstract, default và static methods.' },
      { id: 'oop6', content: 'Encapsulation trong OOP nghĩa là?', options: [{id:'oop6o0',content:'Che giấu dữ liệu và cung cấp quyền truy cập qua phương thức',display_order:0,is_correct:true},{id:'oop6o1',content:'Tạo nhiều đối tượng từ một lớp',display_order:1,is_correct:false},{id:'oop6o2',content:'Kế thừa từ nhiều lớp cha',display_order:2,is_correct:false},{id:'oop6o3',content:'Ghi đè phương thức lớp cha',display_order:3,is_correct:false}], explanation: 'Encapsulation là che giấu trạng thái bên trong và chỉ cho phép truy cập qua các phương thức public.' },
      { id: 'oop7', content: 'Polymorphism có nghĩa là?', options: [{id:'oop7o0',content:'Một lớp kế thừa nhiều lớp cha',display_order:0,is_correct:false},{id:'oop7o1',content:'Một phương thức có nhiều dạng thực thi khác nhau',display_order:1,is_correct:true},{id:'oop7o2',content:'Che giấu thông tin bên trong lớp',display_order:2,is_correct:false},{id:'oop7o3',content:'Tạo lớp trừu tượng',display_order:3,is_correct:false}], explanation: 'Polymorphism cho phép cùng một phương thức hoạt động khác nhau tuỳ thuộc vào đối tượng gọi.' },
      { id: 'oop8', content: 'Từ khoá nào dùng để gọi phương thức của lớp cha trong Java?', options: [{id:'oop8o0',content:'parent',display_order:0,is_correct:false},{id:'oop8o1',content:'base',display_order:1,is_correct:false},{id:'oop8o2',content:'super',display_order:2,is_correct:true},{id:'oop8o3',content:'this',display_order:3,is_correct:false}], explanation: 'super dùng để tham chiếu đến lớp cha trực tiếp trong Java.' },
      { id: 'oop9', content: 'Abstract class khác Interface ở điểm nào?', options: [{id:'oop9o0',content:'Abstract class không thể có constructor',display_order:0,is_correct:false},{id:'oop9o1',content:'Abstract class có thể có thuộc tính và phương thức cụ thể',display_order:1,is_correct:true},{id:'oop9o2',content:'Interface có thể đa kế thừa từ nhiều abstract class',display_order:2,is_correct:false},{id:'oop9o3',content:'Không có sự khác biệt',display_order:3,is_correct:false}], explanation: 'Abstract class có thể chứa cả thuộc tính và phương thức đã được triển khai.' },
      { id: 'oop10', content: 'Overriding là gì?', options: [{id:'oop10o0',content:'Định nghĩa lại phương thức ở lớp con',display_order:0,is_correct:true},{id:'oop10o1',content:'Tạo nhiều phương thức cùng tên trong một lớp',display_order:1,is_correct:false},{id:'oop10o2',content:'Gọi phương thức của lớp cha',display_order:2,is_correct:false},{id:'oop10o3',content:'Tạo phương thức tĩnh',display_order:3,is_correct:false}], explanation: 'Overriding (ghi đè) là lớp con định nghĩa lại phương thức đã có ở lớp cha.' },
      { id: 'oop11', content: 'Access modifier nào cho phép truy cập từ mọi nơi?', options: [{id:'oop11o0',content:'private',display_order:0,is_correct:false},{id:'oop11o1',content:'protected',display_order:1,is_correct:false},{id:'oop11o2',content:'public',display_order:2,is_correct:true},{id:'oop11o3',content:'default',display_order:3,is_correct:false}], explanation: 'public cho phép truy cập từ bất kỳ đâu trong chương trình.' },
      { id: 'oop12', content: 'Tính Abstraction trong OOP là?', options: [{id:'oop12o0',content:'Tập trung vào chi tiết triển khai',display_order:0,is_correct:false},{id:'oop12o1',content:'Ẩn chi tiết triển khai, chỉ hiển thị chức năng',display_order:1,is_correct:true},{id:'oop12o2',content:'Kế thừa từ nhiều lớp',display_order:2,is_correct:false},{id:'oop12o3',content:'Đóng gói dữ liệu',display_order:3,is_correct:false}], explanation: 'Abstraction ẩn đi sự phức tạp bên trong và chỉ hiển thị những gì cần thiết với người dùng.' },
      { id: 'oop13', content: 'Class final trong Java nghĩa là?', options: [{id:'oop13o0',content:'Lớp đầu tiên được tạo',display_order:0,is_correct:false},{id:'oop13o1',content:'Lớp tốt nhất',display_order:1,is_correct:false},{id:'oop13o2',content:'Lớp không thể bị kế thừa',display_order:2,is_correct:true},{id:'oop13o3',content:'Lớp trừu tượng',display_order:3,is_correct:false}], explanation: 'final class không thể bị extend bởi lớp khác.' },
      { id: 'oop14', content: 'Method overloading là loại đa hình nào?', options: [{id:'oop14o0',content:'Runtime polymorphism',display_order:0,is_correct:false},{id:'oop14o1',content:'Compile-time polymorphism',display_order:1,is_correct:true},{id:'oop14o2',content:'Interface polymorphism',display_order:2,is_correct:false},{id:'oop14o3',content:'Abstract polymorphism',display_order:3,is_correct:false}], explanation: 'Method overloading xảy ra tại thời điểm biên dịch nên là compile-time polymorphism.' },
      { id: 'oop15', content: 'Trong Java, có thể kế thừa từ nhiều class không?', options: [{id:'oop15o0',content:'Có',display_order:0,is_correct:false},{id:'oop15o1',content:'Không',display_order:1,is_correct:true},{id:'oop15o2',content:'Có, qua từ khoá multi',display_order:2,is_correct:false},{id:'oop15o3',content:'Có, nếu class là abstract',display_order:3,is_correct:false}], explanation: 'Java không hỗ trợ đa kế thừa từ nhiều class nhưng hỗ trợ implement nhiều interface.' },
      { id: 'oop16', content: 'Phương thức nào được gọi tự động khi đối tượng bị huỷ trong Java?', options: [{id:'oop16o0',content:'destructor()',display_order:0,is_correct:false},{id:'oop16o1',content:'finalize()',display_order:1,is_correct:true},{id:'oop16o2',content:'delete()',display_order:2,is_correct:false},{id:'oop16o3',content:'remove()',display_order:3,is_correct:false}], explanation: 'Phương thức finalize() được gọi bởi Garbage Collector trước khi huỷ đối tượng.' },
      { id: 'oop17', content: 'static method thuộc về?', options: [{id:'oop17o0',content:'Đối tượng cụ thể',display_order:0,is_correct:false},{id:'oop17o1',content:'Lớp (class)',display_order:1,is_correct:true},{id:'oop17o2',content:'Interface',display_order:2,is_correct:false},{id:'oop17o3',content:'Abstract class',display_order:3,is_correct:false}], explanation: 'Static method thuộc về class chứ không thuộc về instance của class.' },
      { id: 'oop18', content: 'Design pattern nào đảm bảo chỉ có một instance của class?', options: [{id:'oop18o0',content:'Factory',display_order:0,is_correct:false},{id:'oop18o1',content:'Observer',display_order:1,is_correct:false},{id:'oop18o2',content:'Singleton',display_order:2,is_correct:true},{id:'oop18o3',content:'Decorator',display_order:3,is_correct:false}], explanation: 'Singleton pattern đảm bảo một class chỉ có duy nhất một instance.' },
      { id: 'oop19', content: 'Sealed class trong Java 17 dùng để?', options: [{id:'oop19o0',content:'Mã hoá dữ liệu',display_order:0,is_correct:false},{id:'oop19o1',content:'Giới hạn các class có thể kế thừa nó',display_order:1,is_correct:true},{id:'oop19o2',content:'Tạo singleton pattern',display_order:2,is_correct:false},{id:'oop19o3',content:'Ẩn constructor',display_order:3,is_correct:false}], explanation: 'sealed class cho phép khai báo tường minh các class được phép extend nó.' },
      { id: 'oop20', content: 'Garbage Collection trong Java thực hiện điều gì?', options: [{id:'oop20o0',content:'Xoá tất cả đối tượng',display_order:0,is_correct:false},{id:'oop20o1',content:'Tự động giải phóng bộ nhớ không còn được tham chiếu',display_order:1,is_correct:true},{id:'oop20o2',content:'Nén dữ liệu bộ nhớ',display_order:2,is_correct:false},{id:'oop20o3',content:'Thu gom log lỗi',display_order:3,is_correct:false}], explanation: 'Garbage Collector tự động tìm và giải phóng bộ nhớ cho các đối tượng không còn được tham chiếu.' }
    ]
  },

  results: [
    { id: 'r1', userId: 'u1', examId: 'ex1', score: 8.67, correct_answers: 13, total_questions: 15, duration: 22, submit_time: '2026-01-15T09:22:00', answers: [1,2,2,2,2,2,1,2,1,1,1,1,2,3,2] },
    { id: 'r2', userId: 'u2', examId: 'ex1', score: 7.33, correct_answers: 11, total_questions: 15, duration: 28, submit_time: '2026-01-15T10:01:00', answers: [1,2,2,2,2,2,1,2,1,0,1,1,2,2,2] },
    { id: 'r3', userId: 'u3', examId: 'ex1', score: 9.33, correct_answers: 14, total_questions: 15, duration: 18, submit_time: '2026-01-15T09:45:00', answers: [1,2,2,2,2,2,1,2,1,1,1,1,2,3,2] },
    { id: 'r4', userId: 'u4', examId: 'ex1', score: 6.00, correct_answers: 9, total_questions: 15, duration: 30, submit_time: '2026-01-15T10:28:00', answers: [0,2,1,2,2,2,1,2,1,0,1,0,2,2,2] },
    { id: 'r5', userId: 'u5', examId: 'ex1', score: 10.0, correct_answers: 15, total_questions: 15, duration: 15, submit_time: '2026-01-15T09:15:00', answers: [1,2,2,2,2,2,1,2,1,1,1,1,2,3,2] },
    { id: 'r6', userId: 'u6', examId: 'ex1', score: 5.33, correct_answers: 8, total_questions: 15, duration: 29, submit_time: '2026-01-15T10:25:00', answers: [0,2,0,2,1,2,0,2,1,0,1,0,2,2,2] },
    { id: 'r7', userId: 'u7', examId: 'ex1', score: 8.00, correct_answers: 12, total_questions: 15, duration: 25, submit_time: '2026-01-15T09:58:00', answers: [1,2,2,2,2,2,0,2,1,1,1,0,2,3,2] },
    { id: 'r8', userId: 'u8', examId: 'ex1', score: 6.67, correct_answers: 10, total_questions: 15, duration: 27, submit_time: '2026-01-15T10:10:00', answers: [0,2,2,2,2,2,1,2,0,0,1,0,2,2,2] },
    { id: 'r9', userId: 'u1', examId: 'ex4', score: 7.50, correct_answers: 15, total_questions: 20, duration: 40, submit_time: '2026-01-20T10:40:00', answers: [1,3,2,2,2,0,1,2,1,0,2,1,2,1,1,1,1,2,1,1] },
    { id: 'r10', userId: 'u2', examId: 'ex4', score: 8.50, correct_answers: 17, total_questions: 20, duration: 35, submit_time: '2026-01-20T10:35:00', answers: [1,3,2,2,2,0,1,2,1,0,2,1,2,1,1,1,1,2,1,1] },
    { id: 'r11', userId: 'u1', examId: 'ex2', score: 9.00, correct_answers: 9, total_questions: 10, duration: 45, submit_time: '2025-03-15T08:45:00', answers: [2,3,1,1,2,2,2,0,3,1] },
    { id: 'r12', userId: 'u2', examId: 'ex2', score: 8.00, correct_answers: 8, total_questions: 10, duration: 50, submit_time: '2025-03-15T08:50:00', answers: [2,3,1,1,2,0,2,0,1,1] }
  ],

  // ---- Helpers ----
  getUser(username) { return this.users.find(u => u.username === username); },
  getExam(id) { return this.exams.find(e => String(e.id) === String(id)); },
  getQuestions(examId) { return this.questions[examId] || []; },
  getStudents() { return this.users.filter(u => u.role === 'student'); },
  getUserById(id) { return this.users.find(u => String(u.id) === String(id)); },
  getResultsByUser(userId) { return this.results.filter(r => String(r.userId) === String(userId)); },
  getResultsByExam(examId) { return this.results.filter(r => String(r.examId) === String(examId)); },
  getResult(userId, examId) { return this.results.find(r => String(r.userId) === String(userId) && String(r.examId) === String(examId)); },

  // ---- Async API-compatible methods (now pure mock) ----
  async load() {
    // No-op: data is already in-memory
  },

  async loadMyResults() {
    const session = Auth.getSession();
    if (!session) return [];
    return this.getResultsByUser(session.userId).map(r => ({
      ...r,
      exam_id: r.examId,
      user_id: r.userId,
      passing_score: (this.getExam(r.examId) || {}).passingScore || 5
    }));
  },

  async loadAllResults() {
    return this.results.map(r => {
      const user = this.getUserById(r.userId) || {};
      const exam = this.getExam(r.examId) || {};
      return {
        ...r,
        exam_id: r.examId,
        user_id: r.userId,
        user_name: user.name,
        username: user.username,
        student_id: user.studentId,
        class_name: user.class,
        exam_title: exam.title,
        subject: exam.subject,
        exam_total_score: exam.totalScore || 10
      };
    });
  },

  async loadExamResults(examId) {
    return this.getResultsByExam(examId).map(r => {
      const user = this.getUserById(r.userId) || {};
      const exam = this.getExam(examId) || {};
      return {
        ...r,
        exam_id: r.examId,
        user_id: r.userId,
        user_name: user.name,
        username: user.username,
        student_id: user.studentId,
        class_name: user.class,
        exam_title: exam.title,
        exam_total_score: exam.totalScore || 10
      };
    });
  },

  async getExamDetails(examId) {
    const exam = this.getExam(examId);
    if (!exam) return null;
    const questions = this.getQuestions(examId);
    return { ...exam, questions };
  },

  async getExamResult(examId) {
    const session = Auth.getSession();
    if (!session) return null;
    const result = this.getResult(session.userId, examId);
    if (!result) return null;
    const exam = this.getExam(examId);
    const questions = this.getQuestions(examId);
    const studentAnswers = questions.map((q, i) => ({
      question_id: q.id,
      question_content: q.content,
      selected_option_id: result.answers && result.answers[i] !== undefined
        ? (q.options[result.answers[i]] ? q.options[result.answers[i]].id : null)
        : null,
      selected_option_order: result.answers ? result.answers[i] : null
    }));
    return {
      ...result,
      exam_id: result.examId,
      exam_title: exam ? exam.title : '',
      exam_total_score: exam ? exam.totalScore : 10,
      passing_score: exam ? exam.passingScore : 5,
      studentAnswers
    };
  },

  async submitExam(examId, answersPayload, durationMins) {
    const session = Auth.getSession();
    if (!session) return { success: false };
    const exam = this.getExam(examId);
    const questions = this.getQuestions(examId);
    if (!exam || questions.length === 0) return { success: false };

    // Grade answers
    let correct = 0;
    const answerIndices = new Array(questions.length).fill(-1);

    answersPayload.forEach(({ questionId, selectedOptionId }) => {
      const qIdx = questions.findIndex(q => String(q.id) === String(questionId));
      if (qIdx === -1) return;
      const q = questions[qIdx];
      const optIdx = q.options.findIndex(o => String(o.id) === String(selectedOptionId));
      answerIndices[qIdx] = optIdx;
      const selectedOpt = q.options.find(o => String(o.id) === String(selectedOptionId));
      if (selectedOpt && selectedOpt.is_correct) correct++;
    });

    const score = parseFloat(((correct / questions.length) * (exam.totalScore || 10)).toFixed(2));
    const resultId = 'r' + (this.results.length + 1);
    const newResult = {
      id: resultId,
      userId: session.userId,
      examId: String(examId),
      score,
      correct_answers: correct,
      total_questions: questions.length,
      duration: durationMins,
      submit_time: new Date().toISOString(),
      answers: answerIndices
    };

    // Upsert
    const existing = this.results.findIndex(r => String(r.userId) === String(session.userId) && String(r.examId) === String(examId));
    if (existing >= 0) this.results[existing] = newResult;
    else this.results.push(newResult);

    return {
      success: true,
      result: { id: resultId, score, correctAnswers: correct, totalQuestions: questions.length, examTotalScore: exam.totalScore || 10 }
    };
  },

  // Admin mock methods
  async addUser(userData) {
    const newUser = { id: 'u' + (this.users.length + 1), ...userData };
    this.users.push(newUser);
    return newUser;
  },

  async updateUser(id, updateData) {
    const idx = this.users.findIndex(u => String(u.id) === String(id));
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updateData };
    return this.users[idx];
  },

  async deleteUser(id) {
    const idx = this.users.findIndex(u => String(u.id) === String(id));
    if (idx === -1) return null;
    this.users.splice(idx, 1);
    return { message: 'User deleted' };
  },

  async createExam(examData) {
    const newExam = { id: 'ex' + (this.exams.length + 1), questionCount: 0, attempts: 0, createdAt: new Date().toISOString().slice(0,10), ...examData };
    this.exams.push(newExam);
    return newExam;
  },

  async updateExam(examId, examData) {
    const idx = this.exams.findIndex(e => String(e.id) === String(examId));
    if (idx === -1) return null;
    this.exams[idx] = { ...this.exams[idx], ...examData };
    return this.exams[idx];
  },

  async deleteExam(examId) {
    const idx = this.exams.findIndex(e => String(e.id) === String(examId));
    if (idx === -1) return null;
    this.exams.splice(idx, 1);
    delete this.questions[examId];
    return { message: 'Exam deleted' };
  },

  async upsertExamQuestions(examId, questionsArr) {
    this.questions[String(examId)] = questionsArr;
    const idx = this.exams.findIndex(e => String(e.id) === String(examId));
    if (idx >= 0) this.exams[idx].questionCount = questionsArr.length;
    return { message: 'Questions updated' };
  },

  save() { /* no-op */ }
};
