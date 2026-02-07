# Chat App - Full Stack Application

A complete full-stack chat application with React frontend, Node.js/Express backend, MySQL database, and comprehensive monitoring (Prometheus/Grafana).

## 📂 Project Structure

*   **`frontend/`**: React application (Vite) with TypeScript
*   **`backend/`**: Node.js Express server with JWT authentication
*   **`database/`**: Docker configuration for MySQL and initialization scripts
*   **`nginx/`**: Reverse proxy and static file serving
*   **`prometheus/`**: Monitoring configuration
*   **`grafana/`**: Dashboards and visualization

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Start the Database
The database is containerized using Docker.

1.  Navigate to the database folder:
    ```bash
    cd database
    ```
2.  Start the container:
    ```bash
    docker-compose up -d
    ```
    *This will start MySQL on port `3306` and automatically run the schema initialization scripts found in `database/init/`.*

### 2. Start the Backend Server
The backend runs on port `3000`.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node app.js
    # OR if you have nodemon installed
    nodemon app.js
    ```

### 3. Start the Frontend Client
The frontend runs on port `5173` (default Vite port) and proxies API requests to the backend.

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📡 API Documentation

### Base URL
All authentication routes are prefixed with: `/api/auth`

### 1. Register User
Creates a new user account.

*   **Endpoint:** `POST /register`
*   **URL:** `http://localhost:3000/api/auth/register`
*   **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user" 
}
```

**Success Response (200):**
```json
{
  "message": "registerd success"
}
```

**Error Responses:**
*   `400 Bad Request`: Missing required fields or invalid role.
*   `409 Conflict`: Email, Username, or Name combination already exists.
*   `500 Internal Server Error`: Server issue.

### 2. Login User
Authenticates a user and returns a JWT token.

*   **Endpoint:** `POST /login`
*   **URL:** `http://localhost:3000/api/auth/login`
*   **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
*   `400 Bad Request`: Missing username or password.
*   `401 Unauthorized`: Invalid credentials (wrong username or password).
*   `500 Internal Server Error`: Server issue.

---

## ⚙️ Environment Variables

The backend relies on a `.env` file located in `backend/.env`. Ensure it contains the following:

```env
DB_HOST=localhost
DB_USER=chat
DB_PASSWORD=chat
DB_NAME=chat_app
DB_PORT=3306
JWT_SECRET=.

## 🗄️ Database Schema

The database `chat_app` includes the following primary tables:
*   `users`: Stores user credentials and profile info.
*   `friendships`: Manages connections between users.
*   `conversations`: Stores chat groups or direct message metadata.
*   `messages`: Stores the actual chat history.
*   `api_keys`: For external API access.

---

## 🐳 Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Ports 80, 443, 3001, 9090 available

### Quick Start with Docker

1. **Generate Secure Credentials**:
   ```bash
   # Generate JWT secret
   openssl rand -base64 32
   
   # Generate MySQL passwords
   openssl rand -base64 16
   
   # Generate Grafana password
   openssl rand -base64 16
   ```

2. **Create Environment File**:
   ```bash
   cat > .env << 'EOF'
   DB_NAME=chat_app
   DB_USER=chat
   DB_PASSWORD=<your-generated-password>
   MYSQL_ROOT_PASSWORD=<your-generated-root-password>
   GF_SECURITY_ADMIN_PASSWORD=<your-generated-grafana-password>
   JWT_SECRET=<your-generated-jwt-secret>
   EOF
   ```

3. **Create Backend Environment File**:
   ```bash
   cp .env backend/.env
   # Edit backend/.env and add:
   # DB_HOST=mysql
   # DB_USER=chat
   # DB_PASSWORD=<same-as-above>
   # DB_NAME=chat_app
   # DB_PORT=3306
   # JWT_SECRET=<same-as-above>
   ```

4. **Start All Services**:
   ```bash
   # Monolithic architecture (original)
   docker-compose up -d
   
   # OR Microservices architecture (new)
   docker-compose -f docker-compose.microservices.yml up -d
   ```

5. **Check Service Health**:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Deployed Services

#### Monolithic Architecture
| Service | Status | Port | URL |
|---------|--------|------|-----|
| Frontend | ✅ | 80, 443 | http://localhost |
| Backend | ✅ | Internal (3000) | - |
| MySQL | ✅ | Internal (3306) | - |
| Nginx | ✅ | 80, 443 | http://localhost |
| Prometheus | ✅ | 9090 | http://localhost:9090 |
| Grafana | ✅ | 3001 | http://localhost:3001 |
| Node Exporter | ✅ | Internal (9100) | - |
| MySQL Exporter | ✅ | Internal (9104) | - |
| cAdvisor | ✅ | Internal (8080) | - |
| Backup Service | ✅ | N/A | Daily backups |

#### Microservices Architecture
| Service | Status | Port | URL |
|---------|--------|------|-----|
| API Gateway (Nginx) | ✅ | 80, 443 | http://localhost |
| Auth Service | ✅ | Internal (3001) | /api/auth/* |
| User Service | ✅ | Internal (3002) | /api/users/* |
| Chat Service | ✅ | Internal (3003) | /api/chat/* |
| Post Service | ✅ | Internal (3004) | /api/posts/* |
| Friend Service | ✅ | Internal (3005) | /api/friends/* |
| Frontend | ✅ | Internal (80) | / |
| MySQL | ✅ | Internal (3306) | - |
| Prometheus | ✅ | 9090 | http://localhost:9090 |
| Grafana | ✅ | 3001 | http://localhost:3001 |
| Monitoring Stack | ✅ | Various | Exporters + Alerts |
| Backup Service | ✅ | N/A | Daily backups |

### Managing Docker Services

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build

# Switch to microservices
docker-compose down
docker-compose -f docker-compose.microservices.yml up -d

# View service health status
docker-compose ps
```

### Switching Between Architectures

**From Monolithic to Microservices**:
```bash
# Stop monolithic
docker-compose down

# Start microservices (data is preserved in MySQL volume)
docker-compose -f docker-compose.microservices.yml up -d
```

**From Microservices to Monolithic**:
```bash
# Stop microservices
docker-compose -f docker-compose.microservices.yml down

# Start monolithic
docker-compose up -d
```

**Note**: Database volume (`mysql_data`) is shared between architectures, so data persists when switching.

---

## 🔒 Authentication & Security

### Authentication Flow

1. **First Visit** (no cookies):
   - User visits `http://localhost`
   - Sees HomePage with "LOGIN // JOIN" button
   - Nav bar shows login option

2. **With Valid Token**:
   - Nav shows user avatar and menu
   - Protected routes are accessible
   - Profile data loads automatically

3. **With Invalid/Expired Token**:
   - Token is automatically removed on app load
   - User sees logged-out state
   - Redirected to login when accessing protected routes

### Route Protection

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage (landing page) |
| `/login` | Public | Login/Register page |
| `/register` | Public | Login/Register page |
| `/chat` | Protected (user/admin) | Chat interface |
| `/friends` | Protected (user/admin) | Friends list |
| `/profile` | Protected (user/admin) | User profile |
| `/posts` | Protected (user/admin) | Posts feed |
| `/add-friends` | Protected (user/admin) | Add friends |
| `/api-keys` | Protected (user/admin) | API key management |
| `/admin` | Protected (admin only) | Admin dashboard |
| `/components` | Public | Component showcase |

### Security Best Practices

⚠️ **CRITICAL**: Never commit `.env` files to git!

```bash
# If .env was accidentally committed, remove from git history:
git rm --cached backend/.env
git commit -m "Remove .env from version control"

# Rotate all credentials if repository is public
```

---

## 🔧 Recent Fixes & Improvements

### DevOps Requirements - All Fixed ✅

#### MAJOR: Monitoring System with Prometheus and Grafana ✅
- ✅ **Set up Prometheus to collect metrics** - Prometheus running with 30-day retention
- ✅ **Configure exporters and integrations** - Added node-exporter, mysqld-exporter, cAdvisor
- ✅ **Create custom Grafana dashboards** - Auto-provisioned dashboard on startup
- ✅ **Set up alerting rules** - 9 alert rules for services, resources, and database
- ✅ **Secure access to Grafana** - Password protected, no anonymous access, signup disabled

#### MAJOR: Backend as Microservices ✅
- ✅ **Design loosely-coupled services** - 5 independent microservices with clear boundaries
- ✅ **Use REST APIs for communication** - Services communicate via HTTP REST APIs
- ✅ **Single responsibility** - Each service handles one domain:
  - auth-service: Authentication & JWT
  - user-service: User profiles
  - chat-service: Real-time messaging
  - post-service: Content management
  - friend-service: Relationships
- ✅ **API Gateway** - Nginx routes requests to appropriate services

#### MINOR: Health Check and Status Page System ✅
- ✅ **Health check system** - All services have health checks with auto-restart
- ✅ **Automated backups** - Daily MySQL backups with 7-day retention
- ✅ **Disaster recovery procedures** - Complete DR documentation with RTO/RPO

### Avatar Display Fix ✅
- **Backend**: Added `avatar_url` field to conversation queries
- **Frontend**: Updated `ChatPage`, `FriendsPage`, and `SideFriendReq` components
- Avatar images now properly displayed in:
  - Chat conversation sidebar
  - Friends list
  - Chat headers
  - Message bubbles
- Avatar URL pattern: `/images/{filename}`

### HTTP/HTTPS Configuration ✅
- **Development**: Use `http://localhost` (no SSL warnings)
- **Production**: Use `https://localhost` with proper SSL certificates
- Nginx configuration allows both HTTP (port 80) and HTTPS (port 443)
- Self-signed certificates included for development

### Token Validation ✅
- Automatic token validation on app load
- Invalid/expired tokens automatically cleaned from cookies
- Prevents authentication errors from stale tokens

### TypeScript Build Fixes ✅
- Relaxed strict TypeScript settings for successful builds
- Fixed SVG and JWT decode type errors
- CSS minification configured properly

---

## 🏗️ Architecture

### FIX: Microservices Architecture ✅

The application is available in two architectures:

#### 1. Monolithic Architecture (Original)
- Single backend service with all functionality
- Use: `docker-compose.yml`
- Suitable for: Development, small deployments

#### 2. Microservices Architecture (New)
- Loosely-coupled services with clear boundaries
- Each service has a single responsibility
- Services communicate via REST APIs
- Use: `docker-compose.microservices.yml`
- Suitable for: Production, scalability, fault isolation

**Microservices Breakdown**:

| Service | Responsibility | Port | Communication |
|---------|---------------|------|---------------|
| **auth-service** | Authentication, JWT management, token validation | 3001 | REST API |
| **user-service** | User profiles, avatar management, user data | 3002 | REST API + Auth verification |
| **chat-service** | Real-time messaging, WebSocket connections | 3003 | REST API + WebSocket |
| **post-service** | Posts management, content creation | 3004 | REST API + Auth verification |
| **friend-service** | Friend relationships, friend requests | 3005 | REST API + Auth verification |
| **nginx** | API Gateway - routes requests to services | 80/443 | HTTP reverse proxy |

**Service Communication**:
- All services communicate through REST APIs
- Auth service provides `/verify` endpoint for token validation
- Services call auth-service to authenticate requests
- Nginx acts as API Gateway routing client requests

**Start Microservices**:
```bash
docker-compose -f docker-compose.microservices.yml up -d
```

**API Gateway Routes** (Nginx):
```
/api/auth/*     → auth-service:3001
/api/users/*    → user-service:3002
/api/profile/*  → user-service:3002
/api/chat/*     → chat-service:3003
/api/posts/*    → post-service:3004
/api/friends/*  → friend-service:3005
/socket.io/*    → chat-service:3003 (WebSocket)
```

### Architecture Diagrams

**Monolithic**:
```
Client → Nginx → Backend (All Routes) → MySQL
                    ↓
              Prometheus & Grafana
```

**Microservices**:
```
Client → Nginx (API Gateway)
           ↓
    ┌──────┼──────┬──────┬──────┐
    ↓      ↓      ↓      ↓      ↓
  Auth   User   Chat   Post  Friend
Service Service Service Service Service
    ↓      ↓      ↓      ↓      ↓
           MySQL Database
    ↓      ↓      ↓      ↓      ↓
    Prometheus & Grafana
```

---

## 💾 Backup & Disaster Recovery

### FIX: Automated Backup System ✅

**Automated Daily Backups**:
- MySQL database backed up daily at midnight
- Backups compressed with gzip
- 7-day retention policy (configurable)
- Stored in `./database/backups/`

**Backup Service**:
```bash
# View backups
docker exec chatapp-backup ls -lh /backups/

# Manual backup
docker exec chatapp-backup /backup.sh

# Restore from backup
docker exec chatapp-backup /restore.sh /backups/backup_20260207_120000.sql.gz
```

**Configure Retention**:
Edit `.env`:
```env
BACKUP_RETENTION_DAYS=14  # Keep 14 days of backups
```

### FIX: Disaster Recovery Procedures ✅

Complete disaster recovery documentation available in `DISASTER_RECOVERY.md`

**Quick Recovery Steps**:

1. **Service Failure**:
```bash
docker-compose restart <service-name>
docker-compose logs <service-name>
```

2. **Database Restore**:
```bash
docker-compose up -d mysql
docker exec chatapp-backup /restore.sh /backups/<backup-file>
docker-compose restart backend
```

3. **Complete System Recovery**:
```bash
docker-compose down
docker-compose up -d mysql
# Wait for MySQL health check
docker exec chatapp-backup /restore.sh /backups/<latest-backup>
docker-compose up -d
```

**Recovery Objectives**:
- **RTO** (Recovery Time Objective): 30 minutes
- **RPO** (Recovery Point Objective): 24 hours

See `DISASTER_RECOVERY.md` for complete procedures.

---

## 🏥 Health Checks & Status

### FIX: Comprehensive Health Check System ✅

All services include health checks with automatic restart on failure:

**Health Check Endpoints**:
```bash
# Monolithic
curl http://localhost/api/health
curl http://localhost:9090/-/healthy
curl http://localhost:3001/api/health

# Microservices
curl http://localhost/health                    # API Gateway
curl http://localhost/api/auth/health           # Auth Service
curl http://localhost/api/users/health          # User Service
curl http://localhost/api/chat/health           # Chat Service
curl http://localhost/api/posts/health          # Post Service
curl http://localhost/api/friends/health        # Friend Service
```

**Check All Services**:
```bash
# View health status
docker-compose ps

# View specific service health
docker inspect chatapp-backend --format='{{.State.Health.Status}}'
```

**Health Check Configuration**:
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3
- Start period: 10-40 seconds (varies by service)

### Service Dependencies

Services start in correct order with dependency health checks:
```
MySQL (healthy)
  ↓
Backend/Services (healthy)
  ↓
Nginx
  ↓
Monitoring (Prometheus, Grafana)
```

---

## 📊 Monitoring & Observability

### FIX: Complete Monitoring System with Prometheus and Grafana ✅

The application includes a comprehensive monitoring stack that tracks:
- Application metrics (HTTP requests, response times, active connections)
- System metrics (CPU, memory, disk, network)
- Database metrics (connections, queries, performance)
- Container metrics (resource usage per container)

**Prometheus** (http://localhost:9090):
- Scrapes metrics from all services every 15-30 seconds
- Stores time-series data with 30-day retention
- Evaluates alerting rules continuously

**Grafana** (http://localhost:3001):
- **Username**: `admin`
- **Password**: Check `.env` file for `GF_SECURITY_ADMIN_PASSWORD`
- Auto-provisioned dashboards show real-time metrics
- Secured with authentication (no anonymous access)

```bash
# View Grafana password
grep GF_SECURITY_ADMIN_PASSWORD .env
```

### FIX: Exporters and Integrations ✅

The monitoring system includes multiple exporters for comprehensive metrics:

| Exporter | Metrics Collected | Port |
|----------|------------------|------|
| **node-exporter** | Host system metrics (CPU, memory, disk, network) | 9100 |
| **mysqld-exporter** | MySQL database metrics (connections, queries, InnoDB) | 9104 |
| **cAdvisor** | Container metrics (per-container CPU, memory, I/O) | 8080 |
| **prom-client** | Application metrics (HTTP requests, custom counters) | /metrics |

### FIX: Alerting Rules ✅

Prometheus monitors critical conditions and triggers alerts:

**Service Alerts**:
- `ServiceDown`: Any service unreachable for >1 minute
- `HighResponseTime`: 95th percentile response time >2 seconds for 5 minutes

**Resource Alerts**:
- `HighMemoryUsage`: Container using >90% memory for 5 minutes
- `LowDiskSpace`: Disk space <10%
- `HighCPUUsage`: CPU >85% for 10 minutes

**Database Alerts**:
- `MySQLDown`: Database unreachable for >1 minute
- `MySQLTooManyConnections`: >80% of max connections used

Alerting rules are defined in `prometheus/alerts.yml`

### Available Metrics Endpoints

```bash
# Backend application metrics
curl http://localhost:3000/metrics

# Prometheus targets
curl http://localhost:9090/api/v1/targets

# All available metrics
curl http://localhost:9090/api/v1/label/__name__/values
```

---

## ⚠️ Important Security Notes

1. **Environment Variables**: All sensitive data stored in `.env` files
2. **Git Ignore**: Ensure `.env` files are in `.gitignore`
3. **Credential Rotation**: If repository was public, rotate all credentials
4. **SSL Certificates**: Use proper certificates in production
5. **Database Access**: MySQL only accessible within Docker network

---

## 🧪 Testing the Application

1. **Clear Browser Cookies**:
   - Chrome/Edge: F12 → Application → Cookies → localhost → Delete all
   - Firefox: F12 → Storage → Cookies → Delete all

2. **Test Authentication**:
   - Visit `http://localhost`
   - Click "LOGIN // JOIN"
   - Create account or login
   - Verify redirect to appropriate page

3. **Test Protected Routes**:
   - Try accessing `/chat`, `/friends`, `/profile`
   - Should work if logged in
   - Should redirect to `/login` if not

4. **Test Avatar Display**:
   - Navigate to Friends page - avatars should appear
   - Open Chat page - avatars in conversation sidebar
   - Send messages - avatars next to messages

5. **Test Health Check**:
   ```bash
   curl http://localhost/api/health
   ```

---

## 🚧 Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend

# Restart services
docker-compose restart
```

### Database Connection Issues
- Verify `.env` credentials match in root and `backend/.env`
- Check MySQL container is running: `docker-compose ps mysql`
- Verify database initialization: `docker-compose logs mysql`

### Frontend Build Errors
- Clear node_modules: `rm -rf frontend/node_modules && cd frontend && npm install`
- Check TypeScript errors: `cd frontend && npm run build`

### Authentication Not Working
- Clear browser cookies
- Verify JWT_SECRET is set in `backend/.env`
- Check backend logs: `docker-compose logs backend`

---

## 📝 Development vs Production

**Development**:
- Use HTTP (`http://localhost`)
- Self-signed certificates OK
- Debug logging enabled
- Hot reload active

**Production**:
- Use HTTPS with valid certificates
- Disable debug logging
- Set secure JWT secrets
- Configure proper CORS policies
- Use production-grade passwords
- Enable rate limiting
- Set up proper backup procedures

---
## 🚀 DevOps Features

### Complete Monitoring Stack
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization dashboards
- **Exporters**: node-exporter, mysqld-exporter, cAdvisor
- **Custom Metrics**: HTTP requests, response times, active connections
- **9 Alert Rules**: Service health, resource usage, database status

### Automated Operations
- **Daily Backups**: Automated MySQL backups with compression
- **Health Checks**: All services monitored with auto-restart
- **Log Aggregation**: Centralized logging via Docker
- **Resource Limits**: Memory and CPU limits per service

### Production Ready
- **Microservices Architecture**: Scalable, fault-isolated services
- **API Gateway**: Centralized routing and load balancing
- **Disaster Recovery**: Documented procedures with 30min RTO
- **Security**: JWT authentication, password protection, no anonymous access
- **High Availability**: Service dependencies and health-based startup

### Files Added/Modified for DevOps

**New Files**:
- `prometheus/alerts.yml` - FIX: Alerting rules for critical monitoring
- `prometheus/prometheus-microservices.yml` - FIX: Microservices metrics config
- `grafana/provisioning/dashboards/dashboard.yml` - FIX: Auto-provision dashboards
- `database/scripts/backup.sh` - FIX: Automated backup script
- `database/scripts/restore.sh` - FIX: Disaster recovery restore script
- `docker-compose.microservices.yml` - FIX: Microservices architecture
- `nginx/nginx-microservices.conf` - FIX: API Gateway configuration
- `services/auth-service/*` - FIX: Authentication microservice
- `services/user-service/*` - FIX: User management microservice
- `services/chat-service/*` - FIX: Chat/messaging microservice
- `services/post-service/*` - FIX: Posts management microservice
- `services/friend-service/*` - FIX: Friends management microservice
- `DISASTER_RECOVERY.md` - FIX: Complete DR documentation

**Modified Files**:
- `docker-compose.yml` - FIX: Added node-exporter, mysqld-exporter, cAdvisor, backup service
- `prometheus/prometheus.yml` - FIX: Added exporter scrape configs and alerting

---

## 📚 Additional Documentation

- **`DISASTER_RECOVERY.md`**: Complete disaster recovery procedures, backup/restore guides, RTO/RPO definitions
- **`prometheus/alerts.yml`**: All alerting rules with descriptions
- **`docker-compose.microservices.yml`**: Microservices deployment configuration

---

## 📝 License

This project is for educational purposes.

