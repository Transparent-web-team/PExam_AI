import csv
import io

data = [
    ['Câu hỏi', 'Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D', 'Đáp án đúng (1-4)', 'Giải thích (Tùy chọn)'],
    ['OOP viết tắt của gì?', 'Object Oriented Protocol', 'Object Oriented Programming', 'Online Object Programming', 'Object Optimizer Program', '2', 'OOP là Object-Oriented Programming — Lập trình hướng đối tượng.'],
    ['Đặc điểm nào KHÔNG phải của OOP?', 'Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation', '4', 'Bốn đặc điểm chính của OOP: Encapsulation, Inheritance, Polymorphism, Abstraction.'],
    ['Trong Java, từ khoá nào dùng để tạo một lớp con kế thừa lớp cha?', 'implements', 'inherits', 'extends', 'super', '3', 'Từ khoá extends dùng để khai báo kế thừa trong Java.'],
    ['Constructor là gì?', 'Phương thức huỷ đối tượng', 'Phương thức tĩnh của lớp', 'Phương thức khởi tạo đối tượng', 'Phương thức trả về giá trị', '3', 'Constructor là phương thức đặc biệt có cùng tên với class, được gọi khi tạo đối tượng mới.'],
    ['Interface trong Java có thể có phương thức nào?', 'Chỉ abstract method', 'Abstract và static method', 'Abstract, default và static method', 'Không thể có phương thức', '3', 'Từ Java 8, interface có thể có abstract, default và static methods.']
]

output_path = r'd:\Project\PExam\OOP_Exam_Template.csv'
with io.open(output_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)

print(f"Created CSV template at: {output_path}")
