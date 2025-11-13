const fetch = require("node-fetch");

module.exports = async function () {
  console.log("\n🧪 Test 3: API /torznab");

  try {
    const res = await fetch("http://localhost:8085/torznab?q=matrix");
    const xml = await res.text();

    if (!xml.startsWith("<?xml")) {
      console.log("❌ FAIL: No devolvió XML");
      return;
    }

    console.log("✅ OK: XML recibido");
    console.log(xml.substring(0, 200) + "...");
  } catch (err) {
    console.error("❌ Error en test 3:", err.message);
  }
};
