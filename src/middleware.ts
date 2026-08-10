import { DATOCMS_BASE_EDITING_URL } from 'astro:env/server';
import { defineMiddleware } from 'astro:middleware';
import { isDraftModeEnabled } from '~/lib/draftMode';

const baseEditingOrigin = new URL(DATOCMS_BASE_EDITING_URL).origin;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  response.headers.set(
    'Content-Security-Policy',
    `frame-ancestors 'self' https://plugins-cdn.datocms.com ${baseEditingOrigin}`,
  );

  if (context.url.pathname.startsWith('/api/')) {
    return response;
  }

  const draft = await isDraftModeEnabled(context);

  response.headers.set(
    'Cache-Control',
    'private, no-cache, no-store, must-revalidate',
  );
  
  // response.headers.set(
  //   'Cache-Control',
  //   'public, max-age=60, stale-while-revalidate=3600',
  // );

  return response;
});
