import { rawExecuteQueryWithAutoPagination } from '@datocms/cda-client';
import type { APIContext } from 'astro';
import {
  DATOCMS_BASE_EDITING_URL,
  DATOCMS_DRAFT_CONTENT_CDA_TOKEN,
  DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
} from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';
import { isDraftModeEnabled } from '../draftMode';

export async function executeQuery<
  TResult,
  TVariables = Record<string, unknown>,
>(
  context: APIContext,
  query: TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  label?: string,
): Promise<TResult> {
  try {
    const includeDrafts = await isDraftModeEnabled(context);
    const prefix = `[executeQuery${label ? `:${label}` : ''}]`;

    console.log(`${prefix} starting, includeDrafts=${includeDrafts}`);

    const [result, response] = await rawExecuteQueryWithAutoPagination(query, {
      excludeInvalid: true,
      includeDrafts,
      returnCacheTags: true,
      token: includeDrafts
        ? DATOCMS_DRAFT_CONTENT_CDA_TOKEN
        : DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
      variables: variables as Record<string, unknown>,
      contentLink: includeDrafts ? 'v1' : undefined,
      baseEditingUrl: includeDrafts ? DATOCMS_BASE_EDITING_URL : undefined,
    });

    const rawTags = response.headers.get('x-cache-tags');
    const cacheTags = rawTags ? rawTags.split(' ') : [];
    console.log(
      `${prefix} x-cache-tags from DatoCMS: ${rawTags || '(none)'} (${cacheTags.length} tags)`,
    );

    if (!includeDrafts && cacheTags.length > 0) {
      const before = context.cache.tags.length;
      context.cache.set({ maxAge: 31536000, tags: cacheTags });
      const after = context.cache.tags.length;
      console.log(
        `${prefix} AstroCache: tags went from ${before} to ${after} (added ${after - before})`,
      );
    } else {
      console.log(
        `${prefix} skipped cache.set (includeDrafts=${includeDrafts}, tags=${cacheTags.length})`,
      );
    }

    return result as TResult;
  } catch (e) {
    console.log(label);
    throw e;
  }
}
