// FIX: Post Microservice - Single responsibility: Posts and content management
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.POST_PORT || 3004;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads'));

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

// Create post
app.post('/posts', verifyToken, upload.single('image'), async (req, res) => {
    const { content } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const [result] = await pool.query(
            'INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)',
            [req.user.id, content, image]
        );
        res.json({ message: 'Post created', postId: result.insertId });
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Get posts error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get user posts
app.get('/posts/user/:userId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.userId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Get user posts error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete post
app.delete('/posts/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (rows[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'post-service' });
});

app.listen(PORT, () => {
    console.log(`Post service listening on port ${PORT}`);
});
