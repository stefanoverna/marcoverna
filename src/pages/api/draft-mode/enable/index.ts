import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { enableDraftMode, withDraftPrefix } from '~/lib/draftMode';
import {
  handleUnexpectedError,
  invalidRequestResponse,
  isRelativeUrl,
} from '../../utils';

export const GET: APIRoute = async (event) => {
  const { url } = event;

  const token = url.searchParams.get('token');
  const redirectUrl = url.searchParams.get('redirect') || '/';

  try {
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    if (!isRelativeUrl(redirectUrl)) {
      return invalidRequestResponse('URL must be relative!', 422);
    }

    await enableDraftMode(event);
  } catch (error) {
    return handleUnexpectedError(error);
  }

  return event.redirect(withDraftPrefix(redirectUrl), 307);
};
