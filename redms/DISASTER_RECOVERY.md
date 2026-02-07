# Disaster Recovery Procedures

## FIX: Comprehensive disaster recovery plan with automated backups

## Backup Strategy

### Automated Daily Backups
- MySQL database is backed up daily at midnight
- Backups are compressed and stored in `./database/backups/`
- Retention policy: 7 days (configurable via `BACKUP_RETENTION_DAYS`)
- Backup format: `backup_YYYYMMDD_HHMMSS.sql.gz`

### Backup Locations
- Local: `./database/backups/` (mounted volume)
- Recommended: Copy backups to remote storage (S3, NFS, etc.)

## Recovery Procedures

### Full Database Restore

1. **List available backups:**
```bash
docker exec chatapp-backup ls -lh /backups/
```

2. **Restore from specific backup:**
```bash
docker exec chatapp-backup /restore.sh /backups/backup_20260207_120000.sql.gz
```

3. **Verify restoration:**
```bash
docker exec chatapp-mysql mysql -u chat -p${DB_PASSWORD} chat_app -e "SHOW TABLES;"
```

### Manual Backup

Create an immediate backup:
```bash
docker exec chatapp-backup /backup.sh
```

### Service Recovery

#### Single Service Failure
```bash
# Restart specific service
docker-compose restart <service-name>

# Check logs
docker logs <container-name>

# Verify health
docker-compose ps
```

#### Complete System Failure

1. **Stop all services:**
```bash
docker-compose down
```

2. **Restore database (if needed):**
```bash
# Start only MySQL
docker-compose up -d mysql

# Wait for MySQL to be healthy
docker-compose ps mysql

# Restore backup
docker exec chatapp-backup /restore.sh /backups/<backup-file>
```

3. **Restart all services:**
```bash
docker-compose up -d
```

4. **Verify all services:**
```bash
docker-compose ps
curl http://localhost/health
curl http://localhost:9090/-/healthy  # Prometheus
curl http://localhost:3001/api/health  # Grafana
```

## Monitoring and Alerts

### Critical Alerts (Check Prometheus)
- Service Down (any service unreachable for >1 min)
- High Memory Usage (>90% for 5 min)
- Low Disk Space (<10%)
- High CPU Usage (>85% for 10 min)
- MySQL Connection Issues

### Health Check Endpoints
- Backend: `http://localhost:3000/api/health`
- Auth Service: `http://auth-service:3001/health`
- User Service: `http://user-service:3002/health`
- Chat Service: `http://chat-service:3003/health`
- Post Service: `http://post-service:3004/health`
- Friend Service: `http://friend-service:3005/health`
- Nginx: `http://localhost/health`
- Prometheus: `http://localhost:9090/-/healthy`
- Grafana: `http://localhost:3001/api/health`

## Data Loss Prevention

### Before Major Changes
1. Create manual backup
2. Test restore in development
3. Document rollback plan
4. Verify monitoring is active

### Regular Maintenance
- Weekly: Verify backup files exist and are valid
- Monthly: Test restore procedure
- Quarterly: Review and update DR procedures

## Contact and Escalation

### Emergency Response
1. Check Grafana dashboards for root cause
2. Check Prometheus alerts
3. Review container logs: `docker-compose logs <service>`
4. Escalate if data corruption suspected

## RTO and RPO

- **Recovery Time Objective (RTO):** 30 minutes
- **Recovery Point Objective (RPO):** 24 hours (daily backups)

To reduce RPO, increase backup frequency in docker-compose.yml:
```yaml
# Change from daily (86400s) to hourly (3600s)
command: ["/bin/bash", "-c", "while true; do /backup.sh; sleep 3600; done"]
```
