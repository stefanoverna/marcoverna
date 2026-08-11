import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { deserializeRawItem } from '@datocms/rest-client-utils';
import { recordToWebsiteRoute } from '~/lib/datocms/recordInfo';
import {
  handleUnexpectedError,
  invalidRequestResponse,
  json,
  withCORS,
} from '../utils';

export const OPTIONS: APIRoute = () => {
  return new Response('OK', withCORS());
};

type PreviewLink = {
  label: string;
  url: string;
  reloadPreviewOnRecordUpdate?: boolean | { delayInMs: number };
};

type WebPreviewsResponse = {
  previewLinks: PreviewLink[];
};

export const POST: APIRoute = async ({ url, request }) => {
  try {
    const token = url.searchParams.get('token');

    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const body = (await request.json()) as Record<string, any>;
    const recordUrl = await recordToWebsiteRoute(
      deserializeRawItem(body.item),
      body.locale,
    );

    const response: WebPreviewsResponse = { previewLinks: [] };

    if (recordUrl) {
      if (body.item.meta.status !== 'published') {
        response.previewLinks.push({
          label: 'Draft version',
          url: new URL(
            `/api/draft-mode/enable?redirect=${recordUrl}&token=${token}`,
            request.url,
          ).toString(),
        });
      }

      if (body.item.meta.status !== 'draft') {
        response.previewLinks.push({
          label: 'Published version',
          url: new URL(
            `/api/draft-mode/disable?redirect=${recordUrl}`,
            request.url,
          ).toString(),
        });
      }
    }

    return json(response, withCORS());
  } catch (error) {
    return handleUnexpectedError(error);
  }
};
