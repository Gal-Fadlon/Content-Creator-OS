/**
 * Calendar data hook
 * Provides filtered and organized data for calendar and grid views
 */

import { useMemo } from 'react';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useCalendarNav } from '@/context/providers/CalendarNavProvider';
import { useFilters } from '@/context/providers/FilterProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import { useContentItems } from '@/hooks/queries/useContent';
import { useEvents } from '@/hooks/queries/useEvents';
import { applyContentFilters, generateCalendarDates, isInMonth, formatDateISO } from './CalendarView.helper';
import type { CalendarDayData } from '@/types/content';

export function useCalendarData() {
  const [selectedClientId] = useSelectedClientId();
  const { filters } = useFilters();
  const { currentMonth } = useCalendarNav();
  const { isLoading: isAuthLoading } = useAuth();
  const { data: contentItems = [], isLoading: isContentLoading, isPlaceholderData: isContentPlaceholder } = useContentItems(selectedClientId);
  const { data: events = [], isLoading: isEventsLoading, isPlaceholderData: isEventsPlaceholder } = useEvents(selectedClientId);

  // Show loading when:
  // 1. Auth is still initializing (hard refresh)
  // 2. No client selected yet (waiting for client list)
  // 3. Fetching fresh data without cached data
  const isLoading =
    isAuthLoading ||
    !selectedClientId ||
    (isContentLoading && !isContentPlaceholder) ||
    (isEventsLoading && !isEventsPlaceholder);

  // Apply filters to content (only calendar source)
  const filteredContent = useMemo(() => {
    const calendarContent = contentItems.filter(item => item.source === 'calendar' || !item.source);
    return applyContentFilters(calendarContent, filters);
  }, [contentItems, filters]);

  // Get calendar grid data
  const calendarDays = useMemo<CalendarDayData[]>(() => {
    const dates = generateCalendarDates(currentMonth);
    
    return dates.map(date => {
      const dateStr = formatDateISO(date);
      
      return {
        date,
        isCurrentMonth: isInMonth(date, currentMonth),
        content: filteredContent.filter(item => item.date === dateStr),
        events: events.filter(event => event.date === dateStr),
      };
    });
  }, [currentMonth, filteredContent, events]);

  // Get content for grid view (only posts/reels for Instagram feed preview)
  const gridContent = useMemo(() => {
    return filteredContent
      .filter(item => item.type === 'post' || item.type === 'reel')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredContent]);

  // Get pending count
  const pendingCount = useMemo(() => {
    return contentItems.filter(item => item.status === 'pending').length;
  }, [contentItems]);

  return {
    calendarDays,
    gridContent,
    pendingCount,
    allContent: filteredContent,
    allEvents: events,
    isLoading,
  };
}
