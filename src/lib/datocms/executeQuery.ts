import { rawExecuteQueryWithAutoPagination } from '@datocms/cda-client';
import {
  DATOCMS_DRAFT_CONTENT_CDA_TOKEN,
  DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
  DATOCMS_BASE_EDITING_URL,
} from 'astro:env/server';
import { isDraftModeEnabled } from '../draftMode';
import type { APIContext } from 'astro';
import type { TadaDocumentNode } from 'gql.tada';

export async function executeQuery<TResult, TVariables = Record<string, unknown>>(
  context: APIContext,
  query: TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const includeDrafts = await isDraftModeEnabled(context);

  const [result] = await rawExecuteQueryWithAutoPagination(query, {
    excludeInvalid: true,
    includeDrafts,
    token: includeDrafts
      ? DATOCMS_DRAFT_CONTENT_CDA_TOKEN
      : DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
    variables: variables as Record<string, unknown>,
    contentLink: includeDrafts ? 'v1' : undefined,
    baseEditingUrl: includeDrafts ? DATOCMS_BASE_EDITING_URL : undefined,
  });
  return result as TResult;
}
