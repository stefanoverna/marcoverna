const IG_APP_ID = "936619743392459";
const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const BASE = "https://www.instagram.com";

export interface InstagramPost {
  id: string;
  code: string;
  displayUri: string;
  proxiedUri: string;
  caption: string;
  mediaType: number;
  permalink: string;
}

function headers() {
  return {
    "User-Agent": USER_AGENT,
    "Accept": "application/json",
    "X-IG-App-ID": IG_APP_ID,
  };
}

async function getUserId(username: string): Promise<string> {
  const profileUrl = `${BASE}/${username}/`;
  console.log(`[instagram] fetching profile: ${profileUrl}`);
  const res = await fetch(profileUrl, { headers: headers() });
  console.log(`[instagram] profile status: ${res.status}`);
  const html = await res.text();
  console.log(`[instagram] profile HTML: ${html.length} bytes`);
  const match = html.match(/"id":"(\d+)"/);
  if (!match) throw new Error(`Could not find user ID for @${username}`);
  console.log(`[instagram] found user ID: ${match[1]}`);
  return match[1];
}

export async function getInstagramFeed(username: string, count = 9): Promise<InstagramPost[]> {
  const userId = await getUserId(username);

  const feedUrl = `${BASE}/api/v1/feed/user/${userId}/?count=${count}`;
  console.log(`[instagram] fetching feed: ${feedUrl}`);
  const res = await fetch(feedUrl, {
    headers: {
      ...headers(),
      "Referer": `${BASE}/${username}/`,
    },
  });

  console.log(`[instagram] feed status: ${res.status}`);
  if (!res.ok) throw new Error(`Instagram feed fetch failed: ${res.status}`);

  const data = await res.json();
  const items: any[] = data.items || [];
  console.log(`[instagram] got ${items.length} posts (more available: ${data.more_available})`);

  return items.slice(0, count).map((item: any) => ({
    id: item.id || item.pk,
    code: item.code,
    displayUri: item.display_uri,
    proxiedUri: `/api/instagram-image?url=${encodeURIComponent(item.display_uri)}`,
    caption: item.caption?.text || "",
    mediaType: item.media_type,
    permalink: `https://www.instagram.com/p/${item.code}/`,
  }));
}
