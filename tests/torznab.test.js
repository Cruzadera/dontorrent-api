const { search } = require("../services/torznab");

module.exports = async function () {
  console.log("\n🧪 Test 2: torznab.js (search)");

  try {
    const results = await search("matrix");

    if (!Array.isArray(results)) {
      console.log("❌ FAIL: search() no devolvió un array");
      return;
    }

    if (results.length === 0) {
      console.log("⚠️ WARN: 0 resultados (puede ser normal si DonTorrent está vacío)");
    } else {
      console.log(`✅ OK: ${results.length} resultados encontrados`);
    }
  } catch (err) {
    console.error("❌ Error en test 2:", err.message);
  }
};
