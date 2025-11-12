const fetch = require("node-fetch");
const cheerio = require("cheerio");

const BASE_URL = "https://dontorrent.lat"; // cambia si DonTorrent cambia dominio

async function getTorrents(query) {
  const searchUrl = `${BASE_URL}/search/${encodeURIComponent(query)}`;
  const response = await fetch(searchUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await response.text();

  const $ = cheerio.load(html);
  const results = [];

  $(".content .pelicula").each((_, el) => {
    const title = $(el).find(".poster a").attr("title")?.trim();
    const href = $(el).find(".poster a").attr("href");
    const link = BASE_URL + href;
    const image = $(el).find("img").attr("src");
    const size = $(el).find(".extra span:contains('Tamaño')").text().replace("Tamaño:", "").trim();
    const torrentUrl = link; // luego scrapearemos el .torrent real si quieres

    results.push({
      title,
      link: torrentUrl,
      size,
      image,
    });
  });

  return results;
}

module.exports = { getTorrents };
