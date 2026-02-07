// FIX: Chat Microservice - Single responsibility: Real-time messaging
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', credentials: true }
});

const PORT = process.env.CHAT_PORT || 3003;

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

// Middleware to verify token
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

// Get conversations
app.get('/conversations', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM conversations WHERE user1_id = ? OR user2_id = ?',
            [req.user.id, req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error('Conversations error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get messages
app.get('/messages/:conversationId', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
            [req.params.conversationId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Messages error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-conversation', (conversationId) => {
        socket.join(`conversation-${conversationId}`);
    });

    socket.on('send-message', async (data) => {
        const { conversationId, senderId, content } = data;
        
        try {
            const [result] = await pool.query(
                'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
                [conversationId, senderId, content]
            );

            const message = {
                id: result.insertId,
                conversation_id: conversationId,
                sender_id: senderId,
                content,
                created_at: new Date()
            };

            io.to(`conversation-${conversationId}`).emit('new-message', message);
        } catch (err) {
            console.error('Send message error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'chat-service' });
});

server.listen(PORT, () => {
    console.log(`Chat service listening on port ${PORT}`);
});
