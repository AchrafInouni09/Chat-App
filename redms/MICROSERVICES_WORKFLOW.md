# Working with Microservices Architecture

## Quick Start

### 1. Start the Microservices
```bash
docker-compose -f docker-compose.microservices.yml up -d
```

### 2. View Service Status
```bash
docker-compose -f docker-compose.microservices.yml ps
```

### 3. View Logs
```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f auth-service
docker-compose -f docker-compose.microservices.yml logs -f user-service
docker-compose -f docker-compose.microservices.yml logs -f chat-service
```

### 4. Stop Services
```bash
docker-compose -f docker-compose.microservices.yml down
```

---

## Development Workflow

### Project Structure
```
services/
├── auth-service/      # Port 3001 - Authentication & JWT
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── user-service/      # Port 3002 - User profiles
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── chat-service/      # Port 3003 - Real-time messaging
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── post-service/      # Port 3004 - Posts management
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
└── friend-service/    # Port 3005 - Friend relationships
    ├── app.js
    ├── package.json
    └── Dockerfile
```

### Making Code Changes

1. **Edit service code** in `services/<service-name>/app.js`
2. **Rebuild and restart** the service:
```bash
# Rebuild specific service
docker-compose -f docker-compose.microservices.yml up -d --build auth-service

# Or rebuild all
docker-compose -f docker-compose.microservices.yml up -d --build
```

### Testing Individual Services

```bash
# Test auth service
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Test user service (requires token)
curl http://localhost/api/users/profile/1 \
  -H "Authorization: Bearer <your-token>"

# Test health endpoints
curl http://localhost/api/auth/health
curl http://localhost/api/users/health
curl http://localhost/api/chat/health
curl http://localhost/api/posts/health
curl http://localhost/api/friends/health
```

---

## API Gateway Routes

All requests go through Nginx API Gateway at `http://localhost`:

| Route | Service | Description |
|-------|---------|-------------|
| `/api/auth/*` | auth-service:3001 | Login, register, token verification |
| `/api/users/*` | user-service:3002 | User profiles, list users |
| `/api/profile/*` | user-service:3002 | Get/update profile |
| `/api/chat/*` | chat-service:3003 | Conversations, messages |
| `/socket.io/*` | chat-service:3003 | WebSocket connections |
| `/api/posts/*` | post-service:3004 | Create, view, delete posts |
| `/api/friends/*` | friend-service:3005 | Friend requests, friendships |

---

## Adding a New Feature

### Example: Add a new endpoint to user-service

1. **Edit** `services/user-service/app.js`:
```javascript
// Add new endpoint
app.get('/search', verifyToken, async (req, res) => {
    const { query } = req.query;
    try {
        const [rows] = await pool.query(
            'SELECT id, username, avatar FROM users WHERE username LIKE ?',
            [`%${query}%`]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error' });
    }
});
```

2. **Rebuild and restart**:
```bash
docker-compose -f docker-compose.microservices.yml up -d --build user-service
```

3. **Test**:
```bash
curl "http://localhost/api/users/search?query=john" \
  -H "Authorization: Bearer <token>"
```

---

## Adding Dependencies

### Example: Add bcrypt to auth-service

1. **Edit** `services/auth-service/package.json`:
```json
{
  "dependencies": {
    "express": "^5.2.1",
    "bcrypt": "^5.1.1",  // <-- Add this
    ...
  }
}
```

2. **Rebuild**:
```bash
docker-compose -f docker-compose.microservices.yml up -d --build auth-service
```

---

## Monitoring Your Services

### Prometheus Metrics
- **URL**: http://localhost:9090
- View metrics from all 5 microservices
- Check service health and performance

### Grafana Dashboards
- **URL**: http://localhost:3001
- **Username**: admin
- **Password**: Check `.env` file

### View Metrics
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets | jq

# View available metrics
curl http://localhost:9090/api/v1/label/__name__/values | jq
```

---

## Database Access

All services share the same MySQL database:

```bash
# Access MySQL
docker exec -it chatapp-mysql mysql -uchat -p chat_app

# View tables
SHOW TABLES;

# Check users
SELECT * FROM users;
```

---

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.microservices.yml logs <service-name>

# Check service status
docker-compose -f docker-compose.microservices.yml ps

# Restart service
docker-compose -f docker-compose.microservices.yml restart <service-name>
```

### Database Connection Issues
```bash
# Verify MySQL is running
docker-compose -f docker-compose.microservices.yml ps mysql

# Check database logs
docker-compose -f docker-compose.microservices.yml logs mysql

# Test connection
docker exec chatapp-mysql mysql -uchat -p${DB_PASSWORD} -e "SELECT 1"
```

### 502 Bad Gateway
- Check if the service is running: `docker-compose -f docker-compose.microservices.yml ps`
- Check service logs: `docker-compose -f docker-compose.microservices.yml logs <service-name>`
- Verify health check: `curl http://localhost/api/<service>/health`

---

## Common Commands Cheatsheet

```bash
# Start all services
docker-compose -f docker-compose.microservices.yml up -d

# Stop all services
docker-compose -f docker-compose.microservices.yml down

# View logs (follow mode)
docker-compose -f docker-compose.microservices.yml logs -f

# Rebuild after code changes
docker-compose -f docker-compose.microservices.yml up -d --build

# Restart a service
docker-compose -f docker-compose.microservices.yml restart auth-service

# View service status
docker-compose -f docker-compose.microservices.yml ps

# Execute command in service
docker-compose -f docker-compose.microservices.yml exec auth-service sh

# View resource usage
docker stats
```

---

## Frontend Integration

Your frontend should use the API Gateway routes:

```javascript
// Example API calls
const API_URL = 'http://localhost';

// Login
fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

// Get profile
fetch(`${API_URL}/api/users/profile/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
});

// Send message (WebSocket)
const socket = io(`${API_URL}`);
```

---

## Production Considerations

1. **Environment Variables**: Set proper values in `.env`
2. **Security**: Use strong JWT_SECRET and database passwords
3. **Backups**: Automated daily backups are configured
4. **Monitoring**: Check Grafana dashboards regularly
5. **Scaling**: Scale individual services as needed:
   ```bash
   docker-compose -f docker-compose.microservices.yml up -d --scale user-service=3
   ```

---

## Next Steps

1. ✅ Services are running
2. Test each service endpoint
3. Integrate with frontend
4. Monitor via Grafana
5. Customize services for your needs

For detailed DevOps features, see:
- `README.md` - Complete documentation
- `DEVOPS_FIXES.md` - Technical implementation details
- `DISASTER_RECOVERY.md` - Backup and recovery procedures
