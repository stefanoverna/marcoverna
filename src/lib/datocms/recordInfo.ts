import type { RawApiTypes } from '@datocms/cma-client';
import { About, BlogPost, Contact, Work, type AnyModel } from './datocms-schema';

export async function recordToWebsiteRoute(
  item: RawApiTypes.Item<AnyModel>,
  _locale: string,
): Promise<string | null> {
  switch (item.__itemTypeId) {
    case About.ID:
      return '/about';

    case BlogPost.ID:
      return `/blog/${item.attributes.slug}`;

    case Contact.ID:
      return '/contact';

    case Work.ID:
      return `/work/${item.attributes.slug}`;

    default:
      return null;
  }
}
