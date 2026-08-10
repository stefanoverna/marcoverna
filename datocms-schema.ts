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
    excerpt: {
      type: 'text';
    };
    content: {
      type: 'structured_text';
      blocks: VideoBlock | ImageBlock | ImageGalleryBlock;
    };
    cover: {
      type: 'file';
    };
    seo: {
      type: 'seo';
    };
    position: {
      type: 'integer';
    };
  }
>;
export const BlogPost = {
  ID: 'Ihd9XdOiQEO7YnU3Jy_FoQ',
  REF: { type: 'item_type', id: 'Ihd9XdOiQEO7YnU3Jy_FoQ' },
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
export type AnyModel = BlogPost;
export type AnyBlockOrModel = AnyBlock | AnyModel;
