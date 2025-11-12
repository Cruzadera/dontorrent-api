const { getTorrents, getBaseUrl } = require("../services/dontorrent.js");

(async () => {
  console.log("🔍 Testing DonTorrent scraper...");
  const query = process.argv[2] || "matrix";

  try {
    const results = await getTorrents(query);
    if (!results || results.length === 0) {
      console.log(`⚠️  No results found or blocked. Current base: ${getBaseUrl()}`);
    } else {
      console.log(`✅ Found ${results.length} results from ${getBaseUrl()}`);
      results.slice(0, 3).forEach((r, i) => {
        console.log(`${i + 1}. ${r.title}`);
        console.log(`   ↳ ${r.link}`);
      });
    }
  } catch (err) {
    console.error("❌ Error during scraping:", err);
  }
})();
