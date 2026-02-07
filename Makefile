COMPOSE = docker-compose -f docker-compose.microservices.yml
GREEN   = \e[0;32m
RESET   = \e[0m

# ── Lifecycle ────────────────────────────────────────────────

up:
	$(COMPOSE) up -d --build
	@echo "$(GREEN)All services are up and running!$(RESET)"

down:
	$(COMPOSE) down
	@echo "$(GREEN)All services stopped and removed.$(RESET)"

stop:
	$(COMPOSE) stop
	@echo "$(GREEN)All services stopped.$(RESET)"

start:
	$(COMPOSE) start
	@echo "$(GREEN)All services started.$(RESET)"

restart:
	$(COMPOSE) restart
	@echo "$(GREEN)All services restarted.$(RESET)"

# ── Build ────────────────────────────────────────────────────

build:
	$(COMPOSE) build
	@echo "$(GREEN)All images built.$(RESET)"

rebuild:
	$(COMPOSE) build --no-cache
	@echo "$(GREEN)All images rebuilt from scratch.$(RESET)"

# ── Per-service ──────────────────────────────────────────────

re-%:
	$(COMPOSE) up -d --build --force-recreate $*
	@echo "$(GREEN)Service '$*' rebuilt and recreated.$(RESET)"

logs-%:
	$(COMPOSE) logs -f --tail=100 $*

# ── Logs & Status ───────────────────────────────────────────

logs:
	$(COMPOSE) logs -f --tail=100

ps:
	$(COMPOSE) ps

status:
	@echo "── Containers ──"
	@$(COMPOSE) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "── Volumes ──"
	@docker volume ls --filter "name=trancendence" --format "table {{.Name}}\t{{.Driver}}"

# ── Monitoring ───────────────────────────────────────────────

health:
	@echo "── Service Health ──"
	@for svc in auth-service:3001 user-service:3002 chat-service:3003 \
		post-service:3004 friend-service:3005; do \
		name=$$(echo $$svc | cut -d: -f1); \
		code=$$(docker exec chatapp-$$name wget -qO- http://localhost:$$(echo $$svc | cut -d: -f2)/health 2>/dev/null | head -c 30); \
		printf "  %-18s %s\n" "$$name" "$$code"; \
	done
	@echo ""
	@echo "── Prometheus Targets ──"
	@curl -s http://localhost:9090/api/v1/targets 2>/dev/null | \
		python3 -c "import sys,json;[print(f'  {t[\"labels\"][\"job\"]:20s} {t[\"health\"]}') for t in json.load(sys.stdin)['data']['activeTargets']]" 2>/dev/null \
		|| echo "  Prometheus not reachable"

metrics:
	@echo "  Prometheus:  http://localhost:9090"
	@echo "  Grafana:     http://localhost:3001  (admin / see .env)"
	@echo "  Dashboard:   http://localhost:3001/d/chatapp-main"

# ── Database ─────────────────────────────────────────────────

db:
	docker exec -it chatapp-mysql mysql -u$$(grep DB_USER .env | cut -d= -f2) \
		-p$$(grep DB_PASSWORD .env | cut -d= -f2) $$(grep DB_NAME .env | cut -d= -f2)

# ── Cleanup ──────────────────────────────────────────────────

clean: down
	$(COMPOSE) down --volumes --remove-orphans
	@echo "$(GREEN)Containers, networks, and volumes removed.$(RESET)"

# ── Help ─────────────────────────────────────────────────────

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "  up          Build & start all services"
	@echo "  down        Stop & remove all services"
	@echo "  stop        Stop services (keep containers)"
	@echo "  start       Start stopped services"
	@echo "  restart     Restart all services"
	@echo ""
	@echo "  build       Build all images"
	@echo "  rebuild     Build all images (no cache)"
	@echo "  re-<svc>    Rebuild & recreate one service (e.g. make re-frontend)"
	@echo ""
	@echo "  logs        Follow logs (all services)"
	@echo "  logs-<svc>  Follow logs for one service (e.g. make logs-auth-service)"
	@echo "  ps          List containers"
	@echo "  status      Detailed status with ports & volumes"
	@echo ""
	@echo "  health      Check service health & Prometheus targets"
	@echo "  metrics     Show monitoring URLs"
	@echo "  db          Open MySQL shell"
	@echo ""
	@echo "  clean       Stop & remove everything including volumes"
	@echo "  fclean      clean + prune images & dangling resources"
	@echo "  help        Show this help"

.PHONY: up down stop start restart build rebuild logs ps status \
        health metrics db clean fclean help
