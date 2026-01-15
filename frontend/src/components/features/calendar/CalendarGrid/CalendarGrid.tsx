import React from 'react';
import { DAYS_HE } from '@/constants/calendar.constants';
import CalendarDay from '../CalendarDay/CalendarDay';
import type { CalendarDayData } from '@/types/content';
import {
  StyledGridContainer,
  StyledDayHeadersGrid,
  StyledDayHeader,
  StyledDaysGrid,
} from './CalendarGrid.style';

interface CalendarGridProps {
  calendarDays: CalendarDayData[];
  draggedItemId: string | null;
  dragOverDate: string | null;
  isDropDisabled: boolean;
  isAdmin: boolean;
  onDayClick: (date: Date) => void;
  onItemClick: (itemId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, itemId: string, itemType: 'content' | 'event') => void;
  onDragOver: (e: React.DragEvent, date: Date, hasEventOnDate: boolean) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, date: Date, hasEventOnDate: boolean) => void;
  onDragEnd: () => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  draggedItemId,
  dragOverDate,
  isDropDisabled,
  isAdmin,
  onDayClick,
  onItemClick,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}) => {
  return (
    <StyledGridContainer>
      <StyledDayHeadersGrid>
        {DAYS_HE.map((day) => (
          <StyledDayHeader key={day}>{day}</StyledDayHeader>
        ))}
      </StyledDayHeadersGrid>

      <StyledDaysGrid>
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            draggedItemId={draggedItemId}
            dragOverDate={dragOverDate}
            isDropDisabled={isDropDisabled}
            isAdmin={isAdmin}
            onDayClick={onDayClick}
            onItemClick={onItemClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
          />
        ))}
      </StyledDaysGrid>
    </StyledGridContainer>
  );
};

export default React.memo(CalendarGrid);
