import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const WorkDetailQuery = graphql(
  /* GraphQL */ `
    query WorkDetail($slug: String!) {
      work(filter: { slug: { eq: $slug } }) {
        title
        description {
          value
        }
        images {
          responsiveImage(imgixParams: { fit: max, w: 750 }) {
            ...ResponsiveImageFragment
          }
        }
        seo: _seoMetaTags {
          attributes
          content
          tag
        }
      }
      allWorks(first: 10, orderBy: position_ASC) {
        slug
        title
        coverImage {
          responsiveImage(imgixParams: { fit: max, w: 800 }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
