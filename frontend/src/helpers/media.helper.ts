import type { ContentItem } from '@/types/content';

/**
 * Get the primary display URL for content
 * Priority: coverImageUrl > thumbnailUrl > first media item
 */
export const getPrimaryMediaUrl = (item: ContentItem): string | undefined => {
  return item.coverImageUrl || item.thumbnailUrl || item.media?.[0]?.mediaUrl;
};

/**
 * Get the first media item's URL (actual content, not cover/thumbnail)
 */
export const getFirstMediaUrl = (item: ContentItem): string | undefined => {
  return item.media?.[0]?.mediaUrl;
};

/**
 * Check if content has any media
 */
export const hasMedia = (item: ContentItem): boolean => {
  return (item.media?.length ?? 0) > 0;
};

/**
 * Get media count
 */
export const getMediaCount = (item: ContentItem): number => {
  return item.media?.length ?? 0;
};
