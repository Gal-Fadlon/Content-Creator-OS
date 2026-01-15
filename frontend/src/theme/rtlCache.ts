import createCache from '@emotion/cache';

/**
 * Emotion cache for MUI components
 * RTL is handled via CSS direction property on the theme/components
 * rather than through stylis plugins to avoid compatibility issues
 */
export const cacheRtl = createCache({
  key: 'mui',
});
