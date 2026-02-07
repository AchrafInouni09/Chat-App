// FIX: User Microservice - Single responsibility: User profile management
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.USER_PORT || 3002;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'chat',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'chat_app',
    waitForConnections: true,
    connectionLimit: 10
});

// Middleware to verify token with auth-service
async function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const response = await axios.post(`http://auth-service:3001/verify`, { token });
        req.user = response.data.user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// Get user profile
app.get('/profile/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, firstname, lastname, username, email, avatar, role FROM users WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user profile
app.put('/profile/:id', verifyToken, upload.single('avatar'), async (req, res) => {
    if (req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { firstname, lastname, email } = req.body;
    const avatar = req.file ? req.file.filename : null;

    try {
        const updates = [];
        const values = [];

        if (firstname) { updates.push('firstname = ?'); values.push(firstname); }
        if (lastname) { updates.push('lastname = ?'); values.push(lastname); }
        if (email) { updates.push('email = ?'); values.push(email); }
        if (avatar) { updates.push('avatar = ?'); values.push(avatar); }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        values.push(req.params.id);
        await pool.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Profile updated' });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// List all users
app.get('/users', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, firstname, lastname, avatar, role FROM users'
        );
        res.json(rows);
    } catch (err) {
        console.error('List users error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
});

app.listen(PORT, () => {
    console.log(`User service listening on port ${PORT}`);
});
