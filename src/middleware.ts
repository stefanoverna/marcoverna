import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=3600',
  );
  return response;
});
