const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const client = require('prom-client');

const authRoutes = require('./src/routes/authRoutes');
const friendsRoutes = require('./src/routes/friendsRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const profileRoutes = require('./src/routes/ProfileRoutes');
const config = require('./src/config/config');
const { auth_mw_token } = require('./src/middlewares/auth_middlware');
const { setupSocket } = require('./src/sockets/socketSetup');

/* ------------------ APP FIRST ------------------ */
const app = express();
console.log("Registering /metrics route");

/* ------------------ PROMETHEUS ------------------ */
/* ------------------ PROMETHEUS ------------------ */
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_requests_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5]
});

register.registerMetric(httpRequestDuration);

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });

  next();
});


app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

/* ------------------ MIDDLEWARE ------------------ */
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'data/images')));

/* ------------------ ROUTES ------------------ */
app.use('/api/auth', authRoutes);
app.use('/api/friends', auth_mw_token, friendsRoutes);
app.use('/api/chat', auth_mw_token, chatRoutes);
app.use('/api/profile', auth_mw_token, profileRoutes);

app.get('/', (req, res) => {
  res.send('hello from localhost');
});

/* ------------------ SERVER ------------------ */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

setupSocket(io);

server.listen(config.port, '0.0.0.0', () => {
  console.log('Backend listening on', config.port);
});
console.log("Registering /metrics route");

