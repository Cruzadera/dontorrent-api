# 🎬 DonTorrent API (Torznab Proxy)

![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> API ligera en Node.js que convierte los resultados de búsqueda de [DonTorrent](https://dontorrent.lat) en un **feed Torznab XML**, compatible con Prowlarr, Radarr y Sonarr.

Esta API permite realizar búsquedas en DonTorrent directamente desde tus aplicaciones de gestión de descargas (Prowlarr, Radarr, Sonarr) sin depender de Jackett o indexadores externos que suelen romperse por los cambios de Cloudflare o HTML.

---

## 🧱 Características principales

- 🔎 Búsqueda de torrents en DonTorrent en tiempo real.
- ⚙️ Respuesta en formato **Torznab XML** compatible con Prowlarr.
- 💡 100% local — sin dependencias de terceros ni APIs externas.
- 🧩 Integración directa con Docker y red `media_net`.
- ⚡ Ligero: consume < 40 MB RAM y arranca en segundos.

---

## 📦 Instalación local

```bash
git clone https://github.com/Cruzadera/dontorrent-api.git
cd dontorrent-api
npm install
npm start
