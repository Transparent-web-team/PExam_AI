const express = require('express');
const router = express.Router();
const { getDbConnection } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);

// POST /api/results/submit
// body: { examId, answers: [{ questionId, selectedOptionId }], duration: 120 }
router.post('/submit', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const userId = req.user.id;
        const { examId, answers, duration } = req.body;

        if (!examId || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Invalid payload' });
        }

        const examResultObj = await pool.request()
            .input('eid', examId)
            .query('SELECT * FROM exams WHERE id = @eid');
        const exam = examResultObj.recordset[0];
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Calculate score
        let correctAnswers = 0;
        const totalQuestions = exam.question_count || answers.length;

        // Fetch all correct options for this exam to compare
        const correctOptionsResult = await pool.request()
            .input('eid2', examId)
            .query(`SELECT q.id as question_id, qo.id as option_id 
             FROM questions q 
             JOIN question_options qo ON q.id = qo.question_id 
             WHERE q.exam_id = @eid2 AND qo.is_correct = 1`);
        const correctOptions = correctOptionsResult.recordset;

        const correctMap = {};
        correctOptions.forEach(co => {
            correctMap[co.question_id] = co.option_id;
        });

        for (const ans of answers) {
            if (correctMap[ans.questionId] === ans.selectedOptionId) {
                correctAnswers++;
            }
        }

        const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * exam.total_score : 0;

        const transaction = new (require('mssql')).Transaction(pool);
        await transaction.begin();

        try {
            const reqCreateRes = new (require('mssql')).Request(transaction);
            const rResult = await reqCreateRes
                .input('user_id', userId)
                .input('exam_id', examId)
                .input('score', score)
                .input('correct_answers', correctAnswers)
                .input('total_questions', totalQuestions)
                .input('duration', duration || null)
                .query(`INSERT INTO exam_results (user_id, exam_id, score, correct_answers, total_questions, duration) 
                    OUTPUT INSERTED.id 
                    VALUES (@user_id, @exam_id, @score, @correct_answers, @total_questions, @duration)`);
            
            const resultId = rResult.recordset[0].id;

            // Save individual answers
            for (const ans of answers) {
                const reqAns = new (require('mssql')).Request(transaction);
                await reqAns
                    .input('result_id', resultId)
                    .input('question_id', ans.questionId)
                    .input('selected_option_id', ans.selectedOptionId || null)
                    .query(`INSERT INTO student_answers (result_id, question_id, selected_option_id) 
                            VALUES (@result_id, @question_id, @selected_option_id)`);
            }

            await transaction.commit();

            res.status(201).json({ 
                message: 'Exam submitted successfully',
                result: { id: resultId, score, correctAnswers, totalQuestions, examTotalScore: exam.total_score }
            });
        } catch(txErr) {
            await transaction.rollback();
            throw txErr;
        }

    } catch (err) {
        console.error('Submit result error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/results/my-results
router.get('/my-results', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const userId = req.user.id;

        const results = await pool.request()
            .input('uid', userId)
            .query(`
                SELECT r.*, e.title as exam_title, e.subject, e.total_score as exam_total_score 
                FROM exam_results r 
                JOIN exams e ON r.exam_id = e.id 
                WHERE r.user_id = @uid 
                ORDER BY r.submit_time DESC
            `);

        res.json(results.recordset);
    } catch (err) {
        console.error('Fetch my results error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/results/exam-result/:examId  — get own result for a specific exam (with answers)
router.get('/exam-result/:examId', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const userId = req.user.id;
        const examId = req.params.examId;

        // Get result record
        const resultRes = await pool.request()
            .input('uid', userId)
            .input('eid', examId)
            .query(`SELECT TOP 1 r.*, e.total_score as exam_total_score, e.passing_score, e.title as exam_title
                    FROM exam_results r
                    JOIN exams e ON r.exam_id = e.id
                    WHERE r.user_id = @uid AND r.exam_id = @eid
                    ORDER BY r.submit_time DESC`);

        if (resultRes.recordset.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }

        const result = resultRes.recordset[0];

        // Get individual answers with question_id and selected_option_id
        const answersRes = await pool.request()
            .input('rid', result.id)
            .query(`SELECT sa.question_id, sa.selected_option_id,
                        qo.display_order as selected_option_order,
                        q.content as question_content
                    FROM student_answers sa
                    JOIN questions q ON sa.question_id = q.id
                    LEFT JOIN question_options qo ON sa.selected_option_id = qo.id
                    WHERE sa.result_id = @rid
                    ORDER BY sa.question_id`);

        result.studentAnswers = answersRes.recordset;
        res.json(result);
    } catch (err) {
        console.error('Fetch exam result error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET /api/results/exam/:examId (Admin only)
router.get('/exam/:examId', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const examId = req.params.examId;

        const results = await pool.request()
            .input('eid', examId)
            .query(`
                SELECT r.*, u.username, u.name, u.student_id, u.class_name 
                FROM exam_results r 
                JOIN users u ON r.user_id = u.id 
                WHERE r.exam_id = @eid 
                ORDER BY r.submit_time DESC
            `);

        res.json(results.recordset);
    } catch (err) {
        console.error('Fetch exam results error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/results (Admin only) - get all results across system
router.get('/', requireAdmin, async (req, res) => {
    try {
        const pool = await getDbConnection();

        const results = await pool.request()
            .query(`
                SELECT r.*, e.title as exam_title, e.subject, u.username, u.name as user_name 
                FROM exam_results r 
                JOIN exams e ON r.exam_id = e.id 
                JOIN users u ON r.user_id = u.id
                ORDER BY r.submit_time DESC
            `);

        res.json(results.recordset);
    } catch (err) {
        console.error('Fetch all results error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
