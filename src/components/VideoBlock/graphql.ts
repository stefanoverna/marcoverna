import { graphql } from '~/lib/datocms/graphql';

export const VideoBlockFragment = graphql(/* GraphQL */ `
  fragment VideoBlockFragment on VideoBlockRecord {
    id
    _editingUrl
    video {
      provider
      providerUid
      thumbnailUrl
    }
  }
`);
