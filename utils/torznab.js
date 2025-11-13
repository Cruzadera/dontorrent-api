const cheerio = require("cheerio");
const { getBaseUrl, fetchHtml } = require("../services/dontorrent.js");

// --- Scraper: HTML -> [{ title, magnet }]
async function search(query) {
  const base = getBaseUrl();
  const url = `${base}/search/${encodeURIComponent(query)}`;

  console.log("🔍 Buscando:", url);

  const html = await fetchHtml(url);

  if (!html || html.length < 1000) {
    console.log("⚠️ HTML vacío o inválido");
    return [];
  }

  const $ = cheerio.load(html);
  const results = [];


  $(".list-group .list-group-item").each((i, item) => {
    const title = $(item).find(".titulo").text().trim();
    const magnet = $(item).find("a[href*='magnet']").attr("href");

    if (title && magnet) {
      results.push({ title, magnet });
    }
  });

  return results;
}


function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}


function buildTorznabXML(results = []) {
  const items = results
    .map(
      (r) => `
    <item>
      <title>${escapeXml(r.title)}</title>
      <guid>${escapeXml(r.magnet)}</guid>
      <link>${escapeXml(r.magnet)}</link>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:torznab="http://torznab.com/schemas/2015/feed">
  <channel>
    <title>DonTorrent API</title>
    <description>Resultados scrapeados de DonTorrent</description>
    ${items}
  </channel>
</rss>`;
}

module.exports = { search, buildTorznabXML };
