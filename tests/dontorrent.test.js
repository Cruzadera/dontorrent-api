const { fetchHtml, getBaseUrl } = require("../services/dontorrent");

module.exports = async function () {
  console.log("\n🧪 Test 1: donTorrent.js (fetchHtml + Tor)");

  try {
    const url = `${getBaseUrl()}/search/matrix`;

    const html = await fetchHtml(url);

    if (!html || html.length < 500) {
      console.log("❌ FAIL: HTML vacío o insuficiente");
      return;
    }

    console.log("✅ OK: fetchHtml devolvió contenido válido");
  } catch (err) {
    console.error("❌ Error en test 1:", err.message);
  }
};