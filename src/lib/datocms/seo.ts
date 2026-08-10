import type { TitleMetaLinkTag } from '@datocms/astro/Seo';

const SITE_NAME = 'Marco Verna Retouching Studio';

export function seoPageTitle(...chunks: string[]) {
  return (tags: TitleMetaLinkTag[]) =>
    [
      ...tags.filter((tag) => tag.tag !== 'title'),
      {
        tag: 'title',
        content: [...chunks, SITE_NAME].join(' — '),
        attributes: {},
      },
    ] as TitleMetaLinkTag[];
}

export function ensureTitle(...chunks: string[]) {
  return (tags: TitleMetaLinkTag[]) => {
    if (tags.some((tag) => tag.tag === 'title')) return tags;
    return seoPageTitle(...chunks)(tags);
  };
}
