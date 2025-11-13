const fetch = require("node-fetch");
const { SocksProxyAgent } = require("socks-proxy-agent");

const USING_TOR = process.env.USE_TOR === "true";
const TOR_PROXY = process.env.TOR_PROXY || "socks5h://tor:9050";

const BASE_URL = "http://dontorufwmbqhnoe2wvko5ynis6axf7bqod6wkmdvxmjyek64tantlqd.onion";

function getBaseUrl() {
  return BASE_URL;
}

function getAgent() {
  return USING_TOR ? new SocksProxyAgent(TOR_PROXY) : undefined;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    agent: getAgent(),
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  return await res.text();
}

module.exports = {
  getBaseUrl,
  fetchHtml,
};