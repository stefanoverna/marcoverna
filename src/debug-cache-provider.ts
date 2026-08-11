import originalFactory from '@astrojs/cloudflare/cache/provider';
import type { CacheProviderFactory } from 'astro';

const factory: CacheProviderFactory = (...args) => {
  const provider = originalFactory(...args);
  return {
    ...provider,
    setHeaders(options, request) {
      const headers = provider.setHeaders!(options, request);
      const tag = headers.get('Cache-Tag');
      if (tag) headers.set('X-Debug-Cache-Tags', tag);
      return headers;
    },
  };
};

export default factory;
