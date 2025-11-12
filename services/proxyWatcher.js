const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { setBaseUrl, getBaseUrl } = require("./dontorrent.js");

const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hora
const DONPROXIES_URL = "https://donproxies.com/";
const FLARESOLVERR_URL = process.env.FLARESOLVERR_URL || "http://flaresolverr:8191/v1";

async function fetchPage(url, useFlaresolverr = true) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      timeout: 10000,
    });
    return await res.text();
  } catch (err) {
    if (!useFlaresolverr) throw err;

    // 🔁 Reintenta vía Flaresolverr
    console.log("🌐 Reintentando con Flaresolverr...");
    try {
      const body = {
        cmd: "request.get",
        url,
        maxTimeout: 60000,
      };
      const resp = await fetch(FLARESOLVERR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      return data?.solution?.response || "";
    } catch (err2) {
      console.error("❌ Error al usar Flaresolverr:", err2.message);
      return "";
    }
  }
}

async function fetchLatestProxy() {
  try {
    console.log("🔎 Buscando nuevo proxy de DonTorrent en donproxies.com...");
    const html = await fetchPage(DONPROXIES_URL);
    const $ = cheerio.load(html);

    // Buscar el primer enlace con "dontorrent"
    const newProxy =
      $("a[href*='dontorrent']").first().attr("href")?.replace(/\/$/, "") || null;

    if (!newProxy) {
      console.warn("⚠️ No se encontró ningún enlace válido en donproxies.com");
      return;
    }

    const current = getBaseUrl();
    if (newProxy !== current) {
      console.log(`🔄 Nuevo proxy detectado: ${newProxy}`);
      setBaseUrl(newProxy);
    } else {
      console.log(`🟡 Proxy sin cambios: ${current}`);
    }
  } catch (err) {
    console.error("❌ Error en fetchLatestProxy:", err.message);
  }
}

function startProxyWatcher() {
  console.log("👀 Iniciando watcher automático de proxy DonTorrent...");
  fetchLatestProxy();
  setInterval(fetchLatestProxy, CHECK_INTERVAL);
}

module.exports = { startProxyWatcher };