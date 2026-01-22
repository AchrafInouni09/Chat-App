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
echo "📁 Creating directories..."
mkdir -p $CONF_DIR
mkdir -p $CERT_DIR

# -------------------------------------------------
# Generate SSL cert if missing
# -------------------------------------------------
if [ ! -f "$CERT_DIR/localhost+2.pem" ]; then
  echo "🔐 Generating self-signed SSL certificate..."

  cd $CERT_DIR
  mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1
  cd ..

  echo "✅ SSL certificate generated"
else
  echo "✅ SSL certificate already exists"
fi

# -------------------------------------------------
# Write nginx.conf
# -------------------------------------------------
echo "📝 Writing nginx.conf..."

cat > $NGINX_DIR/nginx.conf <<'EOF'
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    # Include virtual host configs
    include /etc/nginx/conf.d/*.conf;
}
EOF

# -------------------------------------------------
# Write HTTPS reverse proxy config
# -------------------------------------------------
echo "📝 Writing default.conf..."

cat > $CONF_DIR/default.conf <<'EOF'
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate /etc/nginx/certs/localhost.crt;
    ssl_certificate_key /etc/nginx/certs/localhost.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ======================
    # Frontend (Vite + HMR)
    # ======================
    location / {
        proxy_pass http://chatapp-frontend:5173;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
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
    }

    location /images/ {
        proxy_pass http://chatapp-backend:3000/images/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# -------------------------------------------------
# Test nginx config
# -------------------------------------------------
echo "🧪 Testing nginx configuration..."
nginx -t

echo "======================================="
echo "✅ NGINX READY — STARTING SERVER"
echo "======================================="

exec nginx -g "daemon off;"
