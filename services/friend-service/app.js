// Friend Microservice - Friend relationships management (Matching working backend)
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.FRIEND_PORT || 3005;

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

// Middleware to verify token
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

// GET /friends/list - List accepted friends
app.get('/friends/list', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.username, u.first_name, u.last_name, u.avatar_url, u.bio 
            FROM users u 
            JOIN friendships f ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
            WHERE (f.user_id_1 = ? OR f.user_id_2 = ?) 
            AND f.status = 'accepted' 
            AND u.id != ?`;
        
        const [friends] = await pool.query(query, [req.user.id, req.user.id, req.user.id]);
        res.json({ friends });
    } catch (err) {
        console.error('List friends error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /friends/pending - List incoming pending requests
app.get('/friends/pending', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.username, u.first_name, u.last_name, u.avatar_url, u.bio 
            FROM users u
            JOIN friendships f ON u.id = f.user_id_1 
            WHERE f.user_id_2 = ? AND f.status = 'pending'`;
        
        const [pendingrequest] = await pool.query(query, [req.user.id]);
        res.json({ pendingrequest });
    } catch (err) {
        console.error('List pending error:', err);
        res.status(400).json({ message: err.message });
    }
});

// GET /friends/sent - List outgoing pending requests
app.get('/friends/sent', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.username, u.first_name, u.last_name, u.avatar_url, u.bio 
            FROM users u
            JOIN friendships f ON u.id = f.user_id_2 
            WHERE f.user_id_1 = ? AND f.status = 'pending'`;
        
        const [sentRequests] = await pool.query(query, [req.user.id]);
        res.json({ sentRequests });
    } catch (err) {
        console.error('List sent requests error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /friends/search?q=term - Search users
app.get('/friends/search', verifyToken, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.json({ users: [] });
        }

        const likeTerm = `%${q.trim()}%`;
        const query = `
            SELECT id, username, first_name, last_name, avatar_url, bio 
            FROM users 
            WHERE (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?) 
            AND id != ?
            LIMIT 20`;
        
        const [users] = await pool.query(query, [likeTerm, likeTerm, likeTerm, req.user.id]);
        res.json({ users });
    } catch (err) {
        console.error('Search users error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /friends/request - Send friend request
app.post('/friends/request', verifyToken, async (req, res) => {
    try {
        const senderId = req.user.id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'reciever username is required' });
        }

        // Get receiver ID
        const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            throw new Error('Receiver User not found');
        }

        const receiverId = users[0].id;

        if (senderId === receiverId) {
            throw new Error('cannot add yourself');
        }

        // Check existing relationship
        const checkQuery = `
            SELECT * FROM friendships 
            WHERE (user_id_1 = ? AND user_id_2 = ?) 
            OR (user_id_1 = ? AND user_id_2 = ?)`;
        
        const [existingRel] = await pool.query(checkQuery, [senderId, receiverId, receiverId, senderId]);
        
        if (existingRel.length > 0) {
            const rel = existingRel[0];
            if (rel.status === 'accepted') throw new Error('already friends');
            if (rel.status === 'blocked') throw new Error('cannot add blocked friend');
            if (rel.status === 'pending') {
                if (rel.user_id_1 == senderId) throw new Error('request already sent');
                else throw new Error('this user already sent you request');
            }
        }

        // Insert friend request
        await pool.query(
            'INSERT INTO friendships (user_id_1, user_id_2, status) VALUES (?, ?, ?)',
            [senderId, receiverId, 'pending']
        );

        res.json({ message: 'Friend request sent' });
    } catch (err) {
        console.error('Send friend request error:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /friends/accept - Accept friend request
app.put('/friends/accept', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'username is required' });
        }

        // Get requester ID
        const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            throw new Error('user not found');
        }

        const requesterId = users[0].id;

        // Update status to accepted
        const [result] = await pool.query(
            'UPDATE friendships SET status = ? WHERE user_id_1 = ? AND user_id_2 = ? AND status = ?',
            ['accepted', requesterId, userId, 'pending']
        );

        if (result.affectedRows === 0) {
            throw new Error('no pending request found');
        }

        res.json({ message: 'Friend request accepted' });
    } catch (err) {
        console.error('Accept friend error:', err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE /friends/reject - Reject friend request
app.delete('/friends/reject', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'username is required' });
        }

        // Get requester ID
        const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            throw new Error('user not found');
        }

        const requesterId = users[0].id;

        // Delete pending request
        const [result] = await pool.query(
            'DELETE FROM friendships WHERE user_id_1 = ? AND user_id_2 = ? AND status = ?',
            [requesterId, userId, 'pending']
        );

        if (result.affectedRows === 0) {
            throw new Error('no pending request found');
        }

        res.json({ message: 'Friend request rejected' });
    } catch (err) {
        console.error('Reject friend error:', err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE /friends/remove - Remove friend
app.delete('/friends/remove', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'username is required' });
        }

        // Get friend ID
        const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            throw new Error('friend not found');
        }

        const friendId = users[0].id;

        // Delete friendship (bidirectional)
        await pool.query(
            'DELETE FROM friendships WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)',
            [userId, friendId, friendId, userId]
        );

        res.json({ message: 'Friend removed' });
    } catch (err) {
        console.error('Remove friend error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'friend-service' });
});

app.listen(PORT, () => {
    console.log(`Friend service listening on port ${PORT}`);
});
