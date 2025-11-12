const { create } = require("xmlbuilder2");

function buildTorznabXML(items) {
  const feed = {
    rss: {
      "@version": "2.0",
      "@xmlns:torznab": "http://torznab.com/schemas/2015/feed",
      channel: {
        title: "DonTorrent API",
        description: "Resultados scrapeados de DonTorrent",
        item: items.map((it) => ({
          title: it.title,
          link: it.link,
          enclosure: { "@url": it.link, "@type": "application/x-bittorrent" },
          "torznab:attr": [
            { "@name": "size", "@value": it.size || "unknown" },
          ],
        })),
      },
    },
  };

  return create(feed).end({ prettyPrint: true });
}

module.exports = { buildTorznabXML };