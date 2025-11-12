const fetch = require("node-fetch");
const { XMLValidator } = require("fast-xml-parser");

(async () => {
  const url = "http://localhost:8085/torznab?q=matrix";
  console.log(`🌐 Testing API endpoint: ${url}`);

  try {
    const res = await fetch(url);
    const text = await res.text();

    const validation = XMLValidator.validate(text);
    if (validation === true) {
      console.log("✅ XML Torznab response OK");
      console.log(text.slice(0, 200) + "...");
    } else {
      console.log("⚠️ XML invalid or unexpected content");
      console.log(validation.err);
      console.log(text.slice(0, 200) + "...");
    }
  } catch (err) {
    console.error("❌ Error calling API:", err.message);
  }
})();
