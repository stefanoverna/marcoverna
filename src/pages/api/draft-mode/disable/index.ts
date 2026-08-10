import type { APIRoute } from 'astro';
import { disableDraftMode } from '~/lib/draftMode';
import { handleUnexpectedError, invalidRequestResponse, isRelativeUrl } from '../../utils';

export const GET: APIRoute = (event) => {
  const { url } = event;
  const redirectUrl = url.searchParams.get('redirect') || '/';

  try {
    if (!isRelativeUrl(redirectUrl)) {
      return invalidRequestResponse('URL must be relative!', 422);
    }

    disableDraftMode(event);
  } catch (error) {
    return handleUnexpectedError(error);
  }

  return event.redirect(`${redirectUrl}?__preview=${Date.now()}`, 307);
};
