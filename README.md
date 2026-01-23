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
   docker-compose up -d
   ```

5. **Check Service Health**:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

### Deployed Services

| Service | Status | Port | URL |
|---------|--------|------|-----|
| Frontend | ✅ | 80, 443 | http://localhost |
| Backend | ✅ | Internal (3000) | - |
| MySQL | ✅ | Internal (3306) | - |
| Nginx | ✅ | 80, 443 | http://localhost |
| Prometheus | ✅ | 9090 | http://localhost:9090 |
| Grafana | ✅ | 3001 | http://localhost:3001 |

### Managing Docker Services

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild after code changes
docker-compose up -d --build
```

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

## 📊 Monitoring & Observability

### Grafana Dashboards
Access Grafana at `http://localhost:3001`

**Default Credentials**:
- Username: `admin`
- Password: Check `.env` file for `GF_SECURITY_ADMIN_PASSWORD`

To view your Grafana password:
```bash
grep GF_SECURITY_ADMIN_PASSWORD .env
```

### Prometheus Metrics
Access Prometheus at `http://localhost:9090`

Backend metrics available at `/api/metrics` endpoint.

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