export const prerender = false;

export async function GET({ url }: { url: URL }) {
  const imageUrl = url.searchParams.get('url');
  if (!imageUrl) return new Response('Missing ?url=', { status: 400 });

  try {
    const upstream = new URL(imageUrl);
    const response = await fetch(upstream, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      return new Response('Not Found', { status: 404 });
    }
    if (!response.ok) {
      return new Response('Not Found', { status: 404 });
    }

    const ct = response.headers.get('Content-Type') ?? '';
    const headers = new Headers();
    headers.set('Content-Type', ct);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    const etag = response.headers.get('ETag');
    if (etag) headers.set('ETag', etag);

    return new Response(response.body, { status: 200, headers });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
}
