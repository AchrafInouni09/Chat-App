# 🚀 ft_transcendence - Social Web Application

[![Project Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Docker](https://img.shields.io/badge/docker-compose-blue.svg)]()
[![Microservices](https://img.shields.io/badge/architecture-microservices-orange.svg)]()

A modern, full-stack social web application built with **microservices architecture**, featuring real-time chat, user management, posts, and friendship systems. Includes comprehensive **DevOps monitoring** with Prometheus and Grafana.

---

## 👥 Team & Roles

### Project Organization (4 Members)

| Member | Role | Responsibilities |
|--------|------|------------------|
| **Mouad** | **Frontend Developer & Product Owner (PO)** | - Frontend architecture & UI/UX implementation<br>- React + TypeScript development<br>- Product vision & feature prioritization<br>- Responsive design with Tailwind CSS<br>- WebSocket client integration |
| **Achraf** | **Backend Developer & Database Architect** | - Database schema design & optimization<br>- MySQL setup and migrations<br>- Backend services implementation<br>- API development & data modeling<br>- Database performance tuning |
| **You** | **DevOps Engineer & Technical Lead** | - Infrastructure setup & containerization<br>- Docker & docker-compose orchestration<br>- Prometheus & Grafana monitoring<br>- Nginx reverse proxy & SSL configuration<br>- CI/CD & deployment automation<br>- Technical architecture decisions |
| **Nesta** | **Backend Developer & Project Manager (PM)** | - Backend services development<br>- API integration & testing<br>- Code reviews & quality assurance<br>- Team coordination & sprint planning<br>- Problem-solving & debugging<br>- Progress tracking & communication |

### Role Distribution Rationale
Based on the **ft_transcendence subject requirements** (Section II.1.1):
- ✅ **Product Owner (PO)**: Mouad - Defines user experience and frontend features
- ✅ **Project Manager (PM)**: Nesta - Facilitates coordination, tracks progress, manages risks
- ✅ **Technical Lead/Architect**: You (DevOps) - Oversees infrastructure, technical decisions, and architecture
- ✅ **Developers**: All team members contribute to implementation, code reviews, testing, and documentation

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing API & Features](#-testing-api--features)
- [Monitoring & Observability](#-monitoring--observability)
- [Database](#-database)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)

---

## ✨ Features

### Core Features
- 🔐 **Authentication System**
  - Email/Password registration & login
  - JWT-based authentication
  - Two-Factor Authentication (2FA)
  - Password hashing with bcrypt
  - Secure session management

- 👤 **User Management**
  - User profiles with avatars
  - Profile updates (username, bio, avatar)
  - User search functionality
  - Online/offline status

- 💬 **Real-time Chat**
  - WebSocket-based messaging (Socket.io)
  - One-on-one conversations
  - Message history & pagination
  - Typing indicators
  - Read receipts

- 👥 **Friend System**
  - Send/accept/reject friend requests
  - Friend list management
  - Unfriend functionality
  - Pending requests tracking

- 📝 **Post Management**
  - Create, update, delete posts
  - Post feed with pagination
  - Like/unlike posts
  - Post comments
  - Media uploads

### DevOps & Infrastructure
- 🐳 **Containerization**: Full Docker setup with single-command deployment
- 📊 **Monitoring**: Prometheus metrics + Grafana dashboards
- 🔒 **Security**: HTTPS with SSL/TLS, environment variable management
- ⚡ **Performance**: Nginx reverse proxy, health checks, auto-restart
- 🏗️ **Architecture**: Clean microservices with service isolation

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 7.2.5
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion, GSAP
- **Routing**: React Router DOM 7.11.0
- **Forms**: React Hook Form
- **WebSockets**: Socket.io Client 4.8.3

### Backend (Microservices)
- **Runtime**: Node.js
- **Language**: JavaScript/TypeScript
- **Framework**: Express.js
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **File Upload**: Multer

### Database
- **RDBMS**: MySQL 8.0
- **Schema**: Normalized with foreign keys
- **Migrations**: SQL init scripts

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (HTTPS)
- **Monitoring**: Prometheus + Grafana
- **Metrics**: Node.js Prometheus client
- **Health Checks**: Custom health endpoints
- **Logging**: Container logs with timestamps

---

## 🏛 Architecture

### Microservices Architecture

```
┌─────────────┐
│   Nginx     │ ← HTTPS Reverse Proxy (Port 443)
│  (Gateway)  │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       │              │              │              │              │
┌──────▼──────┐ ┌────▼────┐ ┌───────▼──────┐ ┌────▼────┐ ┌──────▼──────┐
│   Frontend  │ │  Auth   │ │     User     │ │  Chat   │ │   Friend    │
│   (React)   │ │ Service │ │   Service    │ │ Service │ │   Service   │
│  Port 5173  │ │ :3001   │ │    :3002     │ │  :3003  │ │    :3005    │
└─────────────┘ └────┬────┘ └──────┬───────┘ └────┬────┘ └──────┬──────┘
                     │             │              │             │
┌────────────────────┴─────────────┴──────────────┴─────────────┴─────────┐
│                            MySQL Database                                │
│                             Port: 3306                                   │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐
│ Prometheus  │ ──────→ │   Grafana   │
│   :9090     │         │    :3001    │
└─────────────┘         └─────────────┘
```

### Service Responsibilities

| Service | Port | Purpose |
|---------|------|---------|
| **nginx** | 443 | HTTPS reverse proxy, SSL termination, routing |
| **frontend** | 5173 | React SPA, user interface |
| **auth-service** | 3001 | Authentication, JWT, 2FA, registration/login |
| **user-service** | 3002 | User profiles, avatars, user search |
| **chat-service** | 3003 | Real-time messaging, WebSocket connections |
| **friend-service** | 3005 | Friendship management, friend requests |
| **post-service** | 3004 | Posts, likes, comments |
| **mysql** | 3306 | Persistent data storage |
| **prometheus** | 9090 | Metrics collection & querying |
| **grafana** | 3001 | Metrics visualization, dashboards |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ ([Install Compose](https://docs.docker.com/compose/install/))
- **Git**: For cloning the repository
- **Make** (optional): For using Makefile commands

### Verify Installation
```bash
docker --version
docker-compose --version
git --version
make --version
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd trancendence
```

### 2. Create Environment File
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` manually with the following structure:
```bash
# MySQL Configuration
DB_NAME=chat_app
DB_USER=chat
DB_PASSWORD=your-secure-password-here
MYSQL_ROOT_PASSWORD=your-root-password-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Grafana Configuration
GF_SECURITY_ADMIN_PASSWORD=your-grafana-admin-password
```

### 3. Generate SSL Certificates (for HTTPS)
```bash
# Create certificates directory
mkdir -p nginx/certs

# Generate self-signed certificate (for development)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/server.key \
  -out nginx/certs/server.crt \
  -subj "/CN=localhost"
```

---

## ⚙️ Configuration

### Environment Variables Reference

#### Database Configuration
```bash
DB_NAME=chat_app           # Database name
DB_USER=chat               # Database user
DB_PASSWORD=<secure>       # CHANGE THIS - Strong password required
MYSQL_ROOT_PASSWORD=<secure>  # CHANGE THIS - Root password
```

#### JWT Configuration
```bash
JWT_SECRET=<secret>        # CHANGE THIS - Use long random string
                          # Generate with: openssl rand -base64 32
```

#### Grafana Configuration
```bash
GF_SECURITY_ADMIN_PASSWORD=<password>  # Grafana admin password
```

### 🔒 Security Best Practices

⚠️ **IMPORTANT**: 
- Never commit `.env` to version control
- Use strong, unique passwords (min 16 characters)
- Generate JWT secret with: `openssl rand -base64 64`
- Change all default passwords before deployment
- Use environment-specific `.env` files for staging/production

---

## 🏃 Running the Application

### Quick Start (Recommended)

#### Using Make (Easiest)
```bash
# Start all services
make up

# View status
make status

# Check health
make health

# View logs
make logs

# Stop services
make down
```

#### Using Docker Compose Directly
```bash
# Start all services (detached mode)
docker-compose -f docker-compose.microservices.yml up -d --build

# View running containers
docker-compose -f docker-compose.microservices.yml ps

# View logs
docker-compose -f docker-compose.microservices.yml logs -f

# Stop all services
docker-compose -f docker-compose.microservices.yml down
```

### Available Make Commands

| Command | Description |
|---------|-------------|
| `make up` | Build and start all services |
| `make down` | Stop and remove all services |
| `make stop` | Stop services (keep containers) |
| `make start` | Start stopped services |
| `make restart` | Restart all services |
| `make build` | Build all images |
| `make rebuild` | Rebuild all images (no cache) |
| `make re-<service>` | Rebuild specific service (e.g., `make re-frontend`) |
| `make logs` | Follow logs (all services) |
| `make logs-<service>` | Follow logs for one service (e.g., `make logs-auth-service`) |
| `make ps` | List containers |
| `make status` | Detailed status with ports & volumes |
| `make health` | Check service health & Prometheus targets |
| `make metrics` | Show monitoring URLs |
| `make db` | Open MySQL shell |
| `make clean` | Stop & remove everything including volumes |
| `make help` | Show all available commands |

### Access the Application

Once started, access the following URLs:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Main Application** | https://localhost | Register new account |
| **Prometheus** | http://localhost:9090 | No auth required |
| **Grafana** | http://localhost:3001 | admin / (see `.env`) |
| **Grafana Dashboard** | http://localhost:3001/d/chatapp-main | - |

> **Note**: Accept the self-signed SSL certificate warning in your browser when accessing HTTPS.

---

## 🧪 Testing API & Features

### 1. Authentication Testing

#### Register a New User
```bash
curl -X POST https://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "SecurePass123!"
  }' \
  -k
```

#### Login
```bash
curl -X POST https://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -k
```

**Response**: You'll receive a JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

**Save the token** for subsequent requests:
```bash
export TOKEN="your-jwt-token-here"
```

### 2. User Service Testing

#### Get User Profile
```bash
curl -X GET https://localhost/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -k
```

#### Update Profile
```bash
curl -X PUT https://localhost/api/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "bio": "My awesome bio"
  }' \
  -k
```

#### Search Users
```bash
curl -X GET "https://localhost/api/users/search?q=test" \
  -H "Authorization: Bearer $TOKEN" \
  -k
```

### 3. Friend Service Testing

#### Send Friend Request
```bash
curl -X POST https://localhost/api/friends/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"friendId": 2}' \
  -k
```

#### Get Friend List
```bash
curl -X GET https://localhost/api/friends \
  -H "Authorization: Bearer $TOKEN" \
  -k
```

#### Accept Friend Request
```bash
curl -X PUT https://localhost/api/friends/accept/2 \
  -H "Authorization: Bearer $TOKEN" \
  -k
```

### 4. Post Service Testing

#### Create Post
```bash
curl -X POST https://localhost/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "My first post!",
    "visibility": "public"
  }' \
  -k
```

#### Get Feed
```bash
curl -X GET https://localhost/api/posts/feed \
  -H "Authorization: Bearer $TOKEN" \
  -k
```

#### Like Post
```bash
curl -X POST https://localhost/api/posts/1/like \
  -H "Authorization: Bearer $TOKEN" \
  -k
```

### 5. Chat Service Testing (WebSocket)

The chat service uses WebSocket connections. Test using the frontend or a WebSocket client:

```javascript
// Frontend example (JavaScript)
import io from 'socket.io-client';

const socket = io('wss://localhost/api/chat', {
  auth: { token: 'your-jwt-token' }
});

// Send message
socket.emit('sendMessage', {
  recipientId: 2,
  content: 'Hello!'
});

// Receive messages
socket.on('newMessage', (message) => {
  console.log('New message:', message);
});
```

### 6. Health Checks

Check if all services are healthy:
```bash
# Using make
make health

# Or manually
curl -k https://localhost/api/auth/health
curl -k https://localhost/api/users/health
curl -k https://localhost/api/chat/health
curl -k https://localhost/api/friends/health
curl -k https://localhost/api/posts/health
```

Expected response: `{"status":"healthy","service":"<service-name>"}`

---

## 📊 Monitoring & Observability

### Prometheus Metrics

**Access**: http://localhost:9090

#### Available Metrics
- `http_requests_total` - Total HTTP requests per service
- `http_request_duration_seconds` - Request duration histogram
- `nodejs_heap_size_used_bytes` - Node.js heap memory usage
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `active_connections` - WebSocket connections (chat service)

#### Example Queries
```promql
# Request rate per service
rate(http_requests_total[5m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Memory usage by service
nodejs_heap_size_used_bytes

# Error rate
rate(http_requests_total{status=~"5.."}[5m])
```

### Grafana Dashboards

**Access**: http://localhost:3001  
**Login**: admin / (check `.env` for password)

#### Pre-configured Dashboard
Navigate to: **Dashboards → ChatApp Main Dashboard**

**Panels include**:
- 📈 Request Rate by Service
- ⏱️ Response Time Percentiles (p50, p95, p99)
- 🔥 Error Rate
- 💾 Memory Usage
- 🔌 Active WebSocket Connections
- 📊 Database Connection Pool

#### Creating Alerts (Optional)
1. Go to **Alerting → Alert Rules**
2. Create new alert rule
3. Set conditions (e.g., error rate > 5%)
4. Configure notifications (email, Slack, etc.)

### Viewing Logs

```bash
# All services
make logs

# Specific service
make logs-auth-service
make logs-frontend
make logs-mysql

# Docker compose
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Last 100 lines
docker-compose -f docker-compose.microservices.yml logs --tail=100 auth-service
```

---

## 🗄 Database

### Schema Overview

**Tables**:
- `users` - User accounts and profiles
- `sessions` - Active user sessions
- `messages` - Chat messages
- `friendships` - Friend relationships
- `friend_requests` - Pending friend requests
- `posts` - User posts
- `post_likes` - Post likes
- `comments` - Post comments

### Access Database

#### Using Make
```bash
make db
```

#### Using Docker
```bash
docker exec -it chatapp-mysql mysql -u chat -p chat_app
```

#### Common Queries
```sql
-- View all users
SELECT id, username, email, created_at FROM users;

-- View friendships
SELECT u1.username as user1, u2.username as user2, f.status
FROM friendships f
JOIN users u1 ON f.user_id = u1.id
JOIN users u2 ON f.friend_id = u2.id;

-- View recent messages
SELECT u.username, m.content, m.created_at
FROM messages m
JOIN users u ON m.sender_id = u.id
ORDER BY m.created_at DESC
LIMIT 10;

-- Database size
SELECT table_schema "Database",
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) "Size (MB)"
FROM information_schema.TABLES
WHERE table_schema = 'chat_app'
GROUP BY table_schema;
```

### Backup & Restore

#### Create Backup
```bash
docker exec chatapp-mysql mysqldump \
  -u chat -p chat_app > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Restore Backup
```bash
docker exec -i chatapp-mysql mysql \
  -u chat -p chat_app < backup_20260213_120000.sql
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Error: port 443 already allocated

# Solution: Check what's using the port
sudo lsof -i :443
sudo lsof -i :3306

# Kill the process or change port in docker-compose.yml
```

#### 2. Database Connection Failed
```bash
# Check MySQL container status
docker ps | grep mysql
make health

# Check MySQL logs
make logs-mysql

# Reset database
make clean
make up
```

#### 3. Services Not Healthy
```bash
# Check health endpoints
make health

# Restart specific service
make re-auth-service

# View logs for errors
make logs-auth-service
```

#### 4. SSL Certificate Issues
```bash
# Regenerate certificates
rm -rf nginx/certs/*
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/server.key \
  -out nginx/certs/server.crt \
  -subj "/CN=localhost"

# Restart nginx
make re-nginx
```

#### 5. Frontend Not Loading
```bash
# Check frontend logs
make logs-frontend

# Rebuild frontend
make re-frontend

# Check nginx routing
docker exec -it chatapp-nginx cat /etc/nginx/nginx.conf
```

#### 6. WebSocket Connection Failed
```bash
# Check chat service
make logs-chat-service

# Verify nginx WebSocket proxy settings
# Check browser console for errors

# Test WebSocket endpoint
wscat -c wss://localhost/api/chat -H "Authorization: Bearer YOUR_TOKEN"
```

### Debug Mode

Enable verbose logging:
```bash
# Set LOG_LEVEL in .env
echo "LOG_LEVEL=debug" >> .env

# Restart services
make restart
```

### Complete Reset

If all else fails, perform a complete reset:
```bash
# Stop and remove everything
make clean

# Remove all volumes (⚠️ DELETES ALL DATA)
docker volume prune -f

# Rebuild and start
make up
```

---

## 📁 Project Structure

```
trancendence/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── services/                 # Backend microservices
│   ├── auth-service/        # Authentication & JWT
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── user-service/        # User management
│   ├── chat-service/        # Real-time messaging
│   ├── friend-service/      # Friend relationships
│   └── post-service/        # Posts & social features
│
├── database/                 # Database initialization
│   └── init/
│       └── schema.sql       # Database schema
│
├── nginx/                    # Nginx reverse proxy
│   ├── nginx-microservices.conf
│   └── certs/               # SSL certificates
│       ├── server.crt
│       └── server.key
│
├── prometheus/               # Prometheus configuration
│   └── prometheus.yml
│
├── grafana/                  # Grafana configuration
│   ├── provisioning/
│   └── dashboards/
│
├── docker-compose.microservices.yml  # Main compose file
├── Makefile                  # Convenience commands
├── .env                      # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore
└── README.md                 # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| POST | `/api/auth/2fa/enable` | Enable 2FA | ✅ |
| POST | `/api/auth/2fa/verify` | Verify 2FA code | ✅ |
| GET | `/api/auth/health` | Health check | ❌ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile` | Get current user | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| POST | `/api/users/avatar` | Upload avatar | ✅ |
| GET | `/api/users/search` | Search users | ✅ |
| GET | `/api/users/:id` | Get user by ID | ✅ |

### Friend Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/friends/request` | Send friend request | ✅ |
| PUT | `/api/friends/accept/:id` | Accept request | ✅ |
| PUT | `/api/friends/reject/:id` | Reject request | ✅ |
| DELETE | `/api/friends/:id` | Remove friend | ✅ |
| GET | `/api/friends` | Get friend list | ✅ |
| GET | `/api/friends/requests` | Get pending requests | ✅ |

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts` | Create post | ✅ |
| GET | `/api/posts/feed` | Get feed | ✅ |
| GET | `/api/posts/:id` | Get post | ✅ |
| PUT | `/api/posts/:id` | Update post | ✅ |
| DELETE | `/api/posts/:id` | Delete post | ✅ |
| POST | `/api/posts/:id/like` | Like post | ✅ |
| DELETE | `/api/posts/:id/like` | Unlike post | ✅ |

### Chat WebSocket Events

| Event | Direction | Description | Payload |
|-------|-----------|-------------|---------|
| `connect` | Client → Server | Connect to chat | `{ token }` |
| `sendMessage` | Client → Server | Send message | `{ recipientId, content }` |
| `newMessage` | Server → Client | Receive message | `{ id, senderId, content, timestamp }` |
| `typing` | Client → Server | User typing | `{ recipientId }` |
| `userTyping` | Server → Client | Other user typing | `{ userId }` |
| `disconnect` | Client → Server | Disconnect | - |

### Request/Response Examples

#### Register User
**Request**:
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### Login
**Request**:
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "avatar": null
  }
}
```

#### Create Post
**Request**:
```json
POST /api/posts
Authorization: Bearer YOUR_JWT_TOKEN
{
  "content": "Hello, world!",
  "visibility": "public"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "userId": 1,
  "content": "Hello, world!",
  "visibility": "public",
  "likes": 0,
  "createdAt": "2026-02-13T18:00:00Z"
}
```

---

## 🎯 Project Features Checklist

### ✅ Mandatory Requirements
- [x] Web application with frontend, backend, and database
- [x] Git with clear commit messages from all team members
- [x] Containerization with Docker (single command deployment)
- [x] Google Chrome compatibility
- [x] No console errors or warnings
- [x] Privacy Policy and Terms of Service pages
- [x] Multi-user support with concurrent access
- [x] Responsive and accessible frontend
- [x] CSS framework (Tailwind CSS)
- [x] Environment variables in `.env` (with `.env.example`)
- [x] Clear database schema with relations
- [x] User management (signup/login with hashed passwords)
- [x] Form validation (frontend + backend)
- [x] HTTPS everywhere

### ✅ Implemented Modules

#### Web Modules
- [x] Frontend framework (React + TypeScript)
- [x] Modern CSS framework (Tailwind CSS)

#### User Management
- [x] Standard user authentication (email/password)
- [x] Two-Factor Authentication (2FA)
- [x] User profiles with avatars

#### Gaming and UX
- [x] Real-time features (WebSocket chat)
- [x] Live user status (online/offline)

#### DevOps
- [x] Infrastructure setup (Docker Compose)
- [x] Monitoring system (Prometheus + Grafana)
- [x] Service health checks
- [x] Log aggregation

#### Cybersecurity
- [x] HTTPS implementation
- [x] Hashed passwords (bcrypt)
- [x] JWT authentication
- [x] Input validation & sanitization

---

## 👨‍💻 Development

### Adding New Features
1. Create a new branch: `git checkout -b feature/your-feature`
2. Implement feature with tests
3. Update documentation if needed
4. Submit pull request for review

### Code Review Process
- All team members review important changes
- Technical lead approves architectural changes
- At least one peer review required
- Check for security vulnerabilities

### Testing Locally
```bash
# Run specific service in dev mode
cd services/auth-service
npm run dev

# Run frontend in dev mode
cd frontend
npm run dev
```

---

## 📝 License

This project is part of the 42 School curriculum - ft_transcendence project.

---

## 🤝 Contributing Team

**All team members actively participated in:**
- Planning and architecture decisions
- Code reviews and pair programming
- Testing and debugging
- Documentation
- Problem-solving and innovation

---

## 📞 Support & Contact

For issues or questions:
- Check the [Troubleshooting](#-troubleshooting) section
- Review Docker logs: `make logs`
- Contact team members:
  - **Mouad** (Frontend/PO)
  - **Achraf** (Backend/Database)
  - **DevOps Engineer** (Infrastructure)
  - **Nesta** (Backend/PM)

---

## 🚀 Quick Reference

```bash
# Start everything
make up

# Check status
make status && make health

# View logs
make logs

# Access application
https://localhost

# Access monitoring
http://localhost:9090  # Prometheus
http://localhost:3001  # Grafana

# Database shell
make db

# Stop everything
make down

# Complete cleanup
make clean
```

---

**Built with ❤️ by Mouad, Achraf, DevOps Engineer, and Nesta**

_ft_transcendence - 42 School - 2026_
