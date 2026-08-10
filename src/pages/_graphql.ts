import { WorkFragment } from '~/components/WorkGrid';
import { graphql } from '~/lib/datocms/graphql';

export const HomeQuery = graphql(
  /* GraphQL */ `
    query Home {
      allWorks(first: 100, orderBy: position_ASC) {
        ...WorkFragment
      }
    }
  `,
  [WorkFragment],
);
