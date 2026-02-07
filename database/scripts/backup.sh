#!/bin/bash
# FIX: Automated MySQL backup script with retention policy

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/backup_${TIMESTAMP}.sql"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

echo "[$(date)] Starting backup..."

# Create backup
mysqldump -h${MYSQL_HOST} -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > ${BACKUP_FILE}

# Compress backup
gzip ${BACKUP_FILE}

echo "[$(date)] Backup completed: ${BACKUP_FILE}.gz"

# Remove old backups (keep only last N days)
find /backups -name "backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "[$(date)] Old backups cleaned up (retention: ${RETENTION_DAYS} days)"
