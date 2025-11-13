const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { setBaseUrl, getBaseUrl } = require("./dontorrent.js");

const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hora
const DONPROXIES_URL = "https://donproxies.com/";
const FLARESOLVERR_URL = process.env.FLARESOLVERR_URL || "http://127.0.0.1:8191/v1";

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000,
    });
    return await res.text();
  } catch {
    console.log("🌐 Reintentando con Flaresolverr...");
    try {
      const body = { cmd: "request.get", url, maxTimeout: 60000 };
      const resp = await fetch(FLARESOLVERR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      return data?.solution?.response || "";
    } catch (err2) {
      console.error("❌ Error en Flaresolverr:", err2.message);
      return "";
    }
  }
}

// ✔ Validación del proxy
async function proxyWorks(base) {
  const testUrl = `${base}/search/matrix`;

  const html = await fetchPage(testUrl);

  if (!html) return false;

  // indicios de página REAL de DonTorrent
  if (
    html.includes("poster") ||
    html.includes("pelicula") ||
    html.includes("torrent") ||
    html.includes("Tamaño")
  ) {
    return true;
  }

  // páginas de error
  if (html.includes("Ups...") || html.includes("Error del Servidor")) {
    return false;
  }

  return false;
}

async function fetchLatestProxy() {
  console.log("🔎 Buscando nuevo proxy en donproxies.com...");

  const html = await fetchPage(DONPROXIES_URL);
  const $ = cheerio.load(html);

  // ✔ Selecciona nuevos proxys válidos
  const proxies = $("a[href*='don.mirror.pm']")
    .map((_, el) => $(el).attr("href").replace(/\/$/, ""))
    .get();

  if (!proxies.length) {
    console.warn("⚠️ No se encontraron proxys.");
    return;
  }

  console.log("🔍 Proxies encontrados:", proxies);

  const current = getBaseUrl();

  // ✔ probar cada proxy
  for (const proxy of proxies) {
    console.log(`🧪 Probando proxy: ${proxy}`);
    const ok = await proxyWorks(proxy);

    if (ok) {
      if (proxy !== current) {
        console.log(`✅ Proxy funcional detectado: ${proxy}`);
        setBaseUrl(proxy);
      } else {
        console.log(`🟡 El proxy actual sigue funcionando: ${current}`);
      }
      return;
    }

    console.log(`❌ Proxy inválido: ${proxy}`);
  }

  console.log("⚠️ Ningún proxy funcional encontrado.");
}

function startProxyWatcher() {
  console.log("👀 Iniciando watcher de proxys...");
  fetchLatestProxy();
  setInterval(fetchLatestProxy, CHECK_INTERVAL);
}

module.exports = { startProxyWatcher };