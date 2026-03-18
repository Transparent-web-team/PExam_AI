const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDbConnection } = require('../db/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/users
router.get('/', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request().query('SELECT id, username, name, email, student_id, role, class_name, avatar FROM users');
        res.json(result.recordset);
    } catch (err) {
        console.error('Fetch users error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const pool = await getDbConnection();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT id, username, name, email, student_id, role, class_name, avatar FROM users WHERE id = @id');
            
        const user = result.recordset[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Fetch user error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/users
router.post('/', async (req, res) => {
    try {
        const { username, password, name, email, studentId, role, className, avatar } = req.body;
        
        if (!username || !password || !name) {
            return res.status(400).json({ message: 'Username, password and name are required' });
        }

        const pool = await getDbConnection();
        const passwordHash = await bcrypt.hash(password, 10);
        
        const result = await pool.request()
            .input('username', username)
            .input('password_hash', passwordHash)
            .input('name', name)
            .input('email', email || '')
            .input('student_id', studentId || null)
            .input('role', role || 'student')
            .input('class_name', className || null)
            .input('avatar', avatar || 'NA')
            .query(`INSERT INTO users (username, password_hash, name, email, student_id, role, class_name, avatar) 
                    OUTPUT INSERTED.id 
                    VALUES (@username, @password_hash, @name, @email, @student_id, @role, @class_name, @avatar)`);
        
        res.status(201).json({ id: result.recordset[0].id, message: 'User created successfully' });
    } catch (err) {
        console.error('Create user error:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Username, email, or student ID already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const { username, password, name, email, studentId, role, className, avatar } = req.body;
        const pool = await getDbConnection();

        // Check user exists
        const userResult = await pool.request()
            .input('uid', req.params.id)
            .query('SELECT * FROM users WHERE id = @uid');
        const user = userResult.recordset[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = [];
        const valsObj = [];

        if (username) { updates.push('username = @u_username'); valsObj.push({key: 'u_username', val: username}); }
        if (name) { updates.push('name = @u_name'); valsObj.push({key: 'u_name', val: name}); }
        if (email) { updates.push('email = @u_email'); valsObj.push({key: 'u_email', val: email}); }
        if (studentId !== undefined) { updates.push('student_id = @u_student_id'); valsObj.push({key: 'u_student_id', val: studentId}); }
        if (role) { updates.push('role = @u_role'); valsObj.push({key: 'u_role', val: role}); }
        if (className !== undefined) { updates.push('class_name = @u_class_name'); valsObj.push({key: 'u_class_name', val: className}); }
        if (avatar) { updates.push('avatar = @u_avatar'); valsObj.push({key: 'u_avatar', val: avatar}); }
        
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            updates.push('password_hash = @u_password_hash');
            valsObj.push({key: 'u_password_hash', val: hash});
        }

        if (updates.length > 0) {
            const request = pool.request();
            request.input('uid2', req.params.id);
            for (let i = 0; i < valsObj.length; i++) {
                request.input(valsObj[i].key, valsObj[i].val);
            }
            await request.query(`UPDATE users SET ${updates.join(', ')} WHERE id = @uid2`);
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        if (req.user.id.toString() === req.params.id) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        const pool = await getDbConnection();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM users WHERE id = @id');
        
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
