/**
 * Calendar data hook
 * Provides filtered and organized data for calendar and grid views
 */

import { useMemo } from 'react';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useCalendarNav } from '@/context/providers/CalendarNavProvider';
import { useFilters } from '@/context/providers/FilterProvider';
import { useContentItems } from '@/hooks/queries/useContent';
import { useEvents } from '@/hooks/queries/useEvents';
import { applyContentFilters, generateCalendarDates, isInMonth, formatDateISO } from './CalendarView.helper';
import type { CalendarDayData } from '@/types/content';

export function useCalendarData() {
  const [selectedClientId] = useSelectedClientId();
  const { filters } = useFilters();
  const { currentMonth } = useCalendarNav();
  const { data: contentItems = [] } = useContentItems(selectedClientId);
  const { data: events = [] } = useEvents(selectedClientId);

  // Apply filters to content
  const filteredContent = useMemo(() => {
    return applyContentFilters(contentItems, filters);
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
  };
}
