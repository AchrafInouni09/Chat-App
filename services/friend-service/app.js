// FIX: Friend Microservice - Single responsibility: Friend relationships management
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.FRIEND_PORT || 3005;

app.use(cors());
app.use(express.json());

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

// Send friend request
app.post('/requests', verifyToken, async (req, res) => {
    const { receiverId } = req.body;

    if (!receiverId) {
        return res.status(400).json({ message: 'receiverId required' });
    }

    try {
        await pool.query(
            'INSERT INTO friendships (sender_id, receiver_id, status) VALUES (?, ?, ?)',
            [req.user.id, receiverId, 'pending']
        );
        res.json({ message: 'Friend request sent' });
    } catch (err) {
        console.error('Send request error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get friend requests
app.get('/requests', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT f.*, u.username, u.avatar FROM friendships f 
             JOIN users u ON f.sender_id = u.id 
             WHERE f.receiver_id = ? AND f.status = 'pending'`,
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Get requests error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Accept friend request
app.put('/requests/:id/accept', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT receiver_id FROM friendships WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (rows[0].receiver_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await pool.query(
            'UPDATE friendships SET status = ? WHERE id = ?',
            ['accepted', req.params.id]
        );
        res.json({ message: 'Friend request accepted' });
    } catch (err) {
        console.error('Accept request error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get friends list
app.get('/friends', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT u.id, u.username, u.avatar FROM friendships f
             JOIN users u ON (f.sender_id = u.id OR f.receiver_id = u.id)
             WHERE (f.sender_id = ? OR f.receiver_id = ?) 
             AND f.status = 'accepted' AND u.id != ?`,
            [req.user.id, req.user.id, req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Get friends error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Remove friend
app.delete('/friends/:friendId', verifyToken, async (req, res) => {
    try {
        await pool.query(
            `DELETE FROM friendships 
             WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
             AND status = 'accepted'`,
            [req.user.id, req.params.friendId, req.params.friendId, req.user.id]
        );
        res.json({ message: 'Friend removed' });
    } catch (err) {
        console.error('Remove friend error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'friend-service' });
});

app.listen(PORT, () => {
    console.log(`Friend service listening on port ${PORT}`);
});
