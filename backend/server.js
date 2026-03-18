const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./db/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Initialize DB and Start Server
async function startServer() {
    try {
        await initDb();
        console.log('Database initialized successfully.');

        // Simple route
        app.get('/', (req, res) => {
            res.json({ message: 'Welcome to PExam API' });
        });

        // Setup routes
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/users', require('./routes/users'));
        app.use('/api/exams', require('./routes/exams'));
        app.use('/api/results', require('./routes/results'));

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();
