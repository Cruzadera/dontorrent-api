const { spawn } = require("child_process");

async function startApi() {
  console.log("🚀 Starting API for tests...");
  return new Promise((resolve, reject) => {
    const api = spawn("node", ["index.js"], { stdio: ["pipe", "pipe", "inherit"] });
    let buffer = "";

    api.stdout.on("data", (data) => {
      const text = data.toString();
      buffer += text;
      process.stdout.write(text);
      if (text.includes("DonTorrent API running on port")) {
        console.log("✅ API started successfully!");
        resolve(api);
      }
    });

    api.on("error", reject);
    setTimeout(() => reject(new Error("⏱️ Timeout waiting for API to start")), 10000);
  });
}

async function runTests(api) {
  const tests = [
    "tests/scraper.test.js",
    "tests/proxyWatcher.test.js",
    "tests/api.test.js",
  ];

  for (const t of tests) {
    console.log(`\n🧩 Running ${t}`);
    await new Promise((resolve) => {
      const child = spawn("node", [t], { stdio: "inherit" });
      child.on("exit", () => resolve());
    });
  }

  console.log("\n✅ All tests completed. Killing API...\n");
  api.kill("SIGINT");
}

(async () => {
  try {
    const api = await startApi();
    await runTests(api);
  } catch (err) {
    console.error("❌ Error starting API:", err.message);
  }
})();
