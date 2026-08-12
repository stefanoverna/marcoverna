// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import { defineConfig, envField, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [400, 600, 700],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Open Sans',
      cssVariable: '--font-open-sans',
      weights: [400, 600, 700],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    },
  ],
  cache: {
    provider: cacheCloudflare(),
  },
  vite: {
    ssr: {
      noExternal: ['@datocms/astro'],
    },
  },
  env: {
    schema: {
      DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATOCMS_DRAFT_CONTENT_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SECRET_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SIGNED_COOKIE_JWT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DRAFT_MODE_COOKIE_NAME: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: 'datocms-draft-mode',
      }),
      DATOCMS_BASE_EDITING_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: 'https://foobar.admin.datocms.com',
      }),
      APIFY_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      CACHE_INVALIDATION_WEBHOOK_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
  security: {
    checkOrigin: false,
  },
});
