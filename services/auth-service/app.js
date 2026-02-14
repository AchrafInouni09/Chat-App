// FIX: Auth Microservice - Single responsibility: Authentication & JWT management
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const promClient = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.AUTH_PORT || 3001;

// Prometheus metrics
const metricsRegister = new promClient.Registry();
promClient.collectDefaultMetrics({ register: metricsRegister, prefix: 'chatapp_auth_' });

app.use(cors());
app.use(express.json());
// Serve uploaded avatars
app.use('/images', express.static('uploads'));

// File upload configuration for avatar
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
const upload = multer({ storage });

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
            'SELECT id, username, role FROM users WHERE username = ? AND password_hash = ?',
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

// Get salt endpoint for login
app.post('/get-salt', async (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ message: 'username is required' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT password_salt FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            // Return a fake salt to prevent username enumeration
            return res.json({ salt: '$2a$10$' + 'x'.repeat(22) });
        }

        res.json({ salt: rows[0].password_salt });
    } catch (err) {
        console.error('Get salt error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Register endpoint with avatar support
app.post('/register', upload.single('avatar'), async (req, res) => {
    // Support both field name formats
    const firstname = req.body.firstname || req.body.first_name;
    const lastname = req.body.lastname || req.body.last_name;
    const { username, email, password, role } = req.body || {};

    if (!firstname || !lastname || !username || !email || !password || !role) {
        return res.status(400).json({ 
            message: 'required firstname, lastname, username, email, password, role' 
        });
    }

    const roles = ['user', 'admin', 'moderator', 'guest'];
    if (!roles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
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

        // Check if first name and last name combination exists
        const [nameCheck] = await pool.query('SELECT id FROM users WHERE first_name = ? AND last_name = ?', [firstname, lastname]);
        if (nameCheck.length > 0) {
            return res.status(409).json({ message: 'User with the same first name and last name already exists' });
        }

        // Handle avatar - store filename only (like original backend)
        const avatarUrl = req.file ? req.file.filename : null;

        // Extract salt from bcrypt hash (format: $2a$10$<22-char-salt><31-char-hash>)
        const passwordSalt = password.substring(0, 29);

        // Insert new user with avatar and salt
        const [result] = await pool.query(
            'INSERT INTO users (first_name, last_name, username, email, password_hash, password_salt, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstname, lastname, username, email, password, passwordSalt, role, avatarUrl]
        );

        // Fetch and return the created user
        const [newUsers] = await pool.query(
            'SELECT id, username, email, first_name, last_name, role, avatar_url, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        const token = jwt.sign(
            { id: newUsers[0].id, username: newUsers[0].username, role: newUsers[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'registerd success',
            token,
            user: newUsers[0]
        });
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
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'auth-service' });
});

app.listen(PORT, () => {
    console.log(`Auth service listening on port ${PORT}`);
});
