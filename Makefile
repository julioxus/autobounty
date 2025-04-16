.PHONY: recon web all clean logs-recon logs-web

# Comandos para servicios de recon
recon-up:
	docker-compose up -d

recon-down:
	docker-compose down

recon-logs:
	docker-compose logs -f

recon-build:
	docker-compose build

# Comandos para servicios web
web-up:
	docker-compose -f docker-compose.web.yml up -d

web-down:
	docker-compose -f docker-compose.web.yml down

web-logs:
	docker-compose -f docker-compose.web.yml logs -f

web-build:
	docker-compose -f docker-compose.web.yml build

# Comandos para todos los servicios
all-up: recon-up web-up

all-down: recon-down web-down

all-build: recon-build web-build

all-logs:
	@echo "=== Logs de Recon ==="
	@docker-compose logs -f & \
	echo "=== Logs de Web ===" && \
	docker-compose -f docker-compose.web.yml logs -f

# Limpieza
clean:
	docker-compose down -v
	docker-compose -f docker-compose.web.yml down -v
	docker system prune -f
	rm -rf ./recon/output/*

# Ayuda
help:
	@echo "Comandos disponibles:"
	@echo "  recon-up     - Inicia los servicios de recon"
	@echo "  recon-down   - Detiene los servicios de recon"
	@echo "  recon-logs   - Muestra los logs de recon"
	@echo "  recon-build  - Construye las imágenes de recon"
	@echo ""
	@echo "  web-up       - Inicia los servicios web"
	@echo "  web-down     - Detiene los servicios web"
	@echo "  web-logs     - Muestra los logs de web"
	@echo "  web-build    - Construye las imágenes web"
	@echo ""
	@echo "  all-up       - Inicia todos los servicios"
	@echo "  all-down     - Detiene todos los servicios"
	@echo "  all-build    - Construye todas las imágenes"
	@echo "  all-logs     - Muestra los logs de todos los servicios"
	@echo ""
	@echo "  clean        - Limpia todos los contenedores, volúmenes y la carpeta output"
	@echo "  help         - Muestra esta ayuda" 