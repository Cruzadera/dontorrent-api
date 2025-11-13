const fetch = require("node-fetch");
const { SocksProxyAgent } = require("socks-proxy-agent");

const BASE_URL = "http://dontorufwmbqhnoe2wvko5ynis6axf7bqod6wkmdvxmjyek64tantlqd.onion";

const USING_TOR = process.env.USE_TOR === "true";
const TOR_PROXY = process.env.TOR_PROXY || "socks5h://tor:9050";

console.log("🧅 Tor activado:", USING_TOR);
console.log("🔗 DonTorrent Onion:", BASE_URL);

function getBaseUrl() {
  return BASE_URL;
}

function getAgent() {
  return USING_TOR ? new SocksProxyAgent(TOR_PROXY) : undefined;
}

async function fetchHtml(url) {
  try {
    console.log("🌐 GET:", url);

    const response = await fetch(url, {
      agent: getAgent(),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
      timeout: 40000,
    });

    const html = await response.text();

    return html;
  } catch (err) {
    console.error("❌ Error en fetchHtml:", err.message);
    return "";
  }
}

module.exports = { getBaseUrl, fetchHtml };