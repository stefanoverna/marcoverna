# marcoverna.studio

Portfolio site for **Marco Verna**, built with Astro 7, DatoCMS, and deployed on Cloudflare Workers.

## Tech stack

- **Framework**: [Astro 7](https://astro.build) (SSR)
- **CMS**: [DatoCMS](https://datocms.com) via `@datocms/cda-client` + `@datocms/astro`
- **Type-safe queries**: `gql.tada` with generated introspection types
- **Deploy**: Cloudflare Workers (`wrangler deploy`)

## Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run deploy           # Build + deploy to Cloudflare
npm run generate-schema  # Regenerate gql.tada introspection types
npm run generate-cma-types # Regenerate DatoCMS CMA types
```
