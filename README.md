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

## 🚀 Getting Started

Clone the repository and start the stack:

```bash
git clone https://github.com/julioxus/autobounty.git
cd autobounty
docker-compose up --build