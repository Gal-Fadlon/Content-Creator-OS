/**
 * CalendarView helper functions
 * Utilities for calendar data processing, filtering, and date calculations
 */

import type { ContentItem, ContentType, ContentStatus, Platform, ContentFilters } from '@/types/content';

// ============================================================================
// Content Filtering
// ============================================================================

/**
 * Filter content items by type (post, story, reel)
 */
const filterByType = (
  items: ContentItem[],
  types: ContentType[]
): ContentItem[] => {
  if (!types || types.length === 0) return items;
  return items.filter((item) => types.includes(item.type));
};

/**
 * Filter content items by status (draft, pending, approved, published)
 */
const filterByStatus = (
  items: ContentItem[],
  statuses: ContentStatus[]
): ContentItem[] => {
  if (!statuses || statuses.length === 0) return items;
  return items.filter((item) => statuses.includes(item.status));
};

/**
 * Filter content items by platform
 */
const filterByPlatform = (
  items: ContentItem[],
  platforms: Platform[]
): ContentItem[] => {
  if (!platforms || platforms.length === 0) return items;
  return items.filter((item) => platforms.includes(item.platform));
};

/**
 * Filter to only pending approval items
 */
const filterPendingOnly = (items: ContentItem[]): ContentItem[] => {
  return items.filter((item) => item.status === 'pending');
};

/**
 * Apply all filters from ContentFilters object
 */
export const applyContentFilters = (
  items: ContentItem[],
  filters: ContentFilters
): ContentItem[] => {
  let filtered = [...items];

  if (filters.type && filters.type.length > 0) {
    filtered = filterByType(filtered, filters.type);
  }

  if (filters.status && filters.status.length > 0) {
    filtered = filterByStatus(filtered, filters.status);
  }

  if (filters.platform && filters.platform.length > 0) {
    filtered = filterByPlatform(filtered, filters.platform);
  }

  if (filters.pendingApprovalOnly) {
    filtered = filterPendingOnly(filtered);
  }

  return filtered;
};

// ============================================================================
// Date Calculations
// ============================================================================

/**
 * Check if a date is in the given month
 */
export const isInMonth = (date: Date, month: Date): boolean => {
  return (
    date.getMonth() === month.getMonth() &&
    date.getFullYear() === month.getFullYear()
  );
};

/**
 * Get the first day of a month
 */
const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get the start of the calendar grid (Sunday of the week containing the first day)
 */
const getCalendarGridStart = (month: Date): Date => {
  const firstDay = getFirstDayOfMonth(month);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  return startDate;
};

/**
 * Generate array of dates for calendar grid
 * Always returns exactly 35 days (5 rows × 7 columns) for consistent layout
 */
export const generateCalendarDates = (month: Date): Date[] => {
  const dates: Date[] = [];
  const startDate = getCalendarGridStart(month);
  
  const CALENDAR_ROWS = 5;
  const DAYS_PER_WEEK = 7;
  const TOTAL_DAYS = CALENDAR_ROWS * DAYS_PER_WEEK;
  
  const current = new Date(startDate);
  for (let i = 0; i < TOTAL_DAYS; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date for API/storage (ISO date string without time)
 * @example formatDateISO(new Date()) => "2026-01-13"
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
