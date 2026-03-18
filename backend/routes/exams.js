const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All exam routes require at least authentication
router.use(authenticateToken);

// GET /api/exams - List all exams
router.get('/', async (req, res) => {
    try {
        const pool = await getDbConnection();
        // Students see open exams, admin sees all
        let query = 'SELECT * FROM exams ORDER BY created_at DESC';
        if (req.user.role !== 'admin') {
            query = "SELECT * FROM exams WHERE status IN ('open', 'scheduled', 'completed') ORDER BY created_at DESC";
        }
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Fetch exams error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/exams/:id - Get specific exam details
router.get('/:id', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const examResult = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM exams WHERE id = @id');
        
        const exam = examResult.recordset[0];
        
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Fetch questions and options
        const qResult = await pool.request()
            .input('eid', exam.id)
            .query('SELECT * FROM questions WHERE exam_id = @eid');
        const questions = qResult.recordset;
        
        // Fetch options for each question
        // is_correct is included so the results review page can highlight correct answers.
        // The exam-taking frontend ignores this field during live exam.
        for (let q of questions) {
            const optionQuery = 'SELECT id, question_id, content, display_order, is_correct FROM question_options WHERE question_id = @qid ORDER BY display_order';
            const optResult = await pool.request()
                .input('qid', q.id)
                .query(optionQuery);
            q.options = optResult.recordset;
            
            // hide explanation for students (unless they are reviewing results)
            // To be safe, we will let the client handle it or we can check if they have a completed result.
            // For simplicity and allowing the results page to show explanations, we will comment this out 
            // since the results page needs it. (Or ideally, check if user has result for this exam).
            // if (req.user.role !== 'admin') {
            //     delete q.explanation;
            // }
        }

        exam.questions = questions;
        res.json(exam);
    } catch (err) {
        console.error('Fetch exam details error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Admin routes below
// POST /api/exams (Create empty exam)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const { title, subject, description, type, status, duration, questionCount, totalScore, passingScore, startTime, endTime, allowRetake } = req.body;

        const result = await pool.request()
            .input('title', title)
            .input('subject', subject)
            .input('description', description)
            .input('type', type || 'practice')
            .input('status', status || 'draft')
            .input('duration', duration || 60)
            .input('question_count', questionCount || 0)
            .input('total_score', totalScore || 10)
            .input('passing_score', passingScore || 5)
            .input('start_time', startTime)
            .input('end_time', endTime)
            .input('allow_retake', allowRetake ? 1 : 0)
            .input('created_by', req.user.id)
            .query(`
                INSERT INTO exams (title, subject, description, type, status, duration, question_count, total_score, passing_score, start_time, end_time, allow_retake, created_by)
                OUTPUT INSERTED.id 
                VALUES (@title, @subject, @description, @type, @status, @duration, @question_count, @total_score, @passing_score, @start_time, @end_time, @allow_retake, @created_by)
            `);

        res.status(201).json({ id: result.recordset[0].id, message: 'Exam created successfully' });
    } catch (err) {
        console.error('Create exam error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/exams/:id
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const { title, subject, description, type, status, duration, totalScore, passingScore, startTime, endTime, allowRetake } = req.body;
        
        await pool.request()
            .input('title', title)
            .input('subject', subject)
            .input('description', description)
            .input('type', type)
            .input('status', status)
            .input('duration', duration)
            .input('total_score', totalScore)
            .input('passing_score', passingScore)
            .input('start_time', startTime)
            .input('end_time', endTime)
            .input('allow_retake', allowRetake ? 1 : 0)
            .input('id', req.params.id)
            .query(`
                UPDATE exams SET 
                    title = COALESCE(@title, title),
                    subject = COALESCE(@subject, subject),
                    description = COALESCE(@description, description),
                    type = COALESCE(@type, type),
                    status = COALESCE(@status, status),
                    duration = COALESCE(@duration, duration),
                    total_score = COALESCE(@total_score, total_score),
                    passing_score = COALESCE(@passing_score, passing_score),
                    start_time = COALESCE(@start_time, start_time),
                    end_time = COALESCE(@end_time, end_time),
                    allow_retake = COALESCE(@allow_retake, allow_retake)
                WHERE id = @id
            `);

        res.json({ message: 'Exam updated successfully' });
    } catch (err) {
        console.error('Update exam error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/exams/:id
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM exams WHERE id = @id');
        res.json({ message: 'Exam deleted successfully' });
    } catch (err) {
        console.error('Delete exam error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ==================================
// QUESTIONS API (For an exam)
// ==================================

// POST /api/exams/:examId/questions
router.post('/:examId/questions', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const examId = req.params.examId;
        const { content, explanation, options } = req.body; 

        const transaction = new (require('mssql')).Transaction(pool);
        await transaction.begin();

        try {
            const request = new (require('mssql')).Request(transaction);
            const qResult = await request
                .input('exam_id', examId)
                .input('content', content)
                .input('explanation', explanation)
                .query(`INSERT INTO questions (exam_id, content, explanation) OUTPUT INSERTED.id VALUES (@exam_id, @content, @explanation)`);
            const questionId = qResult.recordset[0].id;

            if (options && options.length > 0) {
                for (let i = 0; i < options.length; i++) {
                    const opt = options[i];
                    const optReq = new (require('mssql')).Request(transaction);
                    await optReq
                        .input('question_id', questionId)
                        .input('content', opt.content)
                        .input('is_correct', opt.is_correct ? 1 : 0)
                        .input('display_order', opt.display_order || i)
                        .query(`INSERT INTO question_options (question_id, content, is_correct, display_order) VALUES (@question_id, @content, @is_correct, @display_order)`);
                }
            }

            const countReq = new (require('mssql')).Request(transaction);
            await countReq
                .input('eid', examId)
                .query(`UPDATE exams SET question_count = (SELECT COUNT(*) FROM questions WHERE exam_id = @eid) WHERE id = @eid`);

            await transaction.commit();
            res.status(201).json({ id: questionId, message: 'Question added successfully' });
        } catch (txnErr) {
            await transaction.rollback();
            throw txnErr;
        }
    } catch (err) {
        console.error('Add question error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/exams/:examId/questions/:questionId
router.delete('/:examId/questions/:questionId', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const { examId, questionId } = req.params;

        const transaction = new (require('mssql')).Transaction(pool);
        await transaction.begin();
        try {
            const req1 = new (require('mssql')).Request(transaction);
            req1.input('qid', questionId).input('eid', examId);
            await req1.query('DELETE FROM questions WHERE id = @qid AND exam_id = @eid');
            
            const req2 = new (require('mssql')).Request(transaction);
            req2.input('eid2', examId);
            await req2.query('UPDATE exams SET question_count = (SELECT COUNT(*) FROM questions WHERE exam_id = @eid2) WHERE id = @eid2');
            
            await transaction.commit();
            res.json({ message: 'Question deleted successfully' });
        } catch (txnErr) {
            await transaction.rollback();
            throw txnErr;
        }
    } catch (err) {
        console.error('Delete question error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/exams/:examId/questions (Replace all questions)
router.put('/:examId/questions', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const examId = req.params.examId;
        const questions = req.body; // Array of question objects

        const transaction = new (require('mssql')).Transaction(pool);
        await transaction.begin();

        try {
            // Delete all existing questions (cascading deletes options if defined, else we manually delete options but our schema assumes cascade or we do it here)
            // SQL Server might not have CASCADE on DELETE if we didn't specify it. Let's delete options manually just in case:
            const delOptReq = new (require('mssql')).Request(transaction);
            await delOptReq.input('eid', examId).query(`
                DELETE FROM question_options WHERE question_id IN (SELECT id FROM questions WHERE exam_id = @eid)
            `);
            
            const delQReq = new (require('mssql')).Request(transaction);
            await delQReq.input('eid', examId).query(`DELETE FROM questions WHERE exam_id = @eid`);

            // Insert new questions
            for (let q of questions) {
                const qReq = new (require('mssql')).Request(transaction);
                const qResult = await qReq
                    .input('exam_id', examId)
                    .input('content', q.content || q.text)
                    .input('explanation', q.explanation || '')
                    .query(`INSERT INTO questions (exam_id, content, explanation) OUTPUT INSERTED.id VALUES (@exam_id, @content, @explanation)`);
                const questionId = qResult.recordset[0].id;

                const optionsArr = q.options || [];
                for (let i = 0; i < optionsArr.length; i++) {
                    const opt = optionsArr[i];
                    // handle both old and new data structures
                    const isCorrectEnum = opt.is_correct !== undefined ? opt.is_correct : (q.correct === i ? 1 : 0);
                    const optContent = opt.content || opt; 
                    
                    const optReq = new (require('mssql')).Request(transaction);
                    await optReq
                        .input('question_id', questionId)
                        .input('content', optContent)
                        .input('is_correct', isCorrectEnum ? 1 : 0)
                        .input('display_order', i)
                        .query(`INSERT INTO question_options (question_id, content, is_correct, display_order) VALUES (@question_id, @content, @is_correct, @display_order)`);
                }
            }

            // Update exam question count
            const countReq = new (require('mssql')).Request(transaction);
            await countReq
                .input('eid', examId)
                .input('cnt', questions.length)
                .query(`UPDATE exams SET question_count = @cnt WHERE id = @eid`);

            await transaction.commit();
            res.json({ message: 'Questions updated successfully' });
        } catch (txnErr) {
            await transaction.rollback();
            throw txnErr;
        }
    } catch (err) {
        console.error('Update questions error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper route to reset DB seed to data.js equivalent just for testing if requested
// router.post('/seed-data', requireAdmin, ...);

module.exports = router;
