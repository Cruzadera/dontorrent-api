const cheerio = require("cheerio");
const { getBaseUrl, fetchHtml } = require("../services/dontorrent.js");

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

module.exports = { search };