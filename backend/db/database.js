const sql = require('mssql');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'your_password',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'pexam',
    options: {
        encrypt: false, // Use this if you're on Windows and not using strict encryption
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

let poolPromise;

async function getDbConnection() {
    if (!poolPromise) {
        poolPromise = new sql.ConnectionPool(config)
            .connect()
            .then(pool => {
                console.log('Connected to MSSQL');
                return pool;
            })
            .catch(err => {
                console.error('Database Connection Failed! Bad Config: ', err);
                poolPromise = null;
                throw err;
            });
    }
    return poolPromise;
}

async function initDb() {
    const pool = await getDbConnection();

    // Create Tables if not exist
    await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
        CREATE TABLE users (
            id INT IDENTITY(1,1) PRIMARY KEY,
            username NVARCHAR(50) UNIQUE NOT NULL,
            password_hash NVARCHAR(255) NOT NULL,
            name NVARCHAR(100) NOT NULL,
            email NVARCHAR(100) UNIQUE NOT NULL,
            student_id NVARCHAR(20) UNIQUE,
            role NVARCHAR(20) DEFAULT 'student',
            class_name NVARCHAR(50),
            avatar NVARCHAR(255),
            created_at DATETIME DEFAULT GETDATE()
        );

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='exams' and xtype='U')
        CREATE TABLE exams (
            id INT IDENTITY(1,1) PRIMARY KEY,
            title NVARCHAR(255) NOT NULL,
            subject NVARCHAR(100) NOT NULL,
            description NVARCHAR(MAX),
            type NVARCHAR(20) DEFAULT 'practice',
            status NVARCHAR(20) DEFAULT 'draft',
            duration INT NOT NULL,
            question_count INT NOT NULL,
            total_score DECIMAL(5,2) DEFAULT 10.0,
            passing_score DECIMAL(5,2) DEFAULT 5.0,
            start_time DATETIME,
            end_time DATETIME,
            allow_retake BIT DEFAULT 0,
            created_by INT,
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY(created_by) REFERENCES users(id)
        );

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='questions' and xtype='U')
        CREATE TABLE questions (
            id INT IDENTITY(1,1) PRIMARY KEY,
            exam_id INT NOT NULL,
            content NVARCHAR(MAX) NOT NULL,
            explanation NVARCHAR(MAX),
            created_at DATETIME DEFAULT GETDATE(),
            FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE
        );

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='question_options' and xtype='U')
        CREATE TABLE question_options (
            id INT IDENTITY(1,1) PRIMARY KEY,
            question_id INT NOT NULL,
            content NVARCHAR(MAX) NOT NULL,
            is_correct BIT DEFAULT 0,
            display_order INT DEFAULT 0,
            FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE
        );

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='exam_results' and xtype='U')
        CREATE TABLE exam_results (
            id INT IDENTITY(1,1) PRIMARY KEY,
            user_id INT NOT NULL,
            exam_id INT NOT NULL,
            score DECIMAL(5,2) NOT NULL,
            correct_answers INT NOT NULL,
            total_questions INT NOT NULL,
            status NVARCHAR(20) DEFAULT 'completed',
            duration INT,
            started_at DATETIME,
            submit_time DATETIME DEFAULT GETDATE(),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(exam_id) REFERENCES exams(id)
        );

        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='student_answers' and xtype='U')
        CREATE TABLE student_answers (
            id INT IDENTITY(1,1) PRIMARY KEY,
            result_id INT NOT NULL,
            question_id INT NOT NULL,
            selected_option_id INT,
            FOREIGN KEY(result_id) REFERENCES exam_results(id) ON DELETE CASCADE,
            FOREIGN KEY(question_id) REFERENCES questions(id),
            FOREIGN KEY(selected_option_id) REFERENCES question_options(id)
        );
    `);

    // Check if we need to seed data (if users table is empty)
    const result = await pool.request().query('SELECT COUNT(*) as count FROM users');
    if (result.recordset[0].count === 0) {
        console.log('Seeding initial data...');
        await seedData(pool);
        console.log('Seeding complete.');
    } else {
        console.log('Database already initialized and seeded.');
    }

    return pool;
}

// Function to hash password during seeding
async function hashPw(password) {
    return await bcrypt.hash(password, 10);
}

async function seedData(pool) {
    // 1. Seed Users
    const defaultPassword = await hashPw('123456');
    const adminPassword = await hashPw('admin123');

    const request = pool.request();
    request.input('p1', sql.NVARCHAR, defaultPassword);
    request.input('p2', sql.NVARCHAR, adminPassword);

    await request.query(`
        INSERT INTO users (username, password_hash, name, email, student_id, role, class_name, avatar) 
        VALUES 
        ('sinhvien01', @p1, N'Nguyễn Văn An', 'an.nv@ptit.edu.vn', 'B21DCCN001', 'student', 'D21CQCN01-B', 'NA'),
        ('sinhvien02', @p1, N'Trần Thị Bình', 'binh.tt@ptit.edu.vn', 'B21DCCN002', 'student', 'D21CQCN01-B', 'TB'),
        ('sinhvien03', @p1, N'Lê Minh Cường', 'cuong.lm@ptit.edu.vn', 'B21DCCN003', 'student', 'D21CQCN02-B', 'LC'),
        ('sinhvien04', @p1, N'Phạm Thị Dung', 'dung.pt@ptit.edu.vn', 'B21DCCN004', 'student', 'D21CQCN02-B', 'PD'),
        ('sinhvien05', @p1, N'Hoàng Văn Em', 'em.hv@ptit.edu.vn', 'B21DCCN005', 'student', 'D21CQCN01-B', 'HE'),
        ('admin', @p2, N'Nguyễn Thị Admin', 'admin@ptit.edu.vn', NULL, 'admin', NULL, 'AD')
    `);

    // 2. Fetch admin ID
    const adminRes = await pool.request().query("SELECT id FROM users WHERE username='admin'");
    const adminId = adminRes.recordset[0].id;

    const sv01Res = await pool.request().query("SELECT id FROM users WHERE username='sinhvien01'");
    const sv01Id = sv01Res.recordset[0].id;
    const sv02Res = await pool.request().query("SELECT id FROM users WHERE username='sinhvien02'");
    const sv02Id = sv02Res.recordset[0].id;

    // 3. Seed Exams
    const insertExam = async (e) => {
        const r = await pool.request()
            .input('title', sql.NVarChar, e.title)
            .input('subject', sql.NVarChar, e.subject)
            .input('description', sql.NVarChar, e.description)
            .input('type', sql.NVarChar, e.type)
            .input('status', sql.NVarChar, e.status)
            .input('duration', sql.Int, e.duration)
            .input('question_count', sql.Int, 0)
            .input('total_score', sql.Decimal, e.total_score || 10)
            .input('passing_score', sql.Decimal, e.passing_score || 5)
            .input('start_time', sql.DateTime, e.start_time || null)
            .input('end_time', sql.DateTime, e.end_time || null)
            .input('allow_retake', sql.Bit, e.allow_retake ? 1 : 0)
            .input('created_by', sql.Int, adminId)
            .query(`INSERT INTO exams (title, subject, description, type, status, duration, question_count, total_score, passing_score, start_time, end_time, allow_retake, created_by)
                    OUTPUT INSERTED.id VALUES (@title, @subject, @description, @type, @status, @duration, @question_count, @total_score, @passing_score, @start_time, @end_time, @allow_retake, @created_by)`);
        return r.recordset[0].id;
    };

    const insertQuestion = async (examId, content, explanation) => {
        const r = await pool.request()
            .input('exam_id', sql.Int, examId)
            .input('content', sql.NVarChar, content)
            .input('explanation', sql.NVarChar, explanation || '')
            .query(`INSERT INTO questions (exam_id, content, explanation) OUTPUT INSERTED.id VALUES (@exam_id, @content, @explanation)`);
        return r.recordset[0].id;
    };

    const insertOption = async (qid, content, is_correct, order) => {
        await pool.request()
            .input('question_id', sql.Int, qid)
            .input('content', sql.NVarChar, content)
            .input('is_correct', sql.Bit, is_correct ? 1 : 0)
            .input('display_order', sql.Int, order)
            .query(`INSERT INTO question_options (question_id, content, is_correct, display_order) VALUES (@question_id, @content, @is_correct, @display_order)`);
    };

    const insertQWithOptions = async (examId, content, explanation, options, correctIdx) => {
        const qid = await insertQuestion(examId, content, explanation);
        for (let i = 0; i < options.length; i++) {
            await insertOption(qid, options[i], i === correctIdx, i);
        }
        return qid;
    };

    const updateQCount = async (examId) => {
        await pool.request().input('eid', sql.Int, examId)
            .query(`UPDATE exams SET question_count = (SELECT COUNT(*) FROM questions WHERE exam_id = @eid) WHERE id = @eid`);
    };

    // ----- EXAM 1: Lập trình Web (15 questions) -----
    const ex1 = await insertExam({ title: 'Lập trình Web — Luyện tập tuần 1', subject: 'Lập trình Web', description: 'Bài luyện tập các khái niệm cơ bản HTML, CSS và JavaScript.', type: 'practice', status: 'open', duration: 30, allow_retake: true });
    const webQs = [
        ['Thẻ HTML nào dùng để khai báo đoạn văn bản?', 'Thẻ <p> (paragraph) dùng để tạo đoạn văn bản trong HTML.', ['<span>', '<p>', '<div>', '<br>'], 1],
        ['CSS viết tắt của từ gì?', 'CSS là viết tắt của Cascading Style Sheets.', ['Colorful Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets'], 2],
        ['Thuộc tính nào dùng để thay đổi màu nền trong CSS?', 'Thuộc tính background-color dùng để đặt màu nền cho phần tử.', ['color', 'bgcolor', 'background-color', 'background'], 2],
        ['Trong JavaScript, lệnh nào dùng để hiển thị hộp thoại thông báo?', 'Hàm alert() hiển thị hộp thoại pop-up với nội dung thông báo.', ['console.log()', 'document.write()', 'alert()', 'prompt()'], 2],
        ['Đâu là cú pháp đúng để khai báo biến trong JavaScript (ES6)?', 'Trong ES6, let và const là cách khai báo biến được khuyến khích.', ['variable x = 5', 'var x = 5', 'let x = 5', 'int x = 5'], 2],
        ['Thẻ nào dùng để tạo danh sách không có thứ tự?', '<ul> (unordered list) tạo danh sách không có thứ tự.', ['<ol>', '<list>', '<ul>', '<li>'], 2],
        ['Phương thức JavaScript nào chọn phần tử theo ID?', 'getElementById() trả về phần tử có id tương ứng.', ['getElement()', 'getElementById()', 'selectById()', 'querySelector()'], 1],
        ['Thuộc tính CSS nào dùng để thiết kế kiểu chữ in đậm?', 'font-weight: bold làm cho chữ in đậm.', ['font-style:bold', 'text-weight:bold', 'font-weight:bold', 'font-bold:true'], 2],
        ['Cú pháp nào đúng để thêm liên kết trong HTML?', 'Thẻ <a href="..."> dùng để tạo liên kết (hyperlink).', ['<a url="url">text</a>', '<a href="url">text</a>', '<link href="url">text</link>', '<a link="url">text</a>'], 1],
        ['Trong CSS, Flexbox dùng thuộc tính nào để căn chỉnh phần tử theo trục chính?', 'justify-content căn chỉnh các phần tử theo trục chính (main axis).', ['align-items', 'justify-content', 'flex-direction', 'align-content'], 1],
        ['JavaScript là ngôn ngữ lập trình loại nào?', 'JavaScript là ngôn ngữ thông dịch (interpreted), chạy trực tiếp trên trình duyệt.', ['Compiled', 'Interpreted', 'Assembly', 'Machine code'], 1],
        ['Thẻ meta nào để thiết lập viewport cho trang responsive?', '<meta name="viewport" content="width=device-width, initial-scale=1.0"> giúp trang web hiển thị đúng trên thiết bị di động.', ['<meta name="screen">', '<meta name="viewport">', '<meta name="responsive">', '<meta name="mobile">'], 1],
        ['Cách nào để chọn tất cả thẻ <p> trong CSS?', 'Selector kiểu (type selector) "p" chọn tất cả các phần tử <p>.', ['#p', '.p', 'p', '*p'], 2],
        ['Hàm nào trong JavaScript dùng để làm tròn số thực?', 'Math.round() làm tròn thông thường, Math.floor() làm tròn xuống, Math.ceil() làm tròn lên.', ['Math.round()', 'Math.floor()', 'Math.ceil()', 'Tất cả đều đúng'], 3],
        ['Đâu là selector CSS đúng để chọn phần tử có class "active"?', 'Selector class dùng dấu chấm (.) trước tên class: .active', ['#active', '*active', '.active', 'active'], 2],
    ];
    for (const [content, exp, opts, cor] of webQs) await insertQWithOptions(ex1, content, exp, opts, cor);
    await updateQCount(ex1);

    // ----- EXAM 2: CSDL Giữa kỳ (10 questions) -----
    const ex2 = await insertExam({ title: 'Cơ sở dữ liệu — Giữa kỳ', subject: 'Cơ sở dữ liệu', description: 'Bài thi giữa kỳ môn Cơ sở dữ liệu, bao gồm SQL, ERD, chuẩn hoá.', type: 'midterm', status: 'open', duration: 60, allow_retake: false });
    const dbQs = [
        ['Mô hình cơ sở dữ liệu phổ biến nhất hiện nay là gì?', 'Mô hình cơ sở dữ liệu quan hệ (RDBMS) hiện đang được sử dụng phổ biến nhất.', ['Mô hình phân cấp', 'Mô hình mạng', 'Mô hình quan hệ', 'Mô hình hướng đối tượng'], 2],
        ['Trong SQL, từ khoá nào dùng để lấy dữ liệu từ một bảng?', 'SELECT dùng để truy vấn dữ liệu từ bảng.', ['GET', 'EXTRACT', 'RETRIEVE', 'SELECT'], 3],
        ['Khóa chính (Primary Key) có đặc điểm nào sau đây?', 'Khóa chính dùng để định danh duy nhất mỗi dòng dữ liệu, nên không được NULL và phải Unique.', ['Có thể chứa giá trị NULL', 'Không được phép trùng lặp và không NULL', 'Mỗi bảng có nhiều Khóa chính', 'Chỉ dùng cho dữ liệu số'], 1],
        ['Chuẩn hóa dữ liệu (Normalization) nhằm mục đích gì?', 'Chuẩn hóa giúp loại bỏ sự dư thừa và đảm bảo tính nhất quán của dữ liệu.', ['Tăng tốc độ truy vấn', 'Giảm thiểu dư thừa dữ liệu và tránh dị thường dữ liệu', 'Mã hóa dữ liệu bảo mật', 'Tạo khóa ngoại tự động'], 1],
        ['Lệnh SQL nào dùng để xóa bảng và toàn bộ dữ liệu của nó?', 'DROP TABLE xóa cấu trúc bảng và mọi dữ liệu bên trong.', ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'CLEAR TABLE'], 2],
        ['Trong ERD, thực thể (Entity) được biểu diễn bằng hình gì?', 'Thực thể được biểu diễn bằng hình chữ nhật trong sơ đồ ERD.', ['Hình tròn', 'Hình thoi', 'Hình chữ nhật', 'Hình tam giác'], 2],
        ['Hệ quản trị CSDL quan hệ mã nguồn mở nào phổ biến nhất?', 'MySQL là hệ quản trị CSDL quan hệ mã nguồn mở phổ biến nhất.', ['Oracle', 'SQL Server', 'MySQL', 'MongoDB'], 2],
        ['RDBMS là viết tắt của từ gì?', 'RDBMS nghĩa là Hệ quản trị cơ sở dữ liệu quan hệ.', ['Relational Database Management System', 'Rapid Data Base Making System', 'Realtime Data Broadcast Management Software', 'Row Data Backup Management System'], 0],
        ['Lệnh JOIN nào trả về tất cả kết quả từ cả hai bảng kể cả khi không khớp nối?', 'FULL OUTER JOIN trả về mọi bản ghi ở cả hai bảng, giá trị không khớp sẽ là NULL.', ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], 3],
        ['Trong SQL, từ khoá nào dùng để thêm mới một bản ghi?', 'INSERT INTO dùng để chèn bản ghi mới vào một bảng.', ['UPDATE', 'INSERT INTO', 'ADD ROW', 'CREATE'], 1],
    ];
    for (const [content, exp, opts, cor] of dbQs) await insertQWithOptions(ex2, content, exp, opts, cor);
    await updateQCount(ex2);

    // ----- EXAM 3: Mạng máy tính Cuối kỳ (scheduled, 15 questions) -----
    const ex3 = await insertExam({ title: 'Mạng máy tính — Cuối kỳ', subject: 'Mạng máy tính', description: 'Bài thi cuối kỳ môn Mạng máy tính — TCP/IP, OSI, routing, switching.', type: 'final', status: 'scheduled', duration: 90, allow_retake: false, start_time: new Date('2026-06-10T07:30:00'), end_time: new Date('2026-06-10T09:00:00') });
    const netQs = [
        ['Mô hình OSI có bao nhiêu tầng?', 'Mô hình OSI có 7 tầng từ tầng vật lý đến tầng ứng dụng.', ['5', '6', '7', '8'], 2],
        ['Địa chỉ IP thuộc tầng nào trong mô hình OSI?', 'Tầng Network (tầng 3) chịu trách nhiệm định tuyến và địa chỉ IP.', ['Tầng 1 - Physical', 'Tầng 2 - Data Link', 'Tầng 3 - Network', 'Tầng 4 - Transport'], 2],
        ['Giao thức TCP khác UDP ở điểm nào chính?', 'TCP có cơ chế xác nhận (acknowledgment) và đảm bảo dữ liệu đến đúng thứ tự.', ['TCP nhanh hơn UDP', 'TCP là hướng kết nối và đảm bảo truyền tin', 'UDP đảm bảo kết nối', 'Cả hai đều giống nhau'], 1],
        ['DNS viết tắt của gì?', 'DNS - Domain Name System, chuyển đổi tên miền thành địa chỉ IP.', ['Dynamic Name Server', 'Domain Name System', 'Data Network Service', 'Digital Network Standard'], 1],
        ['Lớp địa chỉ IP nào có dải địa chỉ từ 192.168.x.x?', 'Địa chỉ bắt đầu bằng 192.168.x.x thuộc lớp C.', ['Lớp A', 'Lớp B', 'Lớp C', 'Lớp D'], 2],
        ['Giao thức nào dùng để gửi email?', 'SMTP (Simple Mail Transfer Protocol) được dùng để gửi email.', ['HTTP', 'FTP', 'SMTP', 'POP3'], 2],
        ['Switch hoạt động ở tầng nào?', 'Switch hoạt động ở tầng Data Link (tầng 2) của mô hình OSI.', ['Tầng 1 - Physical', 'Tầng 2 - Data Link', 'Tầng 3 - Network', 'Tầng 4 - Transport'], 1],
        ['Router hoạt động chủ yếu ở tầng nào trong mô hình OSI?', 'Router hoạt động ở tầng Network (tầng 3) để định tuyến gói tin.', ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4'], 2],
        ['HTTP sử dụng cổng (port) mặc định nào?', 'HTTP sử dụng port 80 mặc định.', ['21', '25', '80', '443'], 2],
        ['HTTPS sử dụng cổng (port) mặc định nào?', 'HTTPS sử dụng port 443 với bảo mật SSL/TLS.', ['80', '443', '8080', '8443'], 1],
        ['Địa chỉ MAC thuộc tầng nào trong mô hình OSI?', 'Địa chỉ MAC thuộc tầng 2 - Data Link Layer.', ['Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4'], 1],
        ['Giao thức nào dùng để phân giải địa chỉ IP thành địa chỉ MAC?', 'ARP (Address Resolution Protocol) dùng để ánh xạ địa chỉ IP thành địa chỉ MAC.', ['DNS', 'DHCP', 'ARP', 'ICMP'], 2],
        ['Lệnh nào dùng để kiểm tra kết nối mạng?', 'Lệnh ping dùng để kiểm tra kết nối đến một địa chỉ IP hay tên miền.', ['check', 'test', 'ping', 'trace'], 2],
        ['Mẫu subnet mask của lớp C là gì?', 'Subnet mask chuẩn của lớp C là 255.255.255.0.', ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], 2],
        ['FTP sử dụng cổng mặc định nào?', 'FTP dùng port 21 để điều khiển và port 20 để truyền dữ liệu.', ['20', '21', '22', '23'], 1],
    ];
    for (const [content, exp, opts, cor] of netQs) await insertQWithOptions(ex3, content, exp, opts, cor);
    await updateQCount(ex3);

    // ----- EXAM 4: OOP Luyện tập (20 questions) -----
    const ex4 = await insertExam({ title: 'Lập trình hướng đối tượng — Luyện tập', subject: 'Lập trình OOP', description: 'Luyện tập OOP với Java: class, interface, inheritance, polymorphism.', type: 'practice', status: 'open', duration: 45, allow_retake: true });
    const oopQs = [
        ['OOP viết tắt của gì?', 'OOP là Object-Oriented Programming — Lập trình hướng đối tượng.', ['Object Oriented Protocol', 'Object Oriented Programming', 'Online Object Programming', 'Object Optimizer Program'], 1],
        ['Đặc điểm nào KHÔNG phải của OOP?', 'Bốn đặc điểm chính của OOP: Encapsulation, Inheritance, Polymorphism, Abstraction.', ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation'], 3],
        ['Trong Java, từ khoá nào dùng để tạo lớp con kế thừa lớp cha?', 'Từ khoá extends dùng để khai báo kế thừa trong Java.', ['implements', 'inherits', 'extends', 'super'], 2],
        ['Constructor là gì?', 'Constructor là phương thức đặc biệt có cùng tên với class, được gọi khi tạo đối tượng mới.', ['Phương thức huỷ đối tượng', 'Phương thức tĩnh của lớp', 'Phương thức khởi tạo đối tượng', 'Phương thức trả về giá trị'], 2],
        ['Interface trong Java có thể có phương thức nào?', 'Từ Java 8, interface có thể có abstract, default và static methods.', ['Chỉ abstract method', 'Abstract và static method', 'Abstract, default và static method', 'Không thể có phương thức'], 2],
        ['Encapsulation trong OOP nghĩa là?', 'Encapsulation là che giấu trạng thái bên trong và chỉ cho phép truy cập qua các phương thức public.', ['Che giấu dữ liệu và cung cấp quyền truy cập qua phương thức', 'Tạo nhiều đối tượng từ một lớp', 'Kế thừa từ nhiều lớp cha', 'Ghi đè phương thức lớp cha'], 0],
        ['Polymorphism có nghĩa là?', 'Polymorphism cho phép cùng một phương thức hoạt động khác nhau tuỳ thuộc vào đối tượng gọi.', ['Một lớp kế thừa nhiều lớp cha', 'Một phương thức có nhiều dạng thực thi khác nhau', 'Che giấu thông tin bên trong lớp', 'Tạo lớp trừu tượng'], 1],
        ['Từ khoá nào để gọi phương thức của lớp cha trong Java?', 'super dùng để tham chiếu đến lớp cha trực tiếp trong Java.', ['parent', 'base', 'super', 'this'], 2],
        ['Abstract class khác Interface ở điểm nào?', 'Abstract class có thể chứa cả thuộc tính và phương thức đã được triển khai.', ['Abstract class không thể có constructor', 'Abstract class có thể có thuộc tính và phương thức cụ thể', 'Interface có thể đa kế thừa', 'Không có sự khác biệt'], 1],
        ['Overriding là gì?', 'Overriding (ghi đè) là lớp con định nghĩa lại phương thức đã có ở lớp cha.', ['Định nghĩa lại phương thức ở lớp con', 'Tạo nhiều phương thức cùng tên trong một lớp', 'Gọi phương thức của lớp cha', 'Tạo phương thức tĩnh'], 0],
        ['Access modifier nào cho phép truy cập từ mọi nơi?', 'public cho phép truy cập từ bất kỳ đâu trong chương trình.', ['private', 'protected', 'public', 'default'], 2],
        ['Tính Abstraction trong OOP là?', 'Abstraction ẩn đi sự phức tạp bên trong và chỉ hiển thị những gì cần thiết với người dùng.', ['Tập trung vào chi tiết triển khai', 'Ẩn chi tiết triển khai, chỉ hiển thị chức năng', 'Kế thừa từ nhiều lớp', 'Đóng gói dữ liệu'], 1],
        ['Class final trong Java nghĩa là?', 'final class không thể bị extend bởi lớp khác.', ['Lớp đầu tiên được tạo', 'Lớp tốt nhất', 'Lớp không thể bị kế thừa', 'Lớp trừu tượng'], 2],
        ['Method overloading là ví dụ của loại đa hình nào?', 'Method overloading xảy ra tại thời điểm biên dịch nên là compile-time polymorphism.', ['Runtime polymorphism', 'Compile-time polymorphism', 'Interface polymorphism', 'Abstract polymorphism'], 1],
        ['Trong Java, có thể kế thừa từ nhiều class không?', 'Java không hỗ trợ đa kế thừa từ nhiều class nhưng hỗ trợ implement nhiều interface.', ['Có', 'Không', 'Có, qua từ khoá multi', 'Có, nếu class là abstract'], 1],
        ['Phương thức nào được gọi tự động khi đối tượng bị huỷ trong Java?', 'Phương thức finalize() được gọi bởi Garbage Collector trước khi huỷ đối tượng.', ['destructor()', 'finalize()', 'delete()', 'remove()'], 1],
        ['static method thuộc về?', 'Static method thuộc về class chứ không thuộc về instance của class.', ['Đối tượng cụ thể', 'Lớp (class)', 'Interface', 'Abstract class'], 1],
        ['Design pattern nào đảm bảo chỉ có một instance của class?', 'Singleton pattern đảm bảo một class chỉ có duy nhất một instance.', ['Factory', 'Observer', 'Singleton', 'Decorator'], 2],
        ['Garbage Collection trong Java thực hiện điều gì?', 'Garbage Collector tự động tìm và giải phóng bộ nhớ cho các đối tượng không còn được tham chiếu.', ['Xoá tất cả đối tượng', 'Tự động giải phóng bộ nhớ không còn được tham chiếu', 'Nén dữ liệu bộ nhớ', 'Thu gom log lỗi'], 1],
        ['Overloading là gì?', 'Overloading là có nhiều phương thức cùng tên nhưng khác tham số trong cùng một class.', ['Ghi đè phương thức lớp cha', 'Định nghĩa lại phương thức', 'Nhiều phương thức cùng tên nhưng khác tham số', 'Phương thức tĩnh'], 2],
    ];
    for (const [content, exp, opts, cor] of oopQs) await insertQWithOptions(ex4, content, exp, opts, cor);
    await updateQCount(ex4);

    // ----- EXAM 5: An toàn thông tin (20 questions, practice, open) -----
    const ex5 = await insertExam({ title: 'An toàn thông tin — Luyện tập', subject: 'An toàn thông tin', description: 'Các khái niệm cơ bản về bảo mật, mã hoá, tường lửa và các cuộc tấn công mạng phổ biến.', type: 'practice', status: 'open', duration: 40, allow_retake: true });
    const secQs = [
        ['SQL Injection là gì?', 'SQL Injection là kiểu tấn công chèn mã SQL độc hại vào câu truy vấn để thao túng cơ sở dữ liệu.', ['Tấn công vào server vật lý', 'Chèn mã SQL độc hại vào câu truy vấn', 'Tấn công từ chối dịch vụ', 'Đánh cắp cookie'], 1],
        ['Mã hoá đối xứng (Symmetric Encryption) nghĩa là?', 'Mã hoá đối xứng sử dụng cùng một khóa cho cả quá trình mã hóa và giải mã.', ['Dùng khóa công khai để mã hóa', 'Dùng cùng một khóa cho mã hóa và giải mã', 'Dùng hai khóa khác nhau', 'Không cần khóa'], 1],
        ['XSS (Cross-Site Scripting) là tấn công gì?', 'XSS là tấn công chèn mã JavaScript độc hại vào trang web để thực thi trong trình duyệt người dùng.', ['Tấn công vào server database', 'Chèn mã độc vào trang web để tấn công trình duyệt người dùng', 'Tấn công từ chối dịch vụ', 'Phá hoại cơ sở dữ liệu'], 1],
        ['DDoS là gì?', 'DDoS (Distributed Denial of Service) là tấn công làm tê liệt dịch vụ bằng cách gửi đại lượng yêu cầu cực lớn từ nhiều nguồn.', ['Phần mềm độc hại', 'Tấn công từ chối dịch vụ phân tán', 'Kiểu hack mật khẩu', 'Tấn công SQL'], 1],
        ['Phishing là gì?', 'Phishing là giả mạo trang web/email đáng tin cậy để đánh cắp thông tin người dùng.', ['Virus tự nhân bản', 'Giả mạo để lấy thông tin nhạy cảm', 'Mã hóa dữ liệu', 'Chặn gói tin mạng'], 1],
        ['HTTPS khác HTTP ở điểm nào?', 'HTTPS sử dụng SSL/TLS để mã hóa dữ liệu truyền tải, bảo vệ khỏi nghe lén.', ['HTTPS nhanh hơn HTTP', 'HTTPS mã hóa dữ liệu bằng SSL/TLS', 'HTTPS dùng port 80', 'Không có sự khác biệt'], 1],
        ['Firewall (Tường lửa) dùng để làm gì?', 'Firewall kiểm soát và lọc lưu lượng mạng dựa trên các quy tắc bảo mật đã thiết lập.', ['Tăng tốc độ mạng', 'Lọc và kiểm soát lưu lượng mạng', 'Mã hóa dữ liệu', 'Quản lý tài khoản người dùng'], 1],
        ['Mã hoá RSA là loại mã hoá nào?', 'RSA là mã hoá bất đối xứng, sử dụng cặp khóa công khai và khóa bí mật.', ['Đối xứng', 'Bất đối xứng', 'Hàm băm', 'Không có khóa'], 1],
        ['Hàm băm (Hash function) có đặc điểm gì?', 'Hàm băm là một chiều, không thể đảo ngược để tìm lại dữ liệu gốc từ mã băm.', ['Có thể giải mã ngược', 'Dữ liệu khác nhau cho mã băm giống nhau', 'Là hàm một chiều, không thể đảo ngược', 'Cần khóa để thực hiện'], 2],
        ['Cookie stealing là tấn công nhắm vào điều gì?', 'Cookie thường chứa session token xác thực, bị đánh cắp sẽ cho phép giả mạo đăng nhập.', ['Mật khẩu của người dùng', 'Session cookie xác thực phiên đăng nhập', 'Dữ liệu database', 'Source code trang web'], 1],
    ];
    for (const [content, exp, opts, cor] of secQs) await insertQWithOptions(ex5, content, exp, opts, cor);
    await updateQCount(ex5);

    // ----- EXAM 6: Hệ điều hành Giữa kỳ (15 questions) -----
    const ex6 = await insertExam({ title: 'Hệ điều hành — Giữa kỳ', subject: 'Hệ điều hành', description: 'Quản lý tiến trình, bộ nhớ, deadlock, scheduling.', type: 'midterm', status: 'open', duration: 60, allow_retake: false });
    const osQs = [
        ['Hệ điều hành là gì?', 'Hệ điều hành là phần mềm hệ thống quản lý tài nguyên phần cứng và cung cấp dịch vụ cho các chương trình.', ['Ngôn ngữ lập trình', 'Phần mềm quản lý tài nguyên phần cứng và cung cấp dịch vụ cho chương trình', 'Phần mềm văn phòng', 'Driver thiết bị'], 1],
        ['Process (Tiến trình) là gì?', 'Tiến trình là một chương trình đang thực thi, có không gian địa chỉ và trạng thái riêng.', ['Một tệp chương trình trên đĩa', 'Một chương trình đang thực thi với trạng thái riêng', 'Luồng thực thi nhỏ hơn thread', 'Bộ nhớ đệm'], 1],
        ['Deadlock xảy ra khi nào?', 'Deadlock xảy ra khi các tiến trình chờ đợi lẫn nhau mà không bao giờ có thể tiếp tục.', ['CPU bị quá tải', 'Các tiến trình chờ đợi tài nguyên của nhau vĩnh viễn', 'Bộ nhớ đầy', 'Hết thời gian xử lý'], 1],
        ['Scheduling algorithm nào ưu tiên tiến trình có thời gian xử lý ngắn nhất?', 'SJF (Shortest Job First) ưu tiên tiến trình có burst time ngắn nhất.', ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling'], 1],
        ['Virtual Memory (Bộ nhớ ảo) là gì?', 'Bộ nhớ ảo cho phép chương trình sử dụng nhiều bộ nhớ hơn RAM vật lý bằng cách sử dụng đĩa cứng.', ['RAM nhanh hơn', 'Kỹ thuật sử dụng đĩa cứng như RAM mở rộng', 'Bộ đệm CPU', 'Bộ nhớ cache'], 1],
        ['Semaphore dùng để làm gì?', 'Semaphore là cơ chế đồng bộ hóa dùng để kiểm soát quyền truy cập vào tài nguyên dùng chung.', ['Quản lý bộ nhớ', 'Đồng bộ hóa tiến trình và kiểm soát quyền truy cập tài nguyên', 'Lập lịch CPU', 'Quản lý tệp tin'], 1],
        ['Thread khác Process ở điểm nào chính?', 'Thread là đơn vị thực thi nhẹ hơn, chia sẻ không gian địa chỉ với các thread khác trong cùng process.', ['Thread nhanh hơn và chia sẻ không gian địa chỉ của process', 'Thread không có bộ nhớ riêng', 'Thread là tiến trình lớn hơn', 'Thread và Process giống nhau'], 0],
        ['Page fault xảy ra khi nào?', 'Page fault xảy ra khi tiến trình truy cập vào trang bộ nhớ chưa được nạp vào RAM.', ['RAM đầy', 'Tiến trình truy cập trang chưa có trong RAM', 'CPU quá tải', 'Ổ đĩa hỏng'], 1],
        ['Round Robin scheduling hoạt động như thế nào?', 'Round Robin cấp phát CPU cho từng tiến trình theo từng time quantum cố định, theo vòng tròn.', ['Ưu tiên tiến trình có độ ưu tiên cao nhất', 'Cấp CPU theo time quantum theo vòng tròn tuần tự', 'Ưu tiên tiến trình có burst time ngắn nhất', 'Cấp CPU theo thứ tự đến trước'], 1],
        ['Hệ thống tệp tin (File system) là gì?', 'File system là cách tổ chức và quản lý dữ liệu trên thiết bị lưu trữ.', ['Phương pháp mã hóa tệp', 'Cách tổ chức và quản lý dữ liệu trên thiết bị lưu trữ', 'Phần mềm soạn thảo văn bản', 'Driver ổ đĩa'], 1],
    ];
    for (const [content, exp, opts, cor] of osQs) await insertQWithOptions(ex6, content, exp, opts, cor);
    await updateQCount(ex6);

    // 4. Seed Exam Results for sinhvien01
    await pool.request().input('uid', sql.Int, sv01Id).input('eid', sql.Int, ex1).input('score', sql.Decimal, 8.67).input('correct', sql.Int, 13).input('total', sql.Int, 15).input('duration', sql.Int, 22)
        .query(`INSERT INTO exam_results (user_id,exam_id,score,correct_answers,total_questions,duration) VALUES (@uid,@eid,@score,@correct,@total,@duration)`);
    await pool.request().input('uid', sql.Int, sv01Id).input('eid', sql.Int, ex2).input('score', sql.Decimal, 9.00).input('correct', sql.Int, 9).input('total', sql.Int, 10).input('duration', sql.Int, 45)
        .query(`INSERT INTO exam_results (user_id,exam_id,score,correct_answers,total_questions,duration) VALUES (@uid,@eid,@score,@correct,@total,@duration)`);
    await pool.request().input('uid', sql.Int, sv01Id).input('eid', sql.Int, ex4).input('score', sql.Decimal, 7.50).input('correct', sql.Int, 15).input('total', sql.Int, 20).input('duration', sql.Int, 40)
        .query(`INSERT INTO exam_results (user_id,exam_id,score,correct_answers,total_questions,duration) VALUES (@uid,@eid,@score,@correct,@total,@duration)`);
    await pool.request().input('uid', sql.Int, sv01Id).input('eid', sql.Int, ex5).input('score', sql.Decimal, 8.00).input('correct', sql.Int, 8).input('total', sql.Int, 10).input('duration', sql.Int, 28)
        .query(`INSERT INTO exam_results (user_id,exam_id,score,correct_answers,total_questions,duration) VALUES (@uid,@eid,@score,@correct,@total,@duration)`);

    // Seed results for sinhvien02
    await pool.request().input('uid', sql.Int, sv02Id).input('eid', sql.Int, ex1).input('score', sql.Decimal, 7.33).input('correct', sql.Int, 11).input('total', sql.Int, 15).input('duration', sql.Int, 28)
        .query(`INSERT INTO exam_results (user_id,exam_id,score,correct_answers,total_questions,duration) VALUES (@uid,@eid,@score,@correct,@total,@duration)`);
    await pool.request().input('uid', sql.Int, sv02Id).input('eid', sql.Int, ex4).input('score', sql.Decimal, 8.50).input('correct', sql.Int, 17).input('total', sql.Int, 20).input('duration', sql.Int, 35)
        .query(`INSERT INTO exam_results (user_id,exam_id,score,correct_answers,total_questions,duration) VALUES (@uid,@eid,@score,@correct,@total,@duration)`);
}


module.exports = {
    getDbConnection,
    initDb,
    sql
};
