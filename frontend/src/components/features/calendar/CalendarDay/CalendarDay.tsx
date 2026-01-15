import React, { useMemo, useCallback } from 'react';
import ContentBadge from '../ContentBadge/ContentBadge';
import EventBadge from '../EventBadge/EventBadge';
import type { CalendarDayData } from '@/types/content';
import { CALENDAR } from '@/constants/strings.constants';
import {
  StyledDayCell,
  StyledBackgroundImage,
  StyledDayContent,
  StyledDayNumber,
  StyledContentBadgesContainer,
  StyledEventsContainer,
  StyledMoreText,
} from './CalendarDay.style';

interface CalendarDayProps {
  day: CalendarDayData;
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

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
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
  const contentWithMedia = useMemo(
    () =>
      day.content.find(
        (item) => item.mediaUrl || item.coverImageUrl || item.thumbnailUrl
      ),
    [day.content]
  );

  const thumbnailUrl = useMemo(
    () =>
      contentWithMedia?.coverImageUrl ||
      contentWithMedia?.thumbnailUrl ||
      contentWithMedia?.mediaUrl,
    [contentWithMedia]
  );

  const isToday = day.date.toDateString() === new Date().toDateString();
  const isDragOver = dragOverDate === day.date.toISOString().split('T')[0];
  const hasThumbnail = !!thumbnailUrl && day.isCurrentMonth;
  
  // Check if there's an event OTHER than the one being dragged
  const hasOtherEventOnDate = useMemo(() => {
    if (!draggedItemId) {
      return day.events.length > 0;
    }
    return day.events.some((event) => event.id !== draggedItemId);
  }, [day.events, draggedItemId]);

  const handleContentDragStart = useCallback(
    (e: React.DragEvent, itemId: string) => {
      onDragStart(e, itemId, 'content');
    },
    [onDragStart]
  );

  const handleEventDragStart = useCallback(
    (e: React.DragEvent, itemId: string) => {
      onDragStart(e, itemId, 'event');
    },
    [onDragStart]
  );

  const handleDayClick = useCallback(() => {
    if (day.isCurrentMonth) {
      onDayClick(day.date);
    }
  }, [day.isCurrentMonth, day.date, onDayClick]);

  return (
    <StyledDayCell
      onClick={handleDayClick}
      onDragOver={(e) => onDragOver(e as unknown as React.DragEvent, day.date, hasOtherEventOnDate)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e as unknown as React.DragEvent, day.date, hasOtherEventOnDate)}
      isCurrentMonth={day.isCurrentMonth}
      isToday={isToday}
      isDragOver={isDragOver}
      hasThumbnail={hasThumbnail}
    >
      {hasThumbnail && <StyledBackgroundImage imageUrl={thumbnailUrl!} />}

      <StyledDayContent>
        <StyledDayNumber isToday={isToday} hasThumbnail={hasThumbnail}>
          {day.date.getDate()}
        </StyledDayNumber>
      </StyledDayContent>

      {day.content.length > 0 && (
        <StyledContentBadgesContainer>
          {day.content.slice(0, 3).map((item) => (
            <ContentBadge
              key={item.id}
              item={item}
              hasThumbnail={hasThumbnail}
              isAdmin={isAdmin}
              draggedItemId={draggedItemId}
              onDragStart={handleContentDragStart}
              onDragEnd={onDragEnd}
              onItemClick={onItemClick}
            />
          ))}
          {day.content.length > 3 && (
            <StyledMoreText hasThumbnail={hasThumbnail}>
              +{day.content.length - 3}
            </StyledMoreText>
          )}
        </StyledContentBadgesContainer>
      )}

      {day.events.length > 0 && (
        <StyledEventsContainer>
          {day.events.slice(0, 2).map((event) => (
            <EventBadge
              key={event.id}
              event={event}
              isAdmin={isAdmin}
              draggedItemId={draggedItemId}
              onItemClick={onItemClick}
              onDragStart={handleEventDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
          {day.events.length > 2 && (
            <StyledMoreText hasThumbnail={hasThumbnail}>
              {CALENDAR.moreEvents(day.events.length - 2)}
            </StyledMoreText>
          )}
        </StyledEventsContainer>
      )}
    </StyledDayCell>
  );
};

export default React.memo(CalendarDay);
