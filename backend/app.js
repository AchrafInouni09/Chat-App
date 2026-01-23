const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const env = require('dotenv');
const config = require('./src/config/config');
const friendsRoutes = require('./src/routes/friendsRoutes');
const { Server } = require('socket.io');
const http = require('http');
const chatRoutes = require("./src/routes/chatRoutes");
const profileRoutes = require("./src/routes/ProfileRoutes");
const cors = require('cors');
const path = require('path');
const PostsRoutes = require('./src/routes/PostsRoutes');
const UsersRoutes = require('./src/routes/UsersRoutes');
const indexRoutes = require('./src/routes/index');

const { auth_mw_token, Priority_login_mw } = require('./src/middlewares/auth_middlware');
const { setupSocket } = require('./src/sockets/socketSetup');

const apiKeyRoutes = require('./src/routes/ApiKeysRoutes');

const app = express();

app.set('trust proxy', true);


app.use(cors({
    origin: ['http://localhost:5173', 'https://localhost'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(process.cwd(), 'data/images')));

app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', PostsRoutes);

app.use('/api/friends', auth_mw_token, friendsRoutes);

app.use("/api/chat", auth_mw_token, chatRoutes);

app.use("/api/profile", auth_mw_token, profileRoutes);

app.use("/api/keys", auth_mw_token, apiKeyRoutes);

app.use('/api/users', Priority_login_mw, UsersRoutes);

app.get('/', (req, res) => {
    res.send('hello from local host');
})


const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ["http://localhost:5173", "https://localhost"], credentials: true }
});

setupSocket(io);

server.listen(config.port, () => {
    console.log('app listenning on ', config.port);
});







