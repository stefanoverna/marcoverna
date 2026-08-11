import type { APIContext, AstroCookies } from 'astro';
import { DRAFT_MODE_COOKIE_NAME } from 'astro:env/client';
import { SIGNED_COOKIE_JWT_SECRET } from 'astro:env/server';
import { SignJWT, jwtVerify } from 'jose';

export const DRAFT_PREFIX = '/__draft';

export function hasDraftPrefix(path: string): boolean {
  return path.startsWith(`${DRAFT_PREFIX}/`) || path === DRAFT_PREFIX;
}

export function withoutDraftPrefix(path: string): string {
  if (path.startsWith(DRAFT_PREFIX)) {
    return path.slice(DRAFT_PREFIX.length) || '/';
  }
  return path;
}

const DRAFT_INTERNAL_PREFIXES = ['/api/', '/_astro/'];

function isDraftInternalPath(path: string): boolean {
  return DRAFT_INTERNAL_PREFIXES.some((p) => path.startsWith(p));
}

export function withDraftPrefix(path: string): string {
  if (hasDraftPrefix(path) || isDraftInternalPath(path)) return path;
  return `${DRAFT_PREFIX}${path}`;
}

const secretKey = new TextEncoder().encode(SIGNED_COOKIE_JWT_SECRET);

async function jwtToken() {
  return new SignJWT({ enabled: true })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretKey);
}

export async function enableDraftMode(context: APIContext) {
  context.cookies.set(DRAFT_MODE_COOKIE_NAME, await jwtToken(), {
    path: '/',
    sameSite: 'none',
    httpOnly: false,
    secure: true,
    partitioned: true,
  });
}

export function disableDraftMode(context: APIContext) {
  context.cookies.delete(DRAFT_MODE_COOKIE_NAME, {
    path: '/',
    sameSite: 'none',
    httpOnly: false,
    secure: true,
    partitioned: true,
  });
}

export async function isDraftModeEnabled(
  contextOrCookies: APIContext | AstroCookies,
) {
  const cookies =
    'cookies' in contextOrCookies ? contextOrCookies.cookies : contextOrCookies;

  const cookie = cookies.get(DRAFT_MODE_COOKIE_NAME);

  if (!cookie) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(cookie.value, secretKey);
    return payload.enabled as boolean;
  } catch {
    return false;
  }
}

export async function draftModeHeaders(): Promise<HeadersInit> {
  return {
    Cookie: `${DRAFT_MODE_COOKIE_NAME}=${await jwtToken()};`,
  };
}
