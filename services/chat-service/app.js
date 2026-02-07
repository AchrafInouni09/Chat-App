// Chat Microservice - Conversations, messages, Socket.io (Matching working backend)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost', 'https://localhost'],
        credentials: true
    }
});

const PORT = process.env.CHAT_PORT || 3003;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost', 'https://localhost'],
    credentials: true
}));
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
async function authMiddleware(req, res, next) {
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

// GET /conversations - List my conversations
app.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const query = `
            SELECT c.id, c.type, c.created_at,
            CASE 
                WHEN c.type = 'group' THEN c.name
                ELSE (
                    SELECT u.username 
                    FROM conversation_participants cp2 
                    JOIN users u ON u.id = cp2.user_id 
                    WHERE cp2.conversation_id = c.id AND cp2.user_id != ? 
                    LIMIT 1
                )
            END as name,
            CASE 
                WHEN c.type = 'direct' THEN (
                    SELECT u.avatar_url 
                    FROM conversation_participants cp2 
                    JOIN users u ON u.id = cp2.user_id 
                    WHERE cp2.conversation_id = c.id AND cp2.user_id != ? 
                    LIMIT 1
                )
                ELSE NULL
            END as avatar_url
            FROM conversations c
            JOIN conversation_participants cp ON cp.conversation_id = c.id
            WHERE cp.user_id = ?
            ORDER BY c.created_at DESC`;
        
        const [conversations] = await pool.query(query, [req.user.id, req.user.id, req.user.id]);
        res.json({ conversations });
    } catch (err) {
        console.error('List conversations error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /conversation/direct - Get or create direct conversation
app.post('/conversation/direct', authMiddleware, async (req, res) => {
    try {
        let { username, participantId } = req.body;

        // Support both username and participantId
        let otherId;
        
        if (participantId) {
            otherId = parseInt(participantId);
        } else if (username) {
            // Get other user ID by username
            const [users] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
            if (users.length === 0) {
                return res.status(400).json({ message: 'User not found' });
            }
            otherId = users[0].id;
        } else {
            return res.status(400).json({ message: 'username or participantId is required' });
        }

        if (otherId == req.user.id) {
            return res.status(400).json({ message: 'Cannot start a chat with yourself' });
        }

        // Find existing direct conversation
        const findConv = `
            SELECT c.id FROM conversations c WHERE c.type = 'direct'
            AND (SELECT COUNT(*) FROM conversation_participants cp WHERE cp.conversation_id = c.id) = 2
            AND EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = ?)
            AND EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = c.id AND cp.user_id = ?)
            LIMIT 1`;

        const [found] = await pool.query(findConv, [req.user.id, otherId]);

        if (found.length > 0) {
            return res.json({ conversation: { id: found[0].id } });
        }

        // Create new conversation
        const [result] = await pool.query(`INSERT INTO conversations (type) VALUES ('direct')`, []);
        const convId = result.insertId;

        // Add participants
        await pool.query(
            `INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)`,
            [convId, req.user.id, convId, otherId]
        );

        res.json({ conversation: { id: convId } });
    } catch (err) {
        console.error('Direct conversation error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET /conversations/:id/messages - List messages in a conversation
app.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
    try {
        const conversationId = parseInt(req.params.id);

        if (!conversationId) {
            return res.status(400).json({ message: 'invalid conversation id' });
        }

        // Check if user is participant
        const [participantCheck] = await pool.query(
            'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ? LIMIT 1',
            [conversationId, req.user.id]
        );

        if (participantCheck.length === 0) {
            return res.status(403).json({ message: 'not a participant' });
        }

        // Get messages
        const query = `
            SELECT m.id, m.conversation_id, m.sender_id, m.content, m.created_at, 
                   u.username as sender_username, u.avatar_url
            FROM messages m 
            JOIN users u ON u.id = m.sender_id 
            WHERE m.conversation_id = ? 
            ORDER BY m.created_at DESC 
            LIMIT 50`;

        const [messages] = await pool.query(query, [conversationId]);
        res.json({ messages: messages.reverse() }); // Reverse to show oldest first
    } catch (err) {
        console.error('List messages error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /groups - Create a group conversation
app.post('/groups', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ Message: 'group name is required' });
        }

        // Create group conversation
        const [result] = await pool.query(
            `INSERT INTO conversations (type, name) VALUES ('group', ?)`,
            [name]
        );
        const convId = result.insertId;

        // Add creator as participant
        await pool.query(
            `INSERT IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)`,
            [convId, req.user.id]
        );

        res.json({ group: { id: convId, name, type: 'group' } });
    } catch (err) {
        console.error('Create group error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /groups - List all groups
app.get('/groups', authMiddleware, async (req, res) => {
    try {
        const [groups] = await pool.query(
            `SELECT id, name, type, created_at FROM conversations WHERE type = 'group' ORDER BY created_at DESC`
        );

        res.json({ groups });
    } catch (err) {
        console.error('List groups error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /groups/:id/join - Join a group
app.post('/groups/:id/join', authMiddleware, async (req, res) => {
    try {
        const groupId = parseInt(req.params.id);

        await pool.query(
            `INSERT IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)`,
            [groupId, req.user.id]
        );

        res.json({ message: 'Joined successfully' });
    } catch (err) {
        console.error('Join group error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Socket.io setup
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('token missing'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('invalid or expired token'));
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.user.username, socket.id);

    // Join conversation room
    socket.on('conversation:join', async ({ conversationId }) => {
        if (!conversationId) return;

        try {
            // Check if user is participant
            const [rows] = await pool.query(
                'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ? LIMIT 1',
                [conversationId, socket.user.id]
            );

            if (rows.length === 0) return;

            socket.join(`conversation_${conversationId}`);
            console.log(`${socket.user.username} joined conversation_${conversationId}`);
        } catch (err) {
            console.error('Join conversation error:', err);
        }
    });

    // Send message
    socket.on('message:send', async ({ conversationId, content }) => {
        if (!conversationId || !content) return;

        try {
            // Check if user is participant
            const [rows] = await pool.query(
                'SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ? LIMIT 1',
                [conversationId, socket.user.id]
            );

            if (rows.length === 0) return;

            // Create message
            const [result] = await pool.query(
                'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
                [conversationId, socket.user.id, content]
            );

            // Get full message with user info
            const [messages] = await pool.query(
                `SELECT m.id, m.conversation_id, m.sender_id, m.content, m.created_at, 
                        u.username as sender_username, u.avatar_url
                 FROM messages m 
                 JOIN users u ON u.id = m.sender_id 
                 WHERE m.id = ? LIMIT 1`,
                [result.insertId]
            );

            const fullMessage = messages[0];

            // Emit to conversation room
            io.to(`conversation_${conversationId}`).emit('message:new', fullMessage);
        } catch (err) {
            console.error('Send message error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user.username);
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'chat-service' });
});

server.listen(PORT, () => {
    console.log(`Chat service with Socket.io listening on port ${PORT}`);
});
