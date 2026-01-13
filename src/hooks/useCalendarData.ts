import { useApp } from '@/context/AppContext';
import { ContentItem, EventItem, CalendarItem, isContentItem } from '@/types/content';
import { useMemo } from 'react';

export function useCalendarData() {
  const { contentItems, events, selectedClientId, filters, currentMonth } = useApp();
  
  // Get items for selected client
  const clientContent = useMemo(() => {
    if (!selectedClientId) return [];
    return contentItems.filter(item => item.clientId === selectedClientId);
  }, [contentItems, selectedClientId]);
  
  const clientEvents = useMemo(() => {
    if (!selectedClientId) return [];
    return events.filter(event => event.clientId === selectedClientId);
  }, [events, selectedClientId]);
  
  // Apply filters
  const filteredContent = useMemo(() => {
    let items = clientContent;
    
    if (filters.type && filters.type.length > 0) {
      items = items.filter(item => filters.type!.includes(item.type));
    }
    
    if (filters.status && filters.status.length > 0) {
      items = items.filter(item => filters.status!.includes(item.status));
    }
    
    if (filters.platform && filters.platform.length > 0) {
      items = items.filter(item => filters.platform!.includes(item.platform));
    }
    
    if (filters.pendingApprovalOnly) {
      items = items.filter(item => item.status === 'pending');
    }
    
    return items;
  }, [clientContent, filters]);
  
  // Get calendar grid data
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End on Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      content: ContentItem[];
      events: EventItem[];
    }> = [];
    
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        content: filteredContent.filter(item => item.date === dateStr),
        events: clientEvents.filter(event => event.date === dateStr),
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentMonth, filteredContent, clientEvents]);
  
  // Get content for grid view (only posts/reels for Instagram feed preview)
  const gridContent = useMemo(() => {
    return filteredContent
      .filter(item => item.type === 'post' || item.type === 'reel')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredContent]);
  
  // Get pending count
  const pendingCount = useMemo(() => {
    return clientContent.filter(item => item.status === 'pending').length;
  }, [clientContent]);
  
  return {
    calendarDays,
    gridContent,
    pendingCount,
    allContent: filteredContent,
    allEvents: clientEvents,
  };
}

// Get item by ID
export function useCalendarItem(itemId: string | null) {
  const { contentItems, events } = useApp();
  
  return useMemo(() => {
    if (!itemId) return null;
    
    const content = contentItems.find(item => item.id === itemId);
    if (content) return content;
    
    const event = events.find(e => e.id === itemId);
    return event || null;
  }, [contentItems, events, itemId]);
}
