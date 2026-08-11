// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  cache: {
    provider: { entrypoint: './src/debug-cache-provider.ts' },
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
