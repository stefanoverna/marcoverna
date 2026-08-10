# AGENTS.md

## Tech stack

- **Framework**: Astro 7 with SSR (Cloudflare adapter)
- **CMS**: DatoCMS via `@datocms/cda-client` + `@datocms/astro`
- **Type-safe queries**: `gql.tada` with generated introspection types
- **Deploy**: Cloudflare Workers (`wrangler deploy`)
- **Styling**: CSS modules (`.module.css`) with camelCase class names; global resets in `src/styles/global.css`

## Directory conventions

```
src/
  components/
    Foo/
      Component.astro       # the Astro component
      style.module.css      # CSS module for this component
      graphql.ts            # FragmentOf definitions (queries NOT allowed here)
      index.ts              # barrel: exports both component AND fragment
  styles/
    global.css              # global resets, CSS custom properties, element defaults
  layouts/
    Layout.astro        # layout component
    _graphql.ts         # layout-level query (prefixed with _)
  lib/
    datocms/
      graphql.ts        # gql.tada init + readFragment re-export
      executeQuery.ts   # executes queries against DatoCMS CDA
  pages/
    [route]/
      index.astro       # route page
      _graphql.ts       # route-level query (prefixed with _)
      _style.module.css # route-level CSS module (prefixed with _)
    _graphql.ts         # used by index page
    index.astro         # home page
```

## Components

Every reusable UI component follows this structure:

```
src/components/MyComponent/
  Component.astro    # Astro component; imports its own fragment from ./graphql
  graphql.ts         # exports the gql.tada fragment (e.g. MyComponentFragment)
  index.ts           # barrel: re-exports component AND fragment
```

**Barrel files must export both the component and its fragment:**

```ts
// index.ts
export { default as MyComponent } from './Component.astro';
export { MyComponentFragment } from './graphql';
```

**All imports use the barrel path**, never the direct `graphql.ts` path:

```ts
import { MyComponent, MyComponentFragment } from '~/components/MyComponent';
```

**Internal imports** (within the same component directory) use `./graphql`:

```ts
// inside Component.astro
import { MyComponentFragment } from './graphql';
```

## GraphQL fragments

- Fragments live in `graphql.ts` files inside component directories
- Fragments define the **fields** only, never query-level directives
- Fragments on `ResponsiveImage` should NOT specify `imgixParams` — callers pass them at query time
- Queries go in `_graphql.ts` files at the layout or page level
- Inline queries (in `.astro` frontmatter) are acceptable for single-use queries
- Spread fragments using the standard GQL syntax: `...MyComponentFragment`

## imgixParams

`auto: format` is the **default** in this DatoCMS project — omit it. Only specify non-default params:

```graphql
# correct
responsiveImage(imgixParams: { w: 1200 }) { ...ResponsiveImageFragment }

# avoid
responsiveImage(imgixParams: { auto: format, w: 1200 }) { ...ResponsiveImageFragment }
```

## Styling

- Styles live in `.module.css` files, co-located with their `.astro` component/page
- Components: `style.module.css` next to `Component.astro`
- Pages: `_style.module.css` in the route directory (prefixed with `_`)
- Global resets, variables (`:root`), and element defaults live in `src/styles/global.css`
- Import CSS modules with `import styles from './style.module.css'` and reference classes as `{styles.fooBar}`
- Import global CSS with a bare import in the layout: `import '../styles/global.css'`
- **Class names MUST be camelCase** — never kebab-case. Use `styles.fooBar`, not `styles['foo-bar']`
- Use `:global()` sparingly for targeting child elements (e.g. `<img>` inside a DatoCMS Image wrapper)
- Font: `'Helvetica Neue', Helvetica, Arial, sans-serif`
- Color palette: `#111` (text), `#aaa`/`#bbb`/`#888` (muted/secondary), `#fff` (background), `#999` (tertiary)
- Max content width: `1280px` with `48px` horizontal padding, `16px` on mobile

## Commands

```bash
npm run dev              # start dev server
npm run build            # production build
npm run generate-types   # regenerate Cloudflare Worker types
npm run generate-schema  # regenerate gql.tada introspection types
npm run deploy           # build + deploy to Cloudflare
```
