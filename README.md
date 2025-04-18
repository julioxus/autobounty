# AutoBounty

This project automates bug bounty reconnaissance, vulnerability scanning, screenshot capturing, and provides a simple web interface to view results.

## 🧱 Architecture

- **Recon (`recon`)**: Uses tools like `subfinder`, `dnsx`, and `httpx` to find live subdomains.
- **Nuclei (`nuclei`)**: Runs vulnerability templates against discovered domains.
- **Gowitness (`gowitness`)**: Takes screenshots of live web services.
- **Backend (`backend`)**: Serves parsed output data from recon/Nuclei.
- **Frontend (`frontend`)**: Simple dashboard to display results and screenshots.

## 📦 Requirements

- Docker
- Docker Compose
- Make

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/julioxus/autobounty.git
cd autobounty
```

### Configuration

Before starting the services, you need to configure your target domains:

1. Add your target domains to `recon/targets.txt`, one domain per line:
```bash
example.com
example.org
example.net
```

2. Make sure the `recon/output` directory exists (it will be created automatically when running the services)

### Using Makefile

The project includes a Makefile to simplify common operations:

```bash
# Start all services
make all-up

# Start only recon services
make recon-up

# Start only web services
make web-up

# View logs
make all-logs    # All services
make recon-logs  # Only recon services
make web-logs    # Only web services

# Stop services
make all-down    # All services
make recon-down  # Only recon services
make web-down    # Only web services

# Build images
make all-build   # All services
make recon-build # Only recon services
make web-build   # Only web services

# Clean everything (containers, volumes, and output files)
make clean

# Show all available commands
make help
```

### Manual Docker Compose

Alternatively, you can use docker-compose directly:

```bash
# Start recon services
docker-compose up -d

# Start web services
docker-compose -f docker-compose.web.yml up -d
```

## 📝 Notes

- The recon services and web services are separated into different docker-compose files for better management
- The web interface will be available at `http://localhost:3000`
- The backend API will be available at `http://localhost:3001`
- Recon output files are stored in `recon/output/`
- Make sure to add your target domains to `recon/targets.txt` before starting the services