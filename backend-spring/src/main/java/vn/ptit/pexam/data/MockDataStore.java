package vn.ptit.pexam.data;

import org.springframework.stereotype.Component;
import vn.ptit.pexam.model.*;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * In-memory mock data store — no database required.
 * All data is reset on server restart.
 */
@Component
public class MockDataStore {

    public final List<User> users = new CopyOnWriteArrayList<>();
    public final List<Exam> exams = new CopyOnWriteArrayList<>();
    public final Map<String, List<Question>> questions = new HashMap<>();
    public final List<ExamResult> results = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void init() {
        // ── Users ──────────────────────────────────────────────────────────
        users.addAll(List.of(
            new User("u1",  "sinhvien01", "123456", "Nguyễn Văn An",      "an.nv@ptit.edu.vn",     "student", "NA", "B21DCCN001", "D21CQCN01-B"),
            new User("u2",  "sinhvien02", "123456", "Trần Thị Bình",      "binh.tt@ptit.edu.vn",   "student", "TB", "B21DCCN002", "D21CQCN01-B"),
            new User("u3",  "sinhvien03", "123456", "Lê Minh Cường",      "cuong.lm@ptit.edu.vn",  "student", "LC", "B21DCCN003", "D21CQCN02-B"),
            new User("u4",  "sinhvien04", "123456", "Phạm Thị Dung",      "dung.pt@ptit.edu.vn",   "student", "PD", "B21DCCN004", "D21CQCN02-B"),
            new User("u5",  "sinhvien05", "123456", "Hoàng Văn Em",       "em.hv@ptit.edu.vn",     "student", "HE", "B21DCCN005", "D21CQCN01-B"),
            new User("u6",  "sinhvien06", "123456", "Ngô Thị Phương",     "phuong.nt@ptit.edu.vn", "student", "NP", "B21DCCN006", "D21CQCN03-B"),
            new User("u7",  "sinhvien07", "123456", "Đinh Trọng Giang",   "giang.dt@ptit.edu.vn",  "student", "DG", "B21DCCN007", "D21CQCN03-B"),
            new User("u8",  "sinhvien08", "123456", "Vũ Hồng Hà",         "ha.vh@ptit.edu.vn",     "student", "VH", "B21DCCN008", "D21CQCN01-B"),
            new User("u9",  "sinhvien09", "123456", "Trịnh Xuân Hùng",    "hung.tx@ptit.edu.vn",   "student", "TH", "B21DCCN009", "D21CQCN02-B"),
            new User("u10", "sinhvien10", "123456", "Lê Thu Thủy",        "thuy.lt@ptit.edu.vn",   "student", "LT", "B21DCCN010", "D21CQCN03-B"),
            new User("admin", "admin",   "admin123", "Nguyễn Thị Admin", "admin@ptit.edu.vn",     "admin",   "AD", null, null)
        ));

        // ── Exams ─────────────────────────────────────────────────────────
        exams.addAll(List.of(
            new Exam("ex1","Lập trình Web — Luyện tập tuần 1","Lập trình Web","Bài luyện tập HTML, CSS, JavaScript.","practice","open",30,15,10,5,null,null,"admin","2025-01-10",124,true,null),
            new Exam("ex2","Cơ sở dữ liệu — Giữa kỳ","Cơ sở dữ liệu","SQL, ERD, chuẩn hoá.","midterm","open",60,10,10,5,"2025-03-15T08:00","2025-03-15T10:00","admin","2025-01-12",89,false,null),
            new Exam("ex3","Mạng máy tính — Cuối kỳ","Mạng máy tính","TCP/IP, OSI, routing, switching.","final","scheduled",90,40,10,5,"2026-06-10T07:30","2026-06-10T09:00","admin","2025-01-15",0,false,null),
            new Exam("ex4","Lập trình hướng đối tượng — Luyện tập","Lập trình OOP","OOP với Java: class, interface, inheritance, polymorphism.","practice","open",45,20,10,5,null,null,"admin","2025-01-18",211,true,null),
            new Exam("ex5","Toán rời rạc — Giữa kỳ","Toán rời rạc","Logic mệnh đề, tập hợp, đồ thị, tổ hợp.","midterm","completed",60,25,10,5,"2025-11-20T08:00","2025-11-20T09:00","admin","2025-01-20",156,true,null),
            new Exam("ex6","Cấu trúc dữ liệu & Giải thuật — Luyện tập","CTDL & GT","Stack, Queue, Tree, Sorting algorithms.","practice","open",40,20,10,5,null,null,"admin","2025-02-01",178,true,null)
        ));

        // ── Questions ─────────────────────────────────────────────────────
        questions.put("ex1", List.of(
            q("q1","Thẻ HTML nào dùng để khai báo đoạn văn bản?","Thẻ <p> dùng để tạo đoạn văn bản.","<span>","<p>","<div>","<br>",1),
            q("q2","CSS viết tắt của từ gì?","CSS = Cascading Style Sheets.","Colorful Style Sheets","Computer Style Sheets","Cascading Style Sheets","Creative Style Sheets",2),
            q("q3","Thuộc tính nào thay đổi màu nền CSS?","background-color dùng để đặt màu nền.","color","bgcolor","background-color","background",2),
            q("q4","Lệnh JS nào hiển thị hộp thoại thông báo?","alert() hiển thị pop-up.","console.log()","document.write()","alert()","prompt()",2),
            q("q5","Cú pháp khai báo biến ES6?","let và const được khuyến khích.","variable x=5","var x=5","let x=5","int x=5",2),
            q("q6","Thẻ tạo danh sách không thứ tự?","<ul> = unordered list.","<ol>","<list>","<ul>","<li>",2),
            q("q7","Phương thức JS chọn phần tử theo ID?","getElementById() trả về phần tử có id.","getElement()","getElementById()","selectById()","querySelector()",1),
            q("q8","Thuộc tính CSS chữ in đậm?","font-weight: bold;","font-style:bold","text-weight:bold","font-weight:bold","font-bold:true",2),
            q("q9","Cú pháp thêm liên kết HTML?","<a href='...'> dùng để tạo hyperlink.","<a url=''>","<a href=''>","<link href=''>","<a link=''>",1),
            q("q10","Flexbox căn chỉnh trục chính?","justify-content căn theo main axis.","align-items","justify-content","flex-direction","align-content",1),
            q("q11","JavaScript là ngôn ngữ loại nào?","JavaScript là ngôn ngữ thông dịch.","Compiled","Interpreted","Assembly","Machine code",1),
            q("q12","Meta viewport dùng cho?","<meta name='viewport'> giúp responsive.","<meta name='screen'>","<meta name='viewport'>","<meta name='responsive'>","<meta name='mobile'>",1),
            q("q13","Selector CSS cho tất cả <p>?","p là type selector chọn tất cả <p>.","#p",".p","p","*p",2),
            q("q14","Hàm JS làm tròn số?","round/floor/ceil đều hợp lệ.","Math.round()","Math.floor()","Math.ceil()","Tất cả đều đúng",3),
            q("q15","Selector CSS cho class 'active'?","Selector class dùng dấu chấm: .active","#active","*active",".active","active",2)
        ));

        questions.put("ex2", List.of(
            q("db1","Mô hình CSDL phổ biến nhất?","RDBMS đang được dùng phổ biến.","Mô hình phân cấp","Mô hình mạng","Mô hình quan hệ","Mô hình hướng đối tượng",2),
            q("db2","Từ khoá lấy dữ liệu SQL?","SELECT dùng để truy vấn.","GET","EXTRACT","RETRIEVE","SELECT",3),
            q("db3","Primary Key đặc điểm?","Không NULL, Unique.","Có thể NULL","Không trùng và không NULL","Nhiều PK mỗi bảng","Chỉ dùng số",1),
            q("db4","Mục đích chuẩn hóa?","Giảm dư thừa dữ liệu.","Tăng tốc truy vấn","Giảm dư thừa dữ liệu","Mã hoá bảo mật","Tạo khóa ngoại",1),
            q("db5","Lệnh xóa bảng SQL?","DROP TABLE xóa cả cấu trúc.","DELETE TABLE","REMOVE TABLE","DROP TABLE","CLEAR TABLE",2),
            q("db6","Thực thể ERD hình gì?","Hình chữ nhật.","Hình tròn","Hình thoi","Hình chữ nhật","Hình tam giác",2),
            q("db7","RDBMS mã nguồn mở phổ biến?","MySQL phổ biến nhất.","Oracle","SQL Server","MySQL","MongoDB",2),
            q("db8","RDBMS viết tắt?","Relational Database Management System.","Relational Database Management System","Rapid Data Base Making System","Realtime Data Broadcast","Row Data Backup",0),
            q("db9","JOIN trả về tất cả kể cả không khớp?","FULL OUTER JOIN.","INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN",3),
            q("db10","Từ khoá thêm bản ghi SQL?","INSERT INTO.","UPDATE","INSERT INTO","ADD ROW","CREATE",1)
        ));

        questions.put("ex4", List.of(
            q("oop1","OOP viết tắt?","Object-Oriented Programming.","Object Oriented Protocol","Object Oriented Programming","Online Object Programming","Object Optimizer",1),
            q("oop2","Đặc điểm KHÔNG phải OOP?","4 đặc điểm: Encap, Inherit, Poly, Abstraction.","Encapsulation","Inheritance","Polymorphism","Compilation",3),
            q("oop3","Kế thừa Java?","extends.","implements","inherits","extends","super",2),
            q("oop4","Constructor là?","Phương thức khởi tạo.","Phương thức huỷ","Phương thức tĩnh","Phương thức khởi tạo","Phương thức trả về",2),
            q("oop5","Interface Java từ Java 8?","Abstract, default và static.","Chỉ abstract","Abstract và static","Abstract, default và static","Không có",2),
            q("oop6","Encapsulation nghĩa là?","Che giấu dữ liệu, truy cập qua method.","Che giấu dữ liệu qua phương thức","Tạo nhiều object","Kế thừa nhiều cha","Ghi đè method",0),
            q("oop7","Polymorphism nghĩa là?","Một method nhiều dạng.","Kế thừa nhiều cha","Một method nhiều dạng","Che giấu thông tin","Tạo lớp trừu tượng",1),
            q("oop8","Gọi method lớp cha Java?","super.","parent","base","super","this",2),
            q("oop9","Abstract class khác Interface?","Abstract class có method cụ thể.","Không có constructor","Có thuộc tính và method cụ thể","Interface đa kế thừa abstract","Không khác",1),
            q("oop10","Overriding là?","Lớp con định nghĩa lại method.","Định nghĩa lại ở lớp con","Nhiều method cùng tên","Gọi method cha","Tạo method tĩnh",0),
            q("oop11","Access modifier mọi nơi?","public.","private","protected","public","default",2),
            q("oop12","Abstraction là?","Ẩn chi tiết, hiển thị chức năng.","Tập trung chi tiết","Ẩn chi tiết hiển thị chức năng","Kế thừa nhiều lớp","Đóng gói dữ liệu",1),
            q("oop13","Class final Java?","Không thể bị kế thừa.","Lớp đầu tiên","Lớp tốt nhất","Không thể kế thừa","Lớp trừu tượng",2),
            q("oop14","Method overloading loại đa hình?","Compile-time polymorphism.","Runtime","Compile-time","Interface","Abstract",1),
            q("oop15","Java kế thừa nhiều class?","Không, nhưng implement nhiều interface.","Có","Không","Có, qua multi","Có, nếu abstract",1),
            q("oop16","Phương thức tự gọi khi huỷ object?","finalize().","destructor()","finalize()","delete()","remove()",1),
            q("oop17","static method thuộc về?","Lớp (class).","Object cụ thể","Lớp (class)","Interface","Abstract class",1),
            q("oop18","Pattern đảm bảo 1 instance?","Singleton.","Factory","Observer","Singleton","Decorator",2),
            q("oop19","sealed class Java 17?","Giới hạn class kế thừa.","Mã hoá dữ liệu","Giới hạn kế thừa","Singleton","Ẩn constructor",1),
            q("oop20","Garbage Collection làm gì?","Giải phóng bộ nhớ tự động.","Xóa tất cả","Giải phóng bộ nhớ không tham chiếu","Nén bộ nhớ","Thu log lỗi",1)
        ));

        // ── Sample Results ────────────────────────────────────────────────
        results.addAll(List.of(
            new ExamResult("r1","u1","ex1",8.67,13,15,22,"2026-01-15T09:22:00", List.of(1,2,2,2,2,2,1,2,1,1,1,1,2,3,2)),
            new ExamResult("r2","u2","ex1",7.33,11,15,28,"2026-01-15T10:01:00", List.of(1,2,2,2,2,2,1,2,1,0,1,1,2,2,2)),
            new ExamResult("r3","u3","ex1",9.33,14,15,18,"2026-01-15T09:45:00", List.of(1,2,2,2,2,2,1,2,1,1,1,1,2,3,2)),
            new ExamResult("r5","u5","ex1",10.0,15,15,15,"2026-01-15T09:15:00", List.of(1,2,2,2,2,2,1,2,1,1,1,1,2,3,2)),
            new ExamResult("r9","u1","ex4",7.50,15,20,40,"2026-01-20T10:40:00", List.of(1,3,2,2,2,0,1,2,1,0,2,1,2,1,1,1,1,2,1,1)),
            new ExamResult("r11","u1","ex2",9.00,9,10,45,"2025-03-15T08:45:00",  List.of(2,3,1,1,2,2,2,0,3,1))
        ));
    }

    // Helper to build Question with 4 options
    private Question q(String id, String content, String explanation,
                       String o0, String o1, String o2, String o3, int correctIdx) {
        return new Question(id, content, explanation, List.of(
            new QuestionOption(id+"o0", o0, 0, correctIdx == 0),
            new QuestionOption(id+"o1", o1, 1, correctIdx == 1),
            new QuestionOption(id+"o2", o2, 2, correctIdx == 2),
            new QuestionOption(id+"o3", o3, 3, correctIdx == 3)
        ));
    }

    // ── Lookup helpers ────────────────────────────────────────────────────
    public Optional<User> findByUsername(String username) {
        return users.stream().filter(u -> u.getUsername().equals(username)).findFirst();
    }

    public Optional<User> findUserById(String id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public Optional<Exam> findExamById(String id) {
        return exams.stream().filter(e -> e.getId().equals(id)).findFirst();
    }

    public List<Question> getQuestions(String examId) {
        return questions.getOrDefault(examId, Collections.emptyList());
    }

    public Optional<ExamResult> findResult(String userId, String examId) {
        return results.stream()
            .filter(r -> r.getUserId().equals(userId) && r.getExamId().equals(examId))
            .findFirst();
    }

    public List<ExamResult> getResultsByUser(String userId) {
        return results.stream().filter(r -> r.getUserId().equals(userId)).toList();
    }

    public List<ExamResult> getResultsByExam(String examId) {
        return results.stream().filter(r -> r.getExamId().equals(examId)).toList();
    }

    public String nextUserId() {
        return "u" + (users.size() + 1);
    }

    public String nextResultId() {
        return "r" + (results.size() + 1);
    }
}
