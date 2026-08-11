import { graphql } from '~/lib/datocms/graphql';
import { FooterFragment } from '~/components/Footer';

export const LayoutQuery = graphql(
  `
    query Layout {
      _site {
        favicon: faviconMetaTags {
          attributes
          content
          tag
        }
      }
      ...FooterFragment
    }
  `,
  [FooterFragment],
);
