const fetch = require("node-fetch");
const cheerio = require("cheerio");

let BASE_URL = "https://11b1-don.mirror.pm";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function getBaseUrl() {
  return BASE_URL;
}

function setBaseUrl(url) {
  BASE_URL = url;
  console.log(`🌐 BASE_URL actualizado a: ${BASE_URL}`);
}

async function getTorrents(query) {
  const searchUrl = `${BASE_URL}/search/${encodeURIComponent(query)}`;
  console.log(`🔍 Buscando en ${searchUrl}`);
  
  const response = await fetch(searchUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  const html = await response.text();

  if (html.includes("cf-browser-verification") || html.includes("<title>Just a moment")) {
    console.warn("⚠️ Cloudflare bloqueó la petición. Posible cambio de dominio.");
    return [];
  }

  const $ = cheerio.load(html);
  const results = [];

  $(".content .pelicula").each((_, el) => {
    const title = $(el).find(".poster a").attr("title")?.trim();
    const href = $(el).find(".poster a").attr("href");
    const link = BASE_URL + href;
    const size = $(el).find(".extra span:contains('Tamaño')").text().replace("Tamaño:", "").trim();
    if (title && href) results.push({ title, link, size });
  });

  return results;
}

module.exports = { getTorrents, setBaseUrl, getBaseUrl };