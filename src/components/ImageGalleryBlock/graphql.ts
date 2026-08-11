import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const ImageGalleryBlockFragment = graphql(
  /* GraphQL */ `
    fragment ImageGalleryBlockFragment on ImageGalleryBlockRecord {
      id
      images {
        title
        responsiveImage(imgixParams: { fit: max, w: 1200 }) {
          ...ResponsiveImageFragment
        }
        thumbnail: responsiveImage(imgixParams: { fit: max, w: 240 }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
