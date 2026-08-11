import { DATOCMS_BASE_EDITING_URL } from 'astro:env/server';
import { defineMiddleware } from 'astro:middleware';
import { isDraftModeEnabled } from '~/lib/draftMode';

const baseEditingOrigin = new URL(DATOCMS_BASE_EDITING_URL).origin;

const DRAFT_PREFIX = '/__draft';

class DraftLinkRewriter {
  constructor(
    private attributeName: string,
    private origin: string,
  ) {}
  element(element: Element) {
    const value = element.getAttribute(this.attributeName);
    if (!value || value[0] === '#') return;
    try {
      const u = new URL(value, this.origin);
      if (u.origin !== this.origin) return;
      if (
        u.pathname.startsWith(`${DRAFT_PREFIX}/`) ||
        u.pathname.startsWith('/api/') ||
        u.pathname.startsWith('/_astro/')
      ) return;
      u.pathname = `${DRAFT_PREFIX}${u.pathname}`;
      element.setAttribute(this.attributeName, value[0] === '/' ? u.pathname + u.search + u.hash : u.toString());
    } catch { /* ignore malformed */ }
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;

  if (url.pathname.startsWith('/api/')) {
    const response = await next();
    response.headers.set(
      'Content-Security-Policy',
      `frame-ancestors 'self' https://plugins-cdn.datocms.com ${baseEditingOrigin}`,
    );
    return response;
  }

  const draft = await isDraftModeEnabled(context);
  const isDraftPath = url.pathname.startsWith(`${DRAFT_PREFIX}/`);
  const cleanPath = isDraftPath ? url.pathname.slice(DRAFT_PREFIX.length) || '/' : url.pathname;

  if (draft && !isDraftPath) {
    return context.redirect(`${DRAFT_PREFIX}${url.pathname}${url.search}`);
  }
  if (!draft && isDraftPath) {
    return context.redirect(`${cleanPath}${url.search}`);
  }

  let response: Response;

  if (isDraftPath) {
    response = await next(`${cleanPath}${url.search}`);
  } else {
    response = await next();
  }

  response.headers.set(
    'Content-Security-Policy',
    `frame-ancestors 'self' https://plugins-cdn.datocms.com ${baseEditingOrigin}`,
  );

  if (draft) {
    response.headers.set('Cache-Control', 'private, no-store');

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const rewriter = new HTMLRewriter()
        .on('a[href]', new DraftLinkRewriter('href', url.origin))
        .on('form[action]', new DraftLinkRewriter('action', url.origin));
      response = rewriter.transform(response);
    }
  } else {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, must-revalidate',
    );
  }

  return response;
});
