import { graphql } from '~/lib/datocms/graphql';

export const HeaderQuery = graphql(`
  query Header {
    about {
      __typename
    }
    contact {
      __typename
    }
    _allBlogPostsMeta {
      count
    }
  }
`);
