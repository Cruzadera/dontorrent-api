const { spawn } = require("child_process");

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runTest(name) {
  const test = require(`./${name}`);
  await test();
}

(async () => {

  // 1. Arrancar API temporalmente
  console.log("🚀 Starting API for tests...");

  const api = spawn("node", ["index.js"], {
    env: { ...process.env, PORT: 8085 },
  });

  // Esperar a que arranque
  await wait(5000);

  // === Tests ===
  await runTest("dontorrent.test.js");
  await runTest("torznab.test.js");
  await runTest("api.test.js");

  console.log("\n✅ All tests completed. Killing API...");
  api.kill("SIGTERM");
})();
