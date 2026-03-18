# So sánh: Manual Coding vs Vibe Coding (AI-Assisted)
## Bối cảnh: Phát triển Backend hệ thống PExam

---

## 0. So sánh Stack: Node.js/Express (Cũ) vs Spring Boot (Mới)

> Dự án đã chuyển sang **Spring Boot 3.x** (03/2026). Phần này so sánh hai stack.

| Tiêu chí | Node.js / Express | Spring Boot 3.x |
|---|---|---|
| **Ngôn ngữ** | JavaScript (ES6+) | Java 21 |
| **Type Safety** | ❌ Dynamic typing | ✅ Static typing |
| **Kiến trúc** | Route handlers (flat) | Layered (Controller → Service → Repository) |
| **ORM / DB** | Raw SQL (mssql) | Spring Data JPA / Hibernate |
| **Database** | SQL Server (MSSQL) | PostgreSQL 15+ |
| **Schema migration** | ❌ Không có | ✅ Flyway (versioned SQL) |
| **Validation** | ❌ Thủ công kiểm tra | ✅ Jakarta Bean Validation |
| **Phân quyền** | Thủ công middleware | ✅ Spring Security 6 (`@PreAuthorize`) |
| **Refresh token** | ❌ Không có | ✅ Có (7 ngày) |
| **API Docs** | ❌ Không có | ✅ OpenAPI 3 / Swagger UI |
| **Roles** | student / admin | STUDENT / TEACHER / ADMIN |
| **Số API** | 21 | **38** |
| **Số Entity / Bảng** | 6 | **11** |
| **Testing** | Manual (Postman) | JUnit + Testcontainers |
| **Startup time** | ✅ Rất nhanh (~1s) | ⚠️ Chậm hơn (~5–10s) |
| **Thích hợp cho** | MVP/Prototype nhanh | Hệ thống lớn, bảo trì lâu dài |

**Kết luận chuyển đổi:** Spring Boot phù hợp hơn cho PExam ở giai đoạn production vì type-safe, bảo mật chặt chẽ, có migration, validation tự động, và dễ scale. Chi phí là thời gian viết code Java nhiều hơn ban đầu.

---

## 1. Định nghĩa

| | Manual Coding | Vibe Coding |
|---|---|---|
| **Khái niệm** | Lập trình viên tự viết tay toàn bộ code từ nguồn tài liệu, kiến thức cá nhân, StackOverflow | Dùng AI tool (Claude, Copilot, Gemini, Codex...) để sinh code, dev đọc-sửa-tích hợp |
| **Vai trò dev** | Tác giả – _viết_ code | Reviewer/Director – _định hướng_ và _kiểm soát_ code |
| **AI tool dùng trong PExam** | — | Antigravity (Gemini), GitHub Copilot |

---

## 2. Quy trình phát triển (Development Process)

### Manual Coding – Quy trình

```
Đọc yêu cầu → Thiết kế API → Viết từng route thủ công
→ Test thủ công (Postman) → Debug → Refactor → Done
```

- **Thời gian viết** route `auth.js` (3 endpoints): ~3–4 giờ
- **Thời gian viết** route `exams.js` (8 endpoints + transactions): ~6–8 giờ
- **Tổng backend cơ bản** (4 routes + DB init): ~2–3 ngày

### Vibe Coding – Quy trình

```
Mô tả yêu cầu bằng ngôn ngữ tự nhiên → AI sinh code draft
→ Dev review + chỉnh sửa → Test → Điều chỉnh prompt → Done
```

- **Thời gian viết** route `auth.js` (3 endpoints): ~30–45 phút
- **Thời gian viết** route `exams.js` (8 endpoints + transactions): ~1–1.5 giờ
- **Tổng backend cơ bản** (4 routes + DB init): ~4–6 giờ

> 🏆 **Kết luận:** Vibe coding nhanh hơn **3–5 lần** về tốc độ ra code first-draft.

---

## 3. Chất lượng Code

### 3.1 Ví dụ thực tế – Route `results.js` (POST /submit)

**Manual Coding** – Dev có thể bỏ qua edge case:
```javascript
// Ví dụ code manual có thể thiếu xử lý null và transaction
router.post('/submit', async (req, res) => {
    const { examId, answers } = req.body;
    const exam = await db.query(`SELECT * FROM exams WHERE id = ${examId}`); // SQL Injection!
    let correct = 0;
    for (const ans of answers) {
        const opt = await db.query(`SELECT is_correct FROM question_options WHERE id = ${ans.optionId}`);
        if (opt[0].is_correct) correct++;
    }
    await db.query(`INSERT INTO exam_results VALUES (${userId}, ${examId}, ${correct})`);
    res.json({ score: correct });
});
```

**Vibe Coding** – AI sinh code (thực tế trong `results.js`):
```javascript
// AI sinh code đầy đủ: parameterized query, transaction, tính điểm chính xác
const transaction = new mssql.Transaction(pool);
await transaction.begin();
try {
    // Fetch correct answers từ DB thay vì trust client-side
    const correctOptionsResult = await pool.request()
        .input('eid2', examId)
        .query(`SELECT q.id as question_id, qo.id as option_id 
                FROM questions q JOIN question_options qo ON q.id = qo.question_id 
                WHERE q.exam_id = @eid2 AND qo.is_correct = 1`);
    // ... tính điểm, lưu transaction, rollback nếu lỗi
    await transaction.commit();
} catch(txErr) {
    await transaction.rollback();
    throw txErr;
}
```

### 3.2 Đánh giá chất lượng

| Tiêu chí | Manual | Vibe Coding |
|---|---|---|
| **Security** (SQL Injection, auth check) | ⚠️ Phụ thuộc kinh nghiệm | ✅ AI thường dùng parameterized queries |
| **Error handling** | ⚠️ Dễ bỏ sót | ✅ AI sinh try/catch đầy đủ |
| **Business logic** | ✅ Dev hiểu sâu domain | ⚠️ AI có thể hiểu sai yêu cầu |
| **Consistency** | ⚠️ Phụ thuộc phong cách cá nhân | ✅ AI duy trì style nhất quán |
| **Transaction handling** | ⚠️ Dễ quên | ✅ AI nhắc và implement đúng |
| **Over-engineering** | ✅ Dev kiểm soát | ⚠️ AI đôi khi sinh code phức tạp hơn cần |

---

## 4. Khả năng bảo trì (Maintainability)

### Manual Coding
- Dev **hiểu 100%** code mình viết → debug nhanh
- Code phản ánh **kiến trúc của team** (naming conventions, patterns)
- Dễ **refactor** khi hiểu toàn bộ dependency

### Vibe Coding
- Nguy cơ **"code không hiểu"** – dev paste AI output mà không đọc kỹ
- Cần review nghiêm túc trước khi merge (AI có thể sinh logic sai nhưng code không lỗi syntax)
- Code AI sinh ra thường **verbose hơn** – cần dev refactor lại

**Thực tế trong PExam:**
- `exams.js` dòng 174: `const transaction = new (require('mssql')).Transaction(pool)` – pattern lạ nhưng AI dùng nhất quán
- `users.js`: AI sinh dynamic UPDATE query (dòng 92–115) – an toàn nhưng phức tạp hơn cần

---

## 5. Hiệu năng (Performance)

| | Manual | Vibe Coding |
|---|---|---|
| **N+1 Query** | ⚠️ Dễ mắc phải nếu không cẩn thận | ⚠️ AI cũng tạo N+1 (ví dụ: fetch options từng câu hỏi trong vòng lặp ở `exams.js`) |
| **Index optimization** | ✅ Dev có kinh nghiệm biết thêm index | ✅ AI thường gợi ý index |
| **Connection pooling** | ✅ Dev chủ động configure | ✅ AI dùng pool pattern |
| **Query optimization** | ✅ Dev có thể dùng JOIN thay subquery | ⚠️ AI đôi khi dùng subquery thay vì JOIN |

**Ví dụ N+1 trong PExam** (`exams.js` dòng 49–54):
```javascript
// AI sinh code có N+1 – cần dev phát hiện và fix
for (let q of questions) {
    const optResult = await pool.request()
        .input('qid', q.id)
        .query('SELECT ... FROM question_options WHERE question_id = @qid');
    q.options = optResult.recordset; // 1 query/câu hỏi = N+1 problem
}
```

---

## 6. Testing

| | Manual | Vibe Coding |
|---|---|---|
| **Unit test** | Dev tự viết, hiểu rõ cần test gì | AI có thể sinh unit test theo prompt |
| **Edge case coverage** | ⚠️ Phụ thuộc tư duy của dev | ⚠️ AI có thể bỏ sót edge case theo domain |
| **Integration test** | Dev thường dùng Postman | Dev cần test API AI sinh ra cẩn thận hơn |

---

## 7. Bảng so sánh tổng quan

| Tiêu chí | Manual Coding | Vibe Coding | Điểm thắng |
|---|---|---|---|
| **Tốc độ ra code** | Chậm | Nhanh 3–5x | Vibe Coding |
| **Security mặc định** | Trung bình | Tốt hơn | Vibe Coding |
| **Hiểu logic sâu** | Cao | Thấp hơn | Manual |
| **Error handling** | Thường thiếu | Đầy đủ hơn | Vibe Coding |
| **Khả năng debug** | Nhanh | Chậm hơn (phải đọc hiểu code AI) | Manual |
| **Sáng tạo giải pháp** | Cao | Thấp (AI theo pattern phổ biến) | Manual |
| **Nhất quán code style** | Không đảm bảo | Cao | Vibe Coding |
| **Chi phí học ban đầu** | Cao | Thấp | Vibe Coding |
| **Tài liệu (docstring)** | Ít | Nhiều hơn | Vibe Coding |
| **Risk** | Thấp (hiểu rõ) | Cao hơn (code không hiểu) | Manual |

---

## 8. Điểm mạnh & Điểm yếu

### Manual Coding
**✅ Điểm mạnh:**
- Hiểu sâu codebase → debug nhanh
- Code sát với design ban đầu
- Không phụ thuộc tool bên ngoài
- Thích hợp cho logic nghiệp vụ phức tạp

**❌ Điểm yếu:**
- Chậm, mệt mỏi với boilerplate
- Dễ quên xử lý edge case
- Chất lượng phụ thuộc nhiều vào kinh nghiệm
- Tốn thời gian cho code lặp đi lặp lại

### Vibe Coding
**✅ Điểm mạnh:**
- Cực kỳ nhanh cho CRUD patterns
- AI nhớ best practices (parameterized query, try/catch, transaction)
- Giảm boilerplate đáng kể
- Tốt cho prototype/MVP

**❌ Điểm yếu:**
- AI có thể hiểu sai yêu cầu miền (domain)
- Dev ít hiểu code → khó maintain
- AI đôi khi sinh code thừa/phức tạp không cần thiết
- Nguy cơ AI hallucinate API không tồn tại
- Cần prompt engineering skillset mới

---

## 9. Khuyến nghị cho dự án PExam

```
Chiến lược tối ưu: Hybrid Approach
```

| Thành phần | Cách tiếp cận | Lý do |
|---|---|---|
| Thiết kế API, DB schema | **Manual** | Cần domain expertise |
| CRUD routes cơ bản | **Vibe Coding** | Boilerplate, AI xuất sắc ở đây |
| Business logic tính điểm, xếp hạng | **Manual chủ đạo + AI hỗ trợ** | Logic domain cụ thể, cần hiểu rõ |
| Security (JWT, bcrypt) | **Vibe Coding** | AI theo best practice |
| Transaction phức tạp | **Review kỹ code AI** | AI sinh đúng nhưng cần verify |
| Testing | **Manual** | Dev biết rõ edge case của bài toán |
| Documentation/Comments | **Vibe Coding** | AI giỏi mô tả code |

---

## 10. Kết luận

Dự án **PExam** là ví dụ tốt về **Vibe Coding thành công** khi kết hợp đúng cách:

- Backend Node.js/Express được sinh ra nhờ AI nhưng **dev kiểm soát design tổng thể**
- Code quality tốt ở layer security (parameterized query, bcrypt, JWT)
- Còn tồn tại N+1 query problem (cần fix thủ công)
- Thiếu một số API (xem đề xuất trong `api_list.md`)

> **Câu hỏi cốt lõi:** *"Bạn có hiểu đoạn code AI sinh ra không?"*  
> Nếu không, đó là **Vibe Coding nguy hiểm**.  
> Nếu có (dù AI viết), đó là **Vibe Coding hiệu quả** và là tương lai của lập trình.
