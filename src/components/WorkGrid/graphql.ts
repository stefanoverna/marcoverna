import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const WorkFragment = graphql(
  /* GraphQL */ `
    fragment WorkFragment on WorkRecord {
      id
      slug
      title
      coverImage {
        responsiveImage(imgixParams: { fit: max, w: 800 }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
