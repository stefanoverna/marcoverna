import { ImageBlockFragment } from '~/components/ImageBlock';
import { ImageGalleryBlockFragment } from '~/components/ImageGalleryBlock';
import { VideoBlockFragment } from '~/components/VideoBlock';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const BlogPostQuery = graphql(
  /* GraphQL */ `
    query BlogPost($slug: String!) {
      blogPost(filter: { slug: { eq: $slug } }) {
        title
        _firstPublishedAt
        coverImage {
          responsiveImage(imgixParams: { w: 1200 }) {
            ...ResponsiveImageFragment
          }
        }
        content {
          value
          blocks {
            ... on RecordInterface {
              id
              __typename
            }
            ...ImageBlockFragment
            ...ImageGalleryBlockFragment
            ...VideoBlockFragment
          }
        }
        seo: _seoMetaTags { attributes content tag }
      }
    }
  `,
  [ImageBlockFragment, ImageGalleryBlockFragment, VideoBlockFragment, ResponsiveImageFragment],
);
