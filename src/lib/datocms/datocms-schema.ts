import type { ItemTypeDefinition } from '@datocms/cma-client';

type EnvironmentSettings = {
  locales: 'en';
};

export type VideoBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'AwLhzovaQAyPO4SrKPwzDQ',
  {
    video: {
      type: 'video';
    };
  }
>;
export const VideoBlock = {
  ID: 'AwLhzovaQAyPO4SrKPwzDQ',
  REF: { type: 'item_type', id: 'AwLhzovaQAyPO4SrKPwzDQ' },
} as const;

export type About = ItemTypeDefinition<
  EnvironmentSettings,
  'Dn03LaJiQcqhujRX3__PDg',
  {
    image: {
      type: 'file';
    };
    bio: {
      type: 'structured_text';
    };
    clients: {
      type: 'gallery';
    };
    instagram_url: {
      type: 'string';
    };
  }
>;
export const About = {
  ID: 'Dn03LaJiQcqhujRX3__PDg',
  REF: { type: 'item_type', id: 'Dn03LaJiQcqhujRX3__PDg' },
} as const;

export type BlogPost = ItemTypeDefinition<
  EnvironmentSettings,
  'Ihd9XdOiQEO7YnU3Jy_FoQ',
  {
    cover_image: {
      type: 'file';
    };
    title: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
    content: {
      type: 'structured_text';
      blocks: VideoBlock | ImageBlock | ImageGalleryBlock;
    };
    seo: {
      type: 'seo';
    };
  }
>;
export const BlogPost = {
  ID: 'Ihd9XdOiQEO7YnU3Jy_FoQ',
  REF: { type: 'item_type', id: 'Ihd9XdOiQEO7YnU3Jy_FoQ' },
} as const;

export type Contact = ItemTypeDefinition<
  EnvironmentSettings,
  'Lig5X2chQiyak8UZ8lm45g',
  {
    studio_name: {
      type: 'string';
    };
    address: {
      type: 'text';
    };
    vat: {
      type: 'string';
    };
    phone: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
  }
>;
export const Contact = {
  ID: 'Lig5X2chQiyak8UZ8lm45g',
  REF: { type: 'item_type', id: 'Lig5X2chQiyak8UZ8lm45g' },
} as const;

export type ImageBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'S0kLg-DrScaUys-9HSeCNA',
  {
    image: {
      type: 'file';
    };
  }
>;
export const ImageBlock = {
  ID: 'S0kLg-DrScaUys-9HSeCNA',
  REF: { type: 'item_type', id: 'S0kLg-DrScaUys-9HSeCNA' },
} as const;

export type SchemaMigration = ItemTypeDefinition<
  EnvironmentSettings,
  'Ty0XrcgkS4KE8mbZUcoYIw',
  {
    name: {
      type: 'string';
    };
  }
>;
export const SchemaMigration = {
  ID: 'Ty0XrcgkS4KE8mbZUcoYIw',
  REF: { type: 'item_type', id: 'Ty0XrcgkS4KE8mbZUcoYIw' },
} as const;

export type Work = ItemTypeDefinition<
  EnvironmentSettings,
  'WJhw7cpJS1eoFXjLjgqvyw',
  {
    title: {
      type: 'string';
    };
    description: {
      type: 'structured_text';
    };
    cover_image: {
      type: 'file';
    };
    images: {
      type: 'gallery';
    };
    slug: {
      type: 'slug';
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const Work = {
  ID: 'WJhw7cpJS1eoFXjLjgqvyw',
  REF: { type: 'item_type', id: 'WJhw7cpJS1eoFXjLjgqvyw' },
} as const;

export type ImageGalleryBlock = ItemTypeDefinition<
  EnvironmentSettings,
  'bGLcPljkTb-TMhVVS-Nmyw',
  {
    images: {
      type: 'gallery';
    };
  }
>;
export const ImageGalleryBlock = {
  ID: 'bGLcPljkTb-TMhVVS-Nmyw',
  REF: { type: 'item_type', id: 'bGLcPljkTb-TMhVVS-Nmyw' },
} as const;

export type AnyBlock = VideoBlock | ImageBlock | ImageGalleryBlock;
export type AnyModel = About | BlogPost | Contact | SchemaMigration | Work;
export type AnyBlockOrModel = AnyBlock | AnyModel;
