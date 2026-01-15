const express = require ('express');
const authRoutes = require ('./src/routes/authRoutes');
const env = require ('dotenv');
const config = require ('./src/config/config');
const friendsRoutes = require ('./src/routes/friendsRoutes');
const {Server} = require('socket.io');
const http = require ('http');
const chatRoutes = require("./src/routes/chatRoutes");
const profileRoutes = require("./src/routes/ProfileRoutes");
const cors = require ('cors');
const path = require ('path');

const { auth_mw_token } = require('./src/middlewares/auth_middlware');
const {setupSocket} = require('./src/sockets/socketSetup');

const app = express ();


app.use (cors({
    origin:'http://localhost:5173',
    credentials: true
}));

app.use (express.json ());
app.use (express.urlencoded ({extended: true}));

app.use ('/images', express.static (path.join (__dirname, 'data/images')));


app.use ('/api/auth', authRoutes);

app.use ('/api/friends', auth_mw_token , friendsRoutes);

app.use("/api/chat", auth_mw_token, chatRoutes);

app.use("/api/profile", auth_mw_token, profileRoutes);


app.get ('/', (req, res) => {
    res.send('hello from local host');
})


const server  = http.createServer(app);
const io = new Server (server, {
    cors: {origin : "http://localhost:5173", credentials: true}
});

setupSocket (io);

server.listen (config.port, () => {
    console.log ('app listenning on ',config.port);
});







