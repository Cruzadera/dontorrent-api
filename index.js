const express = require("express");
const { search, buildTorznabXML } = require("./utils/torznab.js");

const app = express();
const PORT = process.env.PORT || 8085;

app.get("/torznab", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send("Missing ?q parameter");
  }

  try {
    console.log("🔍 Torznab query:", query);

    const results = await search(query);        // Scraper
    const xml = buildTorznabXML(results);       // XML Torznab

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("❌ Error en /torznab:", err);
    res.status(500).send("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`DonTorrent API running on port ${PORT}`);
});