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
  isAdmin: boolean;
  isLoading: boolean;
  editingItemId: string | null;
  onDayClick: (date: Date) => void;
  onAddClick: (date: Date) => void;
  onItemClick: (itemId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, itemId: string, itemType: 'content' | 'event') => void;
  onDragOver: (e: React.DragEvent, date: Date) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
  onDragEnd: () => void;
  onEditImageClick: (itemId: string) => void;
  onEditImageDone: () => void;
  onEditImageCancel: () => void;
  onZoomChange: (itemId: string, zoom: number) => void;
  onOffsetChange: (itemId: string, offsetX: number, offsetY: number) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  draggedItemId,
  dragOverDate,
  isAdmin,
  isLoading,
  editingItemId,
  onDayClick,
  onAddClick,
  onItemClick,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onEditImageClick,
  onEditImageDone,
  onEditImageCancel,
  onZoomChange,
  onOffsetChange,
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
            isAdmin={isAdmin}
            isLoading={isLoading}
            editingItemId={editingItemId}
            onDayClick={onDayClick}
            onAddClick={onAddClick}
            onItemClick={onItemClick}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onEditImageClick={onEditImageClick}
            onEditImageDone={onEditImageDone}
            onEditImageCancel={onEditImageCancel}
            onZoomChange={onZoomChange}
            onOffsetChange={onOffsetChange}
          />
        ))}
      </StyledDaysGrid>
    </StyledGridContainer>
  );
};

export default React.memo(CalendarGrid);
