// Post Microservice - Posts, likes, comments management (Matching working backend)
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const promClient = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.POST_PORT || 3004;

const metricsRegister = new promClient.Registry();
promClient.collectDefaultMetrics({ register: metricsRegister, prefix: 'chatapp_post_' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'chat',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'chat_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to verify token (JWT or API Key)
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];

    // Try JWT first
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const response = await axios.post(`http://auth-service:3001/verify`, { token });
            req.user = response.data.user;
            return next();
        } catch (err) {
            if (!apiKey) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }
            // Fall through to API key check
        }
    }

    if (apiKey) {
        try {
            const crypto = require('crypto');
            const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
            const [rows] = await pool.query('SELECT user_id FROM api_keys WHERE key_hash = ?', [keyHash]);
            if (rows.length > 0) {
                req.user = { id: rows[0].user_id };
                return next();
            }
        } catch (err) {
            console.error('API key validation error:', err);
        }
        return res.status(401).json({ message: 'Invalid API key' });
    }

    return res.status(401).json({ 
        message: 'Authentication required. Provide Bearer token or X-API-Key header.' 
    });
}

// GET /posts - Get all public posts (NO AUTH REQUIRED)
app.get('/posts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const query = `
            SELECT p.*, u.username, u.avatar_url,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.visibility = 'public'
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?`;
        
        const [posts] = await pool.query(query, [limit, offset]);
        res.json({ posts });
    } catch (err) {
        console.error('Get all posts error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /posts/my - Get my posts (AUTH REQUIRED)
app.get('/posts/my', authMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const query = `
            SELECT p.*, u.username, u.avatar_url,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?`;
        
        const [posts] = await pool.query(query, [req.user.id, limit, offset]);
        res.json({ posts });
    } catch (err) {
        console.error('Get my posts error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /posts/:id - Get single post (AUTH REQUIRED)
app.get('/posts/:id', authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username, u.avatar_url,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?`;
        
        const [rows] = await pool.query(query, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ post: rows[0] });
    } catch (err) {
        console.error('Get post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /posts - Create post (AUTH REQUIRED)
app.post('/posts', authMiddleware, async (req, res) => {
    try {
        const { content, visibility = 'public' } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const [result] = await pool.query(
            'INSERT INTO posts (user_id, content, visibility) VALUES (?, ?, ?)',
            [req.user.id, content, visibility]
        );

        // Return the created post
        const [rows] = await pool.query(`
            SELECT p.*, u.username, u.avatar_url,
                (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as comment_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?`, [result.insertId]);

        res.json({ message: 'Post created', post: rows[0] });
    } catch (err) {
        console.error('Create post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT /posts/:id - Update post (AUTH REQUIRED, owner only)
app.put('/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const [result] = await pool.query(
            'UPDATE posts SET content = ? WHERE id = ? AND user_id = ?',
            [content, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or not authorized' });
        }

        res.json({ message: 'Post updated' });
    } catch (err) {
        console.error('Update post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE /posts/:id - Delete post (AUTH REQUIRED, owner only)
app.delete('/posts/:id', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM posts WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or not authorized' });
        }

        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /posts/:id/like - Like a post (AUTH REQUIRED)
app.post('/posts/:id/like', authMiddleware, async (req, res) => {
    try {
        await pool.query(
            'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
            [req.params.id, req.user.id]
        );

        res.json({ message: 'Post liked' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already liked' });
        }
        console.error('Like post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE /posts/:id/like - Unlike a post (AUTH REQUIRED)
app.delete('/posts/:id/like', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Like not found' });
        }

        res.json({ message: 'Post unliked' });
    } catch (err) {
        console.error('Unlike post error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /posts/:id/comments - Get post comments (NO AUTH REQUIRED)
app.get('/posts/:id/comments', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const query = `
            SELECT c.*, u.username, u.avatar_url
            FROM post_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
            LIMIT ? OFFSET ?`;
        
        const [comments] = await pool.query(query, [req.params.id, limit, offset]);
        res.json({ comments });
    } catch (err) {
        console.error('Get comments error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /posts/:id/comments - Add comment (AUTH REQUIRED)
app.post('/posts/:id/comments', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const [result] = await pool.query(
            'INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [req.params.id, req.user.id, content]
        );

        res.json({ message: 'Comment added', commentId: result.insertId });
    } catch (err) {
        console.error('Add comment error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE /posts/comments/:commentId - Delete comment (AUTH REQUIRED, owner only)
app.delete('/posts/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM post_comments WHERE id = ? AND user_id = ?',
            [req.params.commentId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found or not authorized' });
        }

        res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Health check
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'post-service' });
});

app.listen(PORT, () => {
    console.log(`Post service listening on port ${PORT}`);
});
