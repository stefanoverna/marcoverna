import { rawExecuteQueryWithAutoPagination } from '@datocms/cda-client';
import { DATOCMS_CDA_TOKEN } from 'astro:env/server';
import type { TadaDocumentNode } from 'gql.tada';

export async function executeQuery<TResult, TVariables = Record<string, unknown>>(
  query: TadaDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const [result] = await rawExecuteQueryWithAutoPagination(query, {
    excludeInvalid: true,
    includeDrafts: import.meta.env.DEV,
    token: DATOCMS_CDA_TOKEN,
    variables,
  });
  return result;
}
