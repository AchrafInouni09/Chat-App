// User Microservice - User profile management (Matching working backend)
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.USER_PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'chat',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'chat_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to verify token with auth-service
async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const response = await axios.post(`http://auth-service:3001/verify`, { token });
        req.user = response.data.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// GET /profile/me - Get my profile
app.get('/profile/me', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, first_name, last_name, username, email, avatar_url, bio, role, created_at, updated_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: rows[0] });
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT /profile/me - Update my profile (with avatar support)
app.put('/profile/me', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const allowed = ['first_name', 'last_name', 'email', 'avatar_url', 'bio', 'password'];
        const updatePayload = {};

        // Build update payload from body
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                updatePayload[key] = req.body[key];
            }
        }

        // Add avatar if uploaded
        if (req.file) {
            updatePayload.avatar_url = req.file.filename;
        }

        const keys = Object.keys(updatePayload);
        if (keys.length === 0) {
            return res.status(400).json({ message: 'no updatable fields provided' });
        }

        // Check email uniqueness if email is being updated
        if (updatePayload.email) {
            const [emailCheck] = await pool.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [updatePayload.email, req.user.id]
            );
            if (emailCheck.length > 0) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        // Build SET clause
        const setParts = [];
        const params = [];

        for (const k of keys) {
            if (k === 'password') {
                setParts.push('password_hash = ?');
                params.push(String(updatePayload.password));
            } else {
                setParts.push(`${k} = ?`);
                params.push(updatePayload[k]);
            }
        }

        params.push(req.user.id);

        await pool.query(
            `UPDATE users SET ${setParts.join(', ')} WHERE id = ?`,
            params
        );

        // Return updated user
        const [rows] = await pool.query(
            'SELECT id, first_name, last_name, username, email, avatar_url, bio, role, created_at, updated_at FROM users WHERE id = ?',
            [req.user.id]
        );

        res.json({ message: 'Profile updated', user: rows[0] });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE /profile/me - Delete my profile
app.delete('/profile/me', verifyToken, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Delete profile error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /search?q=term - Search users
app.get('/search', verifyToken, async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        const likeTerm = `%${searchTerm}%`;

        const [rows] = await pool.query(
            `SELECT id, username, first_name, last_name, avatar_url, bio 
             FROM users 
             WHERE (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?) 
             AND id != ?
             LIMIT 20`,
            [likeTerm, likeTerm, likeTerm, req.user.id]
        );

        res.json(rows);
    } catch (err) {
        console.error('Search users error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Health check
// API Keys endpoints (stub - returns empty for now)
app.get('/keys', verifyToken, (req, res) => {
    res.json({ apiKeys: [] });
});

app.post('/keys', verifyToken, (req, res) => {
    res.status(501).json({ message: 'API keys feature not yet implemented in microservices' });
});

app.delete('/keys/:id', verifyToken, (req, res) => {
    res.status(501).json({ message: 'API keys feature not yet implemented in microservices' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
});

app.listen(PORT, () => {
    console.log(`User service listening on port ${PORT}`);
});
