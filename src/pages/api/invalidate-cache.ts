import { CACHE_INVALIDATION_WEBHOOK_SECRET } from 'astro:env/server';
import type { APIRoute } from 'astro';
import { withCORS } from './utils';

type CdaCacheTagsInvalidateWebhook = {
  entity_type: 'cda_cache_tags';
  event_type: 'invalidate';
  entity: {
    id: 'cda_cache_tags';
    type: 'cda_cache_tags';
    attributes: {
      tags: string[];
    };
  };
};

export const POST: APIRoute = async ({ request, cache }) => {
  if (
    request.headers.get('Authorization') !==
    `Bearer ${CACHE_INVALIDATION_WEBHOOK_SECRET}`
  ) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      {
        status: 401,
        ...withCORS(),
      },
    );
  }

  let body: CdaCacheTagsInvalidateWebhook;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON' }),
      {
        status: 400,
        ...withCORS(),
      },
    );
  }

  const tags = body.entity.attributes.tags;

  if (!tags.length) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing tags' }),
      {
        status: 400,
        ...withCORS(),
      },
    );
  }

  await cache.invalidate({ tags });

  return new Response(
    JSON.stringify({ success: true, invalidated: tags.length }),
    withCORS(),
  );
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    ...withCORS(),
  });
};
