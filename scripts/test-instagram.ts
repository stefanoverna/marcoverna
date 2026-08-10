const TOKEN = process.env.IG_TOKEN;

if (!TOKEN) {
  console.error("Set IG_TOKEN env var:\n  IG_TOKEN=your_long_lived_token npx tsx scripts/test-instagram.ts");
  process.exit(1);
}

const GRAPH = "https://graph.instagram.com";

async function refreshToken(token: string) {
  const url = `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
  console.log("[refresh] GET", url.replace(token, "***"));
  const res = await fetch(url);
  const json = await res.json() as any;
  console.log("[refresh]", JSON.stringify(json, null, 2));
  return json.access_token || token;
}

async function fetchMedia(token: string) {
  const url = `${GRAPH}/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`;
  console.log("[media] GET", url.replace(token, "***"));
  const res = await fetch(url);
  const json = await res.json() as any;
  console.log("[media]", JSON.stringify(json, null, 2));
  return json.data || [];
}

async function main() {
  console.log("=== Instagram token refresh + feed test ===\n");

  const refreshed = await refreshToken(TOKEN);
  console.log("");

  const media = await fetchMedia(refreshed);
  console.log(`\nFetched ${media.length} posts.`);
}

main().catch(console.error);
