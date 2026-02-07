// FIX: Auth Microservice - Single responsibility: Authentication & JWT management
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.AUTH_PORT || 3001;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'chat',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'chat_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id, username, role FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        const user = rows[0];
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { firstname, lastname, username, email, password, role } = req.body;

    if (!firstname || !lastname || !username || !email || !password || !role) {
        return res.status(400).json({ 
            message: 'required firstname, lastname, username, email, password, role' 
        });
    }

    const roles = ['user', 'admin', 'moderator', 'guest'];
    if (!roles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        // Check if email exists
        const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (emailCheck.length > 0) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Check if username exists
        const [usernameCheck] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (usernameCheck.length > 0) {
            return res.status(409).json({ message: 'Username already in use' });
        }

        // Insert new user
        await pool.query(
            'INSERT INTO users (firstname, lastname, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [firstname, lastname, username, email, password, role]
        );

        res.json({ message: 'registered success' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Token validation endpoint (for other services)
app.post('/verify', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
});

app.listen(PORT, () => {
    console.log(`Auth service listening on port ${PORT}`);
});
