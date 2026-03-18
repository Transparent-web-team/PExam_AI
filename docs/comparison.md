# So sánh: Manual Coding vs Vibe Coding (AI-Assisted)
## Bối cảnh: Phát triển Backend PExam (Node.js/Express + MSSQL)

---

## 1. Định nghĩa

| | Manual Coding | Vibe Coding |
|---|---|---|
| **Khái niệm** | Lập trình viên tự viết tay toàn bộ code | Dùng AI tool (Claude, Copilot, Gemini…) sinh code, dev review & tích hợp |
| **Vai trò dev** | Tác giả – *viết* code | Reviewer/Director – *định hướng* và *kiểm soát* code |
| **AI tool dùng trong PExam** | — | Antigravity (Gemini), GitHub Copilot |

---

## 2. Quy trình phát triển

### Manual Coding
```
Đọc yêu cầu → Thiết kế API → Viết từng route thủ công
→ Test (Postman) → Debug → Refactor → Done
```
- Route `auth.js` (3 endpoints): **~3–4 giờ**
- Route `exams.js` (8 endpoints + transactions): **~6–8 giờ**
- Tổng backend cơ bản (4 routes + DB): **~2–3 ngày**

### Vibe Coding
```
Mô tả yêu cầu → AI sinh code draft
→ Dev review + chỉnh sửa → Test → Done
```
- Route `auth.js`: **~30–45 phút**
- Route `exams.js`: **~1–1.5 giờ**
- Tổng backend: **~4–6 giờ**

> 🏆 **Vibe coding nhanh hơn 3–5 lần** về tốc độ ra code first-draft.

---

## 3. Chất lượng Code

### Ví dụ thực tế – `POST /api/results/submit`

**Manual** – dễ bỏ sót edge case:
```javascript
// Dễ quên transaction, dễ SQL Injection nếu không cẩn thận
router.post('/submit', async (req, res) => {
    const exam = await db.query(`SELECT * FROM exams WHERE id = ${examId}`); // ⚠️
    let correct = 0;
    for (const ans of answers) {
        const opt = await db.query(`SELECT is_correct FROM question_options WHERE id = ${ans.optionId}`);
        if (opt[0].is_correct) correct++;
    }
    res.json({ score: correct });
});
```

**Vibe Coding** – AI sinh code (thực tế trong `results.js`):
```javascript
// Parameterized query + transaction đầy đủ
const transaction = new mssql.Transaction(pool);
await transaction.begin();
try {
    const correctOptionsResult = await pool.request()
        .input('eid2', examId)
        .query(`SELECT q.id as question_id, qo.id as option_id 
                FROM questions q JOIN question_options qo ON q.id = qo.question_id 
                WHERE q.exam_id = @eid2 AND qo.is_correct = 1`);
    // ...tính điểm, lưu, rollback nếu lỗi
    await transaction.commit();
} catch(txErr) { await transaction.rollback(); throw txErr; }
```

### Đánh giá chất lượng

| Tiêu chí | Manual | Vibe Coding |
|---|---|---|
| **Security** (SQL Injection, auth) | ⚠️ Phụ thuộc kinh nghiệm | ✅ AI dùng parameterized queries |
| **Error handling** | ⚠️ Dễ bỏ sót | ✅ AI sinh try/catch đầy đủ |
| **Business logic** | ✅ Dev hiểu sâu domain | ⚠️ AI có thể hiểu sai yêu cầu |
| **Nhất quán style** | ⚠️ Phụ thuộc cá nhân | ✅ AI duy trì nhất quán |
| **Transaction handling** | ⚠️ Dễ quên | ✅ AI nhắc và implement đúng |

---

## 4. Hiệu năng (Performance)

**N+1 Query trong `exams.js`** (AI sinh ra, cần dev phát hiện & fix):
```javascript
// 1 query/câu hỏi = N+1 problem
for (let q of questions) {
    const optResult = await pool.request()
        .input('qid', q.id)
        .query('SELECT ... FROM question_options WHERE question_id = @qid');
    q.options = optResult.recordset;
}
```

| Tiêu chí | Manual | Vibe Coding |
|---|---|---|
| **N+1 Query** | ⚠️ Dễ mắc nếu không cẩn thận | ⚠️ AI cũng tạo N+1 |
| **Index optimization** | ✅ Dev biết thêm index | ✅ AI gợi ý index |
| **Connection pooling** | ✅ Dev configure chủ động | ✅ AI dùng pool pattern |

---

## 5. Bảng so sánh tổng quan

| Tiêu chí | Manual | Vibe Coding | Điểm thắng |
|---|---|---|---|
| **Tốc độ ra code** | Chậm | Nhanh 3–5x | Vibe Coding |
| **Security mặc định** | Trung bình | Tốt hơn | Vibe Coding |
| **Hiểu logic sâu** | Cao | Thấp hơn | Manual |
| **Error handling** | Thường thiếu | Đầy đủ hơn | Vibe Coding |
| **Khả năng debug** | Nhanh | Chậm hơn | Manual |
| **Sáng tạo giải pháp** | Cao | Thấp (AI theo pattern) | Manual |
| **Nhất quán style** | Không đảm bảo | Cao | Vibe Coding |
| **Risk** | Thấp (hiểu rõ) | Cao hơn (code không hiểu) | Manual |

---

## 6. Điểm mạnh & Điểm yếu

### Manual Coding
**✅** Hiểu sâu codebase, debug nhanh, code sát design ban đầu  
**❌** Chậm, mệt mỏi với boilerplate, dễ bỏ sót edge case

### Vibe Coding
**✅** Rất nhanh với CRUD, AI nhớ best practices, ít boilerplate  
**❌** Dev ít hiểu code AI sinh ra, risk hallucinate, cần review kỹ

---

## 7. Khuyến nghị cho PExam

| Thành phần | Cách tiếp cận | Lý do |
|---|---|---|
| Thiết kế API, DB schema | **Manual** | Cần domain expertise |
| CRUD routes cơ bản | **Vibe Coding** | AI xuất sắc ở đây |
| Business logic tính điểm | **Manual + AI hỗ trợ** | Logic phức tạp, phải hiểu rõ |
| Security (JWT, bcrypt) | **Vibe Coding** | AI theo best practice |
| Transaction phức tạp | **Review kỹ code AI** | AI sinh đúng nhưng cần verify |
| Testing | **Manual** | Dev biết edge case của bài toán |

---

## 8. Kết luận

**PExam** là ví dụ tốt về Vibe Coding thành công khi kết hợp đúng cách:
- Backend Node.js/Express sinh nhờ AI nhưng **dev kiểm soát thiết kế tổng thể**
- Code tốt ở security (parameterized query, bcrypt, JWT)
- Vẫn còn N+1 query cần fix thủ công

> **Câu hỏi cốt lõi:** *"Bạn có hiểu đoạn code AI sinh ra không?"*  
> Nếu không → **Vibe Coding nguy hiểm**. Nếu có → **Vibe Coding hiệu quả**.
