// @ts-check
import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    ssr: {
      noExternal: ['@datocms/astro'],
    },
  },
  env: {
    schema: {
      DATOCMS_CDA_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
      APIFY_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
});
