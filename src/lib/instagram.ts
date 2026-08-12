import { APIFY_API_TOKEN } from 'astro:env/server';

const ACTOR_ID = 'shu8hvrXbJbY3Eb9W';

export interface InstagramPost {
  id: string;
  code: string;
  displayUri: string;
  proxiedUri: string;
  caption: string;
  permalink: string;
}

export async function getInstagramFeed(): Promise<InstagramPost[]> {
  const url = `https://api.apify.com/v2/actors/${ACTOR_ID}/runs/last/dataset/items?token=${APIFY_API_TOKEN}&status=SUCCEEDED&clean=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Apify fetch failed: ${res.status}`);

  const items: any[] = await res.json();

  // Apify returns the dataset in scrape order, not chronological order
  const postedAt = (item: any) =>
    item.timestamp ? Date.parse(item.timestamp) || 0 : 0;

  items.sort((a, b) => postedAt(b) - postedAt(a));

  return items.map((item: any) => ({
    id: item.id,
    code: item.shortCode,
    displayUri: item.displayUrl,
    proxiedUri: `/api/instagram-image?url=${encodeURIComponent(item.displayUrl)}`,
    caption: item.caption || '',
    permalink: item.url,
  }));
}
