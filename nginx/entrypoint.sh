#!/bin/sh
set -e

echo "======================================="
echo "🚀 NGINX ENTRYPOINT STARTING"
echo "======================================="

NGINX_DIR="/etc/nginx"
CONF_DIR="$NGINX_DIR/conf.d"
CERT_DIR="$NGINX_DIR/certs"

# -------------------------------------------------
# Create needed directories
# -------------------------------------------------
echo "📁 Ensuring directories exist..."
mkdir -p $CONF_DIR
mkdir -p $CERT_DIR

# -------------------------------------------------
# Check and generate nginx.conf if missing
# -------------------------------------------------
if [ ! -f "$NGINX_DIR/nginx.conf" ]; then
  echo "📝 Writing nginx.conf (file not found)..."
  
  cat > $NGINX_DIR/nginx.conf <<'EOF'
user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Include virtual host configs
    include /etc/nginx/conf.d/*.conf;
}
EOF
  echo "✅ nginx.conf created"
else
  echo "✅ nginx.conf exists"
fi

# -------------------------------------------------
# Check and generate default.conf if missing
# -------------------------------------------------
if [ ! -f "$CONF_DIR/default.conf" ]; then
  echo "📝 Writing default.conf (file not found)..."
  
  cat > $CONF_DIR/default.conf <<'EOF'
server {
    listen 80;
    server_name localhost;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Security headers (HTTP)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # ======================
    # Frontend (Static Files)
    # ======================
    location / {
        proxy_pass http://chatapp-frontend:80;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://chatapp-frontend:80;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # =========
    # API
    # =========
    location /api/ {
        proxy_pass http://chatapp-backend:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for API
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # =================
    # Socket.IO
    # =================
    location /socket.io/ {
        proxy_pass http://chatapp-backend:3000;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    location /images/ {
        proxy_pass http://chatapp-backend:3000/images/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Image caching
        expires 7d;
        add_header Cache-Control "public";
    }
}

server {
    listen 443 ssl;
    http2 on;
    server_name localhost;

    ssl_certificate /etc/nginx/certs/localhost.crt;
    ssl_certificate_key /etc/nginx/certs/localhost.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # ======================
    # Frontend (Static Files)
    # ======================
    location / {
        proxy_pass http://chatapp-frontend:80;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://chatapp-frontend:80;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # =========
    # API
    # =========
    location /api/ {
        proxy_pass http://chatapp-backend:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for API
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # =================
    # Socket.IO
    # =================
    location /socket.io/ {
        proxy_pass http://chatapp-backend:3000;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    location /images/ {
        proxy_pass http://chatapp-backend:3000/images/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Image caching
        expires 7d;
        add_header Cache-Control "public";
    }
}
EOF
  echo "✅ default.conf created"
else
  echo "✅ default.conf exists"
fi

# -------------------------------------------------
# Check SSL certificates
# -------------------------------------------------
if [ ! -f "$CERT_DIR/localhost.crt" ] || [ ! -f "$CERT_DIR/localhost.key" ]; then
  echo "⚠️  SSL certificates not found in $CERT_DIR"
  echo "⚠️  HTTPS (port 443) will fail without certificates"
  echo "💡 To generate self-signed certificates, run:"
  echo "   cd nginx/certs && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\"
  echo "     -keyout localhost.key -out localhost.crt \\"
  echo "     -subj '/CN=localhost'"
else
  echo "✅ SSL certificates found"
fi

# -------------------------------------------------
# Test nginx config
# -------------------------------------------------
echo "🧪 Testing nginx configuration..."
nginx -t

echo "======================================="
echo "✅ NGINX READY — STARTING SERVER"
echo "======================================="

# Start nginx in foreground
exec nginx -g "daemon off;"

