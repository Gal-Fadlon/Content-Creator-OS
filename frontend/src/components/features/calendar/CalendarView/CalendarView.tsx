import React, { useCallback, useMemo } from 'react';
import { useCalendarNav } from '@/context/providers/CalendarNavProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import { useContentModal } from '@/context/providers/ModalProvider';
import { useCalendarData } from './useCalendarData';
import type { CalendarDayData } from '@/types/content';
import CalendarHeader from '../CalendarHeader/CalendarHeader';
import CalendarGrid from '../CalendarGrid/CalendarGrid';
import { useCalendarDragDrop } from './useCalendarDragDrop';
import {
  StyledCalendarContainer,
  StyledCalendarPaper,
} from './CalendarView.style';

const CalendarView: React.FC = () => {
  const { currentMonth, goToNextMonth, goToPrevMonth } = useCalendarNav();
  const { isAdmin } = useAuth();
  const { openForDate, openForEdit } = useContentModal();
  const { calendarDays } = useCalendarData();

  const {
    draggedItemId,
    dragOverDate,
    isDropDisabled,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useCalendarDragDrop();

  // Create a map for quick lookup of day data by date string
  const calendarDaysMap = useMemo(() => {
    const map = new Map<string, CalendarDayData>();
    calendarDays.forEach((day) => {
      const dateStr = day.date.toISOString().split('T')[0];
      map.set(dateStr, day);
    });
    return map;
  }, [calendarDays]);

  const handleDayClick = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = calendarDaysMap.get(dateStr);
      
      // If there's exactly one item (content or event) on this day, open it for editing
      const totalItems = (dayData?.content.length || 0) + (dayData?.events.length || 0);
      
      if (totalItems === 1) {
        // Open the single item for editing
        if (dayData?.content.length === 1) {
          openForEdit(dayData.content[0].id);
        } else if (dayData?.events.length === 1) {
          openForEdit(dayData.events[0].id);
        }
      } else {
        // Open for creating new item or viewing multiple items
        openForDate(date);
      }
    },
    [calendarDaysMap, openForDate, openForEdit]
  );

  const handleItemClick = useCallback(
    (itemId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      openForEdit(itemId);
    },
    [openForEdit]
  );

  return (
    <StyledCalendarContainer>
      <StyledCalendarPaper elevation={0}>
        <CalendarHeader
          currentMonth={currentMonth}
          onPreviousMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
        />

        <CalendarGrid
          calendarDays={calendarDays}
          draggedItemId={draggedItemId}
          dragOverDate={dragOverDate}
          isDropDisabled={isDropDisabled}
          isAdmin={isAdmin}
          onDayClick={handleDayClick}
          onItemClick={handleItemClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      </StyledCalendarPaper>
    </StyledCalendarContainer>
  );
};

export default React.memo(CalendarView);
