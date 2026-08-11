import originalFactory from '@astrojs/cloudflare/cache/provider';
import type { CacheProviderFactory } from 'astro';

const factory: CacheProviderFactory = (...args) => {
  const provider = originalFactory(...args);
  return {
    ...provider,
    setHeaders(options, request) {
      console.log(
        `[CacheProvider.setHeaders] tags count=${options.tags?.length || 0}, maxAge=${options.maxAge}`,
      );
      if (options.tags?.length) {
        console.log(
          `[CacheProvider.setHeaders] tags: ${JSON.stringify(options.tags)}`,
        );
      }
      const headers = provider.setHeaders!(options, request);
      const tag = headers.get('Cache-Tag');
      if (tag) headers.set('X-Debug-Cache-Tags', tag);
      return headers;
    },
    async invalidate(options) {
      console.log(
        `[CacheProvider.invalidate] options=${JSON.stringify(options)}`,
      );
      return provider.invalidate?.(options);
    },
  };
};

export default factory;
