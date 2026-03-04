// ============================================================
//  PTIT EXAM SYSTEM — MOCK DATA
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
    {
      id: 'ex1',
      title: 'Lập trình Web — Luyện tập tuần 1',
      subject: 'Lập trình Web',
      description: 'Bài luyện tập các khái niệm cơ bản HTML, CSS và JavaScript.',
      type: 'practice',
      status: 'open',
      duration: 30,
      questionCount: 15,
      totalScore: 10,
      passingScore: 5,
      startTime: null,
      endTime: null,
      createdBy: 'admin',
      createdAt: '2025-01-10',
      attempts: 124,
      allowRetake: true
    },
    {
      id: 'ex2',
      title: 'Cơ sở dữ liệu — Giữa kỳ',
      subject: 'Cơ sở dữ liệu',
      description: 'Bài thi giữa kỳ môn Cơ sở dữ liệu, bao gồm SQL, ERD, chuẩn hoá.',
      type: 'midterm',
      status: 'open',
      duration: 60,
      questionCount: 30,
      totalScore: 10,
      passingScore: 5,
      startTime: '2025-03-15T08:00',
      endTime: '2025-03-15T10:00',
      createdBy: 'admin',
      createdAt: '2025-01-12',
      attempts: 89,
      allowRetake: false
    },
    {
      id: 'ex3',
      title: 'Mạng máy tính — Cuối kỳ',
      subject: 'Mạng máy tính',
      description: 'Bài thi cuối kỳ môn Mạng máy tính — TCP/IP, OSI, routing, switching.',
      type: 'final',
      status: 'scheduled',
      duration: 90,
      questionCount: 40,
      totalScore: 10,
      passingScore: 5,
      startTime: '2026-06-10T07:30',
      endTime: '2026-06-10T09:00',
      createdBy: 'admin',
      createdAt: '2025-01-15',
      attempts: 0,
      allowRetake: false
    },
    {
      id: 'ex4',
      title: 'Lập trình hướng đối tượng — Luyện tập',
      subject: 'Lập trình OOP',
      description: 'Luyện tập OOP với Java: class, interface, inheritance, polymorphism.',
      type: 'practice',
      status: 'open',
      duration: 45,
      questionCount: 20,
      totalScore: 10,
      passingScore: 5,
      startTime: null,
      endTime: null,
      createdBy: 'admin',
      createdAt: '2025-01-18',
      attempts: 211,
      allowRetake: true
    },
    {
      id: 'ex5',
      title: 'Toán rời rạc — Giữa kỳ',
      subject: 'Toán rời rạc',
      description: 'Logic mệnh đề, lý thuyết tập hợp, đồ thị, tổ hợp.',
      type: 'midterm',
      status: 'completed',
      duration: 60,
      questionCount: 25,
      totalScore: 10,
      passingScore: 5,
      startTime: '2025-11-20T08:00',
      endTime: '2025-11-20T09:00',
      createdBy: 'admin',
      createdAt: '2025-01-20',
      attempts: 156,
      allowRetake: true
    },
    {
      id: 'ex6',
      title: 'Cấu trúc dữ liệu & Giải thuật — Luyện tập',
      subject: 'CTDL & GT',
      description: 'Stack, Queue, Tree, Graph, Sorting, Searching algorithms.',
      type: 'practice',
      status: 'open',
      duration: 40,
      questionCount: 20,
      totalScore: 10,
      passingScore: 5,
      startTime: null,
      endTime: null,
      createdBy: 'admin',
      createdAt: '2025-02-01',
      attempts: 178,
      allowRetake: true
    }
  ],

  questions: {
    ex1: [
      { id: 'q1', text: 'Thẻ HTML nào dùng để khai báo đoạn văn bản?', options: ['<span>', '<p>', '<div>', '<br>'], correct: 1, explanation: 'Thẻ <p> (paragraph) dùng để tạo đoạn văn bản trong HTML.' },
      { id: 'q2', text: 'CSS viết tắt của từ gì?', options: ['Colorful Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets'], correct: 2, explanation: 'CSS là viết tắt của Cascading Style Sheets.' },
      { id: 'q3', text: 'Thuộc tính nào dùng để thay đổi màu nền trong CSS?', options: ['color', 'bgcolor', 'background-color', 'background'], correct: 2, explanation: 'Thuộc tính background-color dùng để đặt màu nền cho phần tử.' },
      { id: 'q4', text: 'Trong JavaScript, lệnh nào dùng để hiển thị hộp thoại thông báo?', options: ['console.log()', 'document.write()', 'alert()', 'prompt()'], correct: 2, explanation: 'Hàm alert() hiển thị hộp thoại pop-up với nội dung thông báo.' },
      { id: 'q5', text: 'Đâu là cú pháp đúng để khai báo biến trong JavaScript (ES6)?', options: ['variable x = 5', 'var x = 5', 'let x = 5', 'int x = 5'], correct: 2, explanation: 'Trong ES6, let và const là cách khai báo biến được khuyến khích. let dùng cho biến thay đổi được.' },
      { id: 'q6', text: 'Thẻ nào dùng để tạo danh sách không có thứ tự?', options: ['<ol>', '<list>', '<ul>', '<li>'], correct: 2, explanation: '<ul> (unordered list) tạo danh sách không có thứ tự.' },
      { id: 'q7', text: 'Phương thức JavaScript nào chọn phần tử theo ID?', options: ['getElement()', 'getElementById()', 'selectById()', 'querySelector()'], correct: 1, explanation: 'getElementById() trả về phần tử có id tương ứng.' },
      { id: 'q8', text: 'Thuộc tính CSS nào dùng để thiết kế kiểu chữ in đậm?', options: ['font-style:bold', 'text-weight:bold', 'font-weight:bold', 'font-bold:true'], correct: 2, explanation: 'font-weight: bold; làm cho chữ in đậm.' },
      { id: 'q9', text: 'Cú pháp nào đúng để thêm liên kết trong HTML?', options: ['<a url="url">text</a>', '<a href="url">text</a>', '<link href="url">text</link>', '<a link="url">text</a>'], correct: 1, explanation: 'Thẻ <a href="..."> dùng để tạo liên kết (hyperlink).' },
      { id: 'q10', text: 'Trong CSS, Flexbox sử dụng thuộc tính nào để căn chỉnh phần tử theo trục chính?', options: ['align-items', 'justify-content', 'flex-direction', 'align-content'], correct: 1, explanation: 'justify-content căn chỉnh các phần tử theo trục chính (main axis) của flex container.' },
      { id: 'q11', text: 'JavaScript là ngôn ngữ lập trình loại nào?', options: ['Compiled', 'Interpreted', 'Assembly', 'Machine code'], correct: 1, explanation: 'JavaScript là ngôn ngữ thông dịch (interpreted), chạy trực tiếp trên trình duyệt.' },
      { id: 'q12', text: 'Thẻ meta nào dùng để thiết lập viewport cho trang responsive?', options: ['<meta name="screen">', '<meta name="viewport">', '<meta name="responsive">', '<meta name="mobile">'], correct: 1, explanation: '<meta name="viewport" content="width=device-width, initial-scale=1.0"> giúp trang web hiển thị đúng trên thiết bị di động.' },
      { id: 'q13', text: 'Cách nào để chọn tất cả thẻ <p> trong CSS?', options: ['#p', '.p', 'p', '*p'], correct: 2, explanation: 'Selector kiểu (type selector) "p" chọn tất cả các phần tử <p>.' },
      { id: 'q14', text: 'Hàm nào trong JavaScript dùng để làm tròn số thực?', options: ['Math.round()', 'Math.floor()', 'Math.ceil()', 'Tất cả đều đúng'], correct: 3, explanation: 'Math.round() làm tròn thông thường, Math.floor() làm tròn xuống, Math.ceil() làm tròn lên.' },
      { id: 'q15', text: 'Đâu là selector CSS đúng để chọn phần tử có class "active"?', options: ['#active', '*active', '.active', 'active'], correct: 2, explanation: 'Selector class dùng dấu chấm (.) trước tên class: .active' }
    ],
    ex2: [
      { id: 'db1', text: 'Mô hình cơ sở dữ liệu phổ biến nhất hiện nay là gì?', options: ['Mô hình phân cấp', 'Mô hình mạng', 'Mô hình quan hệ', 'Mô hình hướng đối tượng'], correct: 2, explanation: 'Mô hình cơ sở dữ liệu quan hệ (RDBMS) hiện đang được sử dụng phổ biến nhất.' },
      { id: 'db2', text: 'Trong SQL, từ khoá nào dùng để lấy dữ liệu từ một bảng?', options: ['GET', 'EXTRACT', 'RETRIEVE', 'SELECT'], correct: 3, explanation: 'SELECT dùng để truy vấn dữ liệu từ bảng.' },
      { id: 'db3', text: 'Khóa chính (Primary Key) có đặc điểm nào sau đây?', options: ['Có thể chứa giá trị NULL', 'Không được phép trùng lặp (Unique) và không NULL', 'Mỗi bảng có thể có nhiều Khóa chính', 'Chỉ dùng cho dữ liệu số'], correct: 1, explanation: 'Khóa chính dùng để định danh duy nhất mỗi dòng dữ liệu, nên không được NULL và phải Unique.' },
      { id: 'db4', text: 'Chuẩn hóa dữ liệu (Normalization) nhằm mục đích gì?', options: ['Tăng tốc độ truy vấn', 'Giảm thiểu dư thừa dữ liệu và tránh dị thường dữ liệu', 'Mã hóa dữ liệu bảo mật', 'Tạo khóa ngoại tự động'], correct: 1, explanation: 'Chuẩn hóa giúp loại bỏ sự dư thừa và đảm bảo tính nhất quán của dữ liệu.' },
      { id: 'db5', text: 'Lệnh SQL nào dùng để xóa bảng và toàn bộ dữ liệu của nó?', options: ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'CLEAR TABLE'], correct: 2, explanation: 'DROP TABLE xóa cấu trúc bảng và mọi dữ liệu bên trong.' },
      { id: 'db6', text: 'Trong ERD, thực thể (Entity) thường được biểu diễn bằng hình gì?', options: ['Hình tròn', 'Hình thoi', 'Hình chữ nhật', 'Hình tam giác'], correct: 2, explanation: 'Thực thể được biểu diễn bằng hình chữ nhật trong sơ đồ ERD.' },
      { id: 'db7', text: 'Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở nào sau đây phổ biến nhất?', options: ['Oracle', 'SQL Server', 'MySQL', 'MongoDB'], correct: 2, explanation: 'MySQL là hệ quản trị CSDL quan hệ mã nguồn mở phổ biến nhất. (MongoDB là NoSQL)' },
      { id: 'db8', text: 'RDBMS là viết tắt của từ gì?', options: ['Relational Database Management System', 'Rapid Data Base Making System', 'Realtime Data Broadcast Management Software', 'Row Data Backup Management System'], correct: 0, explanation: 'RDBMS nghĩa là Hệ quản trị cơ sở dữ liệu quan hệ.' },
      { id: 'db9', text: 'Lệnh JOIN nào trả về tất cả kết quả từ cả hai bảng kể cả khi không có sự khớp nối?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3, explanation: 'FULL OUTER JOIN trả về mọi bản ghi ở cả hai bảng, giá trị nào không khớp sẽ là NULL.' },
      { id: 'db10', text: 'Trong SQL, từ khoá nào dùng để thêm mới một bản ghi?', options: ['UPDATE', 'INSERT INTO', 'ADD ROW', 'CREATE'], correct: 1, explanation: 'INSERT INTO dùng để chèn bản ghi mới vào một bảng.' }
    ],
    ex4: [
      { id: 'q1', text: 'OOP viết tắt của gì?', options: ['Object Oriented Protocol', 'Object Oriented Programming', 'Online Object Programming', 'Object Optimizer Program'], correct: 1, explanation: 'OOP là Object-Oriented Programming — Lập trình hướng đối tượng.' },
      { id: 'q2', text: 'Đặc điểm nào KHÔNG phải của OOP?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation'], correct: 3, explanation: 'Bốn đặc điểm chính của OOP: Encapsulation, Inheritance, Polymorphism, Abstraction.' },
      { id: 'q3', text: 'Trong Java, từ khoá nào dùng để tạo một lớp con kế thừa lớp cha?', options: ['implements', 'inherits', 'extends', 'super'], correct: 2, explanation: 'Từ khoá extends dùng để khai báo kế thừa trong Java.' },
      { id: 'q4', text: 'Constructor là gì?', options: ['Phương thức huỷ đối tượng', 'Phương thức tĩnh của lớp', 'Phương thức khởi tạo đối tượng', 'Phương thức trả về giá trị'], correct: 2, explanation: 'Constructor là phương thức đặc biệt có cùng tên với class, được gọi khi tạo đối tượng mới.' },
      { id: 'q5', text: 'Interface trong Java có thể có phương thức nào?', options: ['Chỉ abstract method', 'Abstract và static method', 'Abstract, default và static method', 'Không thể có phương thức'], correct: 2, explanation: 'Từ Java 8, interface có thể có abstract, default và static methods.' },
      { id: 'q6', text: 'Encapsulation (Đóng gói) trong OOP nghĩa là?', options: ['Che giấu dữ liệu và cung cấp quyền truy cập qua phương thức', 'Tạo nhiều đối tượng từ một lớp', 'Kế thừa từ nhiều lớp cha', 'Ghi đè phương thức lớp cha'], correct: 0, explanation: 'Encapsulation là che giấu trạng thái bên trong và chỉ cho phép truy cập qua các phương thức public.' },
      { id: 'q7', text: 'Polymorphism có nghĩa là?', options: ['Một lớp kế thừa nhiều lớp cha', 'Một phương thức có nhiều dạng thực thi khác nhau', 'Che giấu thông tin bên trong lớp', 'Tạo lớp trừu tượng'], correct: 1, explanation: 'Polymorphism cho phép cùng một phương thức hoạt động khác nhau tuỳ thuộc vào đối tượng gọi.' },
      { id: 'q8', text: 'Từ khoá nào dùng để gọi phương thức của lớp cha trong Java?', options: ['parent', 'base', 'super', 'this'], correct: 2, explanation: 'super dùng để tham chiếu đến lớp cha trực tiếp trong Java.' },
      { id: 'q9', text: 'Abstract class khác Interface ở điểm nào?', options: ['Abstract class không thể có constructor', 'Abstract class có thể có thuộc tính và phương thức cụ thể', 'Interface có thể đa kế thừa từ nhiều abstract class', 'Không có sự khác biệt'], correct: 1, explanation: 'Abstract class có thể chứa cả thuộc tính và phương thức đã được triển khai.' },
      { id: 'q10', text: 'Overriding là gì?', options: ['Định nghĩa lại phương thức ở lớp con', 'Tạo nhiều phương thức cùng tên trong một lớp', 'Gọi phương thức của lớp cha', 'Tạo phương thức tĩnh'], correct: 0, explanation: 'Overriding (ghi đè) là lớp con định nghĩa lại phương thức đã có ở lớp cha.' },
      { id: 'q11', text: 'Access modifier nào cho phép truy cập từ mọi nơi?', options: ['private', 'protected', 'public', 'default'], correct: 2, explanation: 'public cho phép truy cập từ bất kỳ đâu trong chương trình.' },
      { id: 'q12', text: 'Tính Abstraction (Trừu tượng hoá) trong OOP là?', options: ['Tập trung vào chi tiết triển khai', 'Ẩn chi tiết triển khai, chỉ hiển thị chức năng', 'Kế thừa từ nhiều lớp', 'Đóng gói dữ liệu'], correct: 1, explanation: 'Abstraction ẩn đi sự phức tạp bên trong và chỉ hiển thị những gì cần thiết với người dùng.' },
      { id: 'q13', text: 'Class final trong Java nghĩa là?', options: ['Lớp đầu tiên được tạo', 'Lớp tốt nhất', 'Lớp không thể bị kế thừa', 'Lớp trừu tượng'], correct: 2, explanation: 'final class không thể bị extend bởi lớp khác.' },
      { id: 'q14', text: 'Đây là ví dụ của loại đa hình nào: method overloading?', options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Interface polymorphism', 'Abstract polymorphism'], correct: 1, explanation: 'Method overloading xảy ra tại thời điểm biên dịch nên là compile-time polymorphism.' },
      { id: 'q15', text: 'Trong Java, có thể kế thừa từ nhiều class không?', options: ['Có', 'Không', 'Có, qua từ khoá multi', 'Có, nếu class là abstract'], correct: 1, explanation: 'Java không hỗ trợ đa kế thừa từ nhiều class nhưng hỗ trợ implement nhiều interface.' },
      { id: 'q16', text: 'Phương thức nào được gọi tự động khi đối tượng bị huỷ trong Java?', options: ['destructor()', 'finalize()', 'delete()', 'remove()'], correct: 1, explanation: 'Phương thức finalize() được gọi bởi Garbage Collector trước khi huỷ đối tượng.' },
      { id: 'q17', text: 'static method thuộc về?', options: ['Đối tượng cụ thể', 'Lớp (class)', 'Interface', 'Abstract class'], correct: 1, explanation: 'Static method thuộc về class chứ không thuộc về instance của class.' },
      { id: 'q18', text: 'Sealed class trong Java 17 dùng để?', options: ['Mã hoá dữ liệu', 'Giới hạn các class có thể kế thừa nó', 'Tạo singleton pattern', 'Ẩn constructor'], correct: 1, explanation: 'sealed class cho phép khai báo tường minh các class được phép extend nó.' },
      { id: 'q19', text: 'Design pattern nào đảm bảo chỉ có một instance của class?', options: ['Factory', 'Observer', 'Singleton', 'Decorator'], correct: 2, explanation: 'Singleton pattern đảm bảo một class chỉ có duy nhất một instance.' },
      { id: 'q20', text: 'Garbage Collection trong Java thực hiện điều gì?', options: ['Xoá tất cả đối tượng', 'Tự động giải phóng bộ nhớ không còn được tham chiếu', 'Nén dữ liệu bộ nhớ', 'Thu gom log lỗi'], correct: 1, explanation: 'Garbage Collector tự động tìm và giải phóng bộ nhớ cho các đối tượng không còn được tham chiếu.' }
    ]
  },

  results: [
    { id: 'r1', userId: 'u1', examId: 'ex1', score: 8.67, correct: 13, total: 15, status: 'completed', duration: 22, submitTime: '2026-01-15T09:22:00', answers: [1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 3, 2] },
    { id: 'r2', userId: 'u2', examId: 'ex1', score: 7.33, correct: 11, total: 15, status: 'completed', duration: 28, submitTime: '2026-01-15T10:01:00', answers: [1, 2, 2, 2, 2, 2, 1, 2, 1, 0, 1, 1, 2, 2, 2] },
    { id: 'r3', userId: 'u3', examId: 'ex1', score: 9.33, correct: 14, total: 15, status: 'completed', duration: 18, submitTime: '2026-01-15T09:45:00', answers: [1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 3, 2] },
    { id: 'r4', userId: 'u4', examId: 'ex1', score: 6.00, correct: 9, total: 15, status: 'completed', duration: 30, submitTime: '2026-01-15T10:28:00', answers: [0, 2, 1, 2, 2, 2, 1, 2, 1, 0, 1, 0, 2, 2, 2] },
    { id: 'r5', userId: 'u5', examId: 'ex1', score: 10.0, correct: 15, total: 15, status: 'completed', duration: 15, submitTime: '2026-01-15T09:15:00', answers: [1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 3, 2] },
    { id: 'r6', userId: 'u6', examId: 'ex1', score: 5.33, correct: 8, total: 15, status: 'completed', duration: 29, submitTime: '2026-01-15T10:25:00', answers: [0, 2, 0, 2, 1, 2, 0, 2, 1, 0, 1, 0, 2, 2, 2] },
    { id: 'r7', userId: 'u7', examId: 'ex1', score: 8.00, correct: 12, total: 15, status: 'completed', duration: 25, submitTime: '2026-01-15T09:58:00', answers: [1, 2, 2, 2, 2, 2, 0, 2, 1, 1, 1, 0, 2, 3, 2] },
    { id: 'r8', userId: 'u8', examId: 'ex1', score: 6.67, correct: 10, total: 15, status: 'completed', duration: 27, submitTime: '2026-01-15T10:10:00', answers: [0, 2, 2, 2, 2, 2, 1, 2, 0, 0, 1, 0, 2, 2, 2] },
    { id: 'r9', userId: 'u1', examId: 'ex4', score: 7.50, correct: 15, total: 20, status: 'completed', duration: 40, submitTime: '2026-01-20T10:40:00', answers: [1, 3, 2, 2, 2, 0, 1, 2, 1, 0, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1] },
    { id: 'r10', userId: 'u2', examId: 'ex4', score: 8.50, correct: 17, total: 20, status: 'completed', duration: 35, submitTime: '2026-01-20T10:35:00', answers: [1, 3, 2, 2, 2, 0, 1, 2, 1, 0, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1] },
    { id: 'r11', userId: 'u3', examId: 'ex5', score: 9.20, correct: 23, total: 25, status: 'completed', duration: 55, submitTime: '2025-11-20T08:55:00', answers: [] },
    { id: 'r12', userId: 'u4', examId: 'ex5', score: 4.40, correct: 11, total: 25, status: 'completed', duration: 60, submitTime: '2025-11-20T09:00:00', answers: [] },
    { id: 'r13', userId: 'u5', examId: 'ex5', score: 7.20, correct: 18, total: 25, status: 'completed', duration: 50, submitTime: '2025-11-20T08:50:00', answers: [] },
    { id: 'r14', userId: 'u6', examId: 'ex5', score: 6.00, correct: 15, total: 25, status: 'completed', duration: 60, submitTime: '2025-11-20T09:00:00', answers: [] },
    { id: 'r15', userId: 'u7', examId: 'ex5', score: 8.40, correct: 21, total: 25, status: 'completed', duration: 48, submitTime: '2025-11-20T08:48:00', answers: [] },
    { id: 'r16', userId: 'u8', examId: 'ex5', score: 5.60, correct: 14, total: 25, status: 'completed', duration: 58, submitTime: '2025-11-20T08:58:00', answers: [] },
    { id: 'r17', userId: 'u1', examId: 'ex5', score: 8.80, correct: 22, total: 25, status: 'completed', duration: 52, submitTime: '2025-11-20T08:52:00', answers: [] },
    { id: 'r18', userId: 'u2', examId: 'ex5', score: 7.60, correct: 19, total: 25, status: 'completed', duration: 56, submitTime: '2025-11-20T08:56:00', answers: [] },
    { id: 'r19', userId: 'u9', examId: 'ex1', score: 8.00, correct: 12, total: 15, status: 'completed', duration: 24, submitTime: '2026-01-15T09:30:00', answers: [1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 0, 3, 2] },
    { id: 'r20', userId: 'u10', examId: 'ex1', score: 9.33, correct: 14, total: 15, status: 'completed', duration: 20, submitTime: '2026-01-15T09:20:00', answers: [1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 3, 0] },
    { id: 'r21', userId: 'u1', examId: 'ex2', score: 9.00, correct: 9, total: 10, status: 'completed', duration: 45, submitTime: '2025-03-15T08:45:00', answers: [2, 3, 1, 1, 2, 2, 2, 0, 3, 1] },
    { id: 'r22', userId: 'u2', examId: 'ex2', score: 8.00, correct: 8, total: 10, status: 'completed', duration: 50, submitTime: '2025-03-15T08:50:00', answers: [2, 3, 1, 1, 2, 0, 2, 0, 1, 1] }
  ],

  getUser(username) { return this.users.find(u => u.username === username); },
  getExam(id) { return this.exams.find(e => e.id === id); },
  getQuestions(examId) { return this.questions[examId] || []; },
  getResultsByUser(userId) { return this.results.filter(r => r.userId === userId); },
  getResultsByExam(examId) { return this.results.filter(r => r.examId === examId); },
  getResult(userId, examId) { return this.results.find(r => r.userId === userId && r.examId === examId); },
  getUserById(id) { return this.users.find(u => u.id === id); },
  getStudents() { return this.users.filter(u => u.role === 'student'); },

  addResult(result) {
    const existing = this.results.findIndex(r => r.userId === result.userId && r.examId === result.examId);
    if (existing >= 0) this.results[existing] = result;
    else this.results.push(result);
    this.save();
  },

  addUser(user) { this.users.push(user); this.save(); },
  updateUser(id, data) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) {
      Object.assign(this.users[idx], data);
      this.save();
    }
  },
  deleteUser(id) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) {
      this.users.splice(idx, 1);
      this.save();
    }
  },

  load() {
    try {
      const stored = localStorage.getItem('ptit_exam_db');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.users) this.users = parsed.users;
        if (parsed.exams) this.exams = parsed.exams;
        if (parsed.questions) this.questions = parsed.questions;
        if (parsed.results) this.results = parsed.results;
      }
    } catch (e) {
      console.error('Failed to load DB from localStorage', e);
    }
  },

  save() {
    try {
      const data = {
        users: this.users,
        exams: this.exams,
        questions: this.questions,
        results: this.results
      };
      localStorage.setItem('ptit_exam_db', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save DB to localStorage', e);
    }
  }
};

DB.load();
