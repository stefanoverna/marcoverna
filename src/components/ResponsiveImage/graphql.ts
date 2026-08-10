import { graphql } from '~/lib/datocms/graphql';

export const ResponsiveImageFragment = graphql(/* GraphQL */ `
  fragment ResponsiveImageFragment on ResponsiveImage {
    src
    srcSet
    width
    height
    alt
    title
    base64
    sizes
  }
`);
