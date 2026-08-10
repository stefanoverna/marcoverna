import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const BlogIndexQuery = graphql(
  /* GraphQL */ `
    query BlogIndex {
      allBlogPosts(orderBy: _firstPublishedAt_DESC) {
        slug
        title
        _firstPublishedAt
        coverImage {
          responsiveImage(imgixParams: { w: 1200 }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
