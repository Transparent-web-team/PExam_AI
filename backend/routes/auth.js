const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDbConnection } = require('../db/database');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const pool = await getDbConnection();
        const userResult = await pool.request()
            .input('username', username)
            .query('SELECT * FROM users WHERE username = @username');
            
        const user = userResult.recordset[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove sensitive info before sending
        delete user.password_hash;

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const pool = await getDbConnection();
        const userResult = await pool.request()
            .input('id', req.user.id)
            .query('SELECT id, username, name, email, student_id, role, class_name, avatar FROM users WHERE id = @id');
        
        const user = userResult.recordset[0];
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('Fetch me error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name, role } = req.body;
        
        if (!username || !password || !name) {
            return res.status(400).json({ message: 'Username, password and name are required' });
        }

        const pool = await getDbConnection();
        const passwordHash = await bcrypt.hash(password, 10);
        
        const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        // Tạo student_id ngẫu nhiên nếu không có để tránh lỗi UNIQUE CONSTRAINT NULL 
        // (vì admin mặc định đã dùng 1 NULL)
        const generatedStudentId = `SV${Date.now()}${Math.floor(Math.random()*1000)}`;

        const result = await pool.request()
            .input('username', username)
            .input('password_hash', passwordHash)
            .input('name', name)
            .input('email', email || '')
            .input('role', role || 'student')
            .input('student_id', generatedStudentId)
            .input('avatar', avatar)
            .query(`INSERT INTO users (username, password_hash, name, email, role, avatar, student_id) 
                    OUTPUT INSERTED.id 
                    VALUES (@username, @password_hash, @name, @email, @role, @avatar, @student_id)`);
        
        res.status(201).json({ id: result.recordset[0].id, message: 'User registered successfully' });
    } catch (err) {
        console.error('Register error:', err);
        if (err.message && err.message.includes('UNIQUE')) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
