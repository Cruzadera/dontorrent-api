const xmlbuilder = require("xmlbuilder");

function buildTorznabXML(items) {
  const feed = xmlbuilder.create("rss", { version: "1.0", encoding: "UTF-8" })
    .att("version", "2.0")
    .att("xmlns:torznab", "http://torznab.com/schemas/2015/feed");

  const channel = feed.ele("channel");
  channel.ele("title").txt("DonTorrent API");
  channel.ele("description").txt("Resultados scrapeados de DonTorrent");

  items.forEach((it) => {
    const item = channel.ele("item");
    item.ele("title").txt(it.title || "Sin título");
    item.ele("link").txt(it.link || "");
    item.ele("enclosure", {
      url: it.link || "",
      type: "application/x-bittorrent",
    });
    if (it.size) {
      item.ele("torznab:attr", { name: "size", value: it.size });
    }
  });

  return feed.end({ pretty: true });
}

module.exports = { buildTorznabXML };