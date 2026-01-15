/**
 * ContentModal helper functions
 * Type guards for distinguishing between content items and events
 */

import type { CalendarItem, ContentItem, EventItem } from '@/types/content';

/**
 * Type guard to check if a calendar item is a ContentItem
 */
export const isContentItem = (item: CalendarItem): item is ContentItem => {
  return 'type' in item && 'status' in item;
};

/**
 * Type guard to check if a calendar item is an EventItem
 */
export const isEventItem = (item: CalendarItem): item is EventItem => {
  return 'title' in item && 'color' in item && !('type' in item);
};
