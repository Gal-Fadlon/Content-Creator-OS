import React, { useMemo, useCallback } from 'react';
import { Crop } from 'lucide-react';
import ContentBadge from '../ContentBadge/ContentBadge';
import EventBadge from '../EventBadge/EventBadge';
import InlineImageEditor from '@/components/features/grid/InlineImageEditor/InlineImageEditor';
import { useUploadingState } from '@/context/providers/ModalProvider';
import type { CalendarDayData } from '@/types/content';
import { CALENDAR } from '@/constants/strings.constants';
import {
  StyledDayCell,
  StyledBackgroundImageContainer,
  StyledBackgroundImage,
  StyledEditButton,
  StyledEditorContainer,
  StyledSkeletonOverlay,
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
  editingItemId: string | null;
  onDayClick: (date: Date) => void;
  onItemClick: (itemId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, itemId: string, itemType: 'content' | 'event') => void;
  onDragOver: (e: React.DragEvent, date: Date, hasEventOnDate: boolean) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, date: Date, hasEventOnDate: boolean) => void;
  onDragEnd: () => void;
  onEditImageClick: (itemId: string) => void;
  onEditImageDone: () => void;
  onEditImageCancel: () => void;
  onZoomChange: (itemId: string, zoom: number) => void;
  onOffsetChange: (itemId: string, offsetX: number, offsetY: number) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  draggedItemId,
  dragOverDate,
  isAdmin,
  editingItemId,
  onDayClick,
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
  const { isDateUploading } = useUploadingState();
  
  const dateStr = day.date.toISOString().split('T')[0];
  const isUploading = isDateUploading(dateStr);
  
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

  // Get crop settings from the content with media
  const cropSettings = useMemo(() => ({
    zoom: contentWithMedia?.gridZoom ?? 1,
    offsetX: contentWithMedia?.gridOffsetX ?? 0,
    offsetY: contentWithMedia?.gridOffsetY ?? 0,
  }), [contentWithMedia]);

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

  // Check if this day's content is being edited
  const isEditingThisDay = useMemo(() => {
    return contentWithMedia && editingItemId === contentWithMedia.id;
  }, [contentWithMedia, editingItemId]);

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
    // Don't open modal when in edit mode
    if (isEditingThisDay) return;
    
    if (day.isCurrentMonth) {
      onDayClick(day.date);
    }
  }, [day.isCurrentMonth, day.date, onDayClick, isEditingThisDay]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentWithMedia) {
      onEditImageClick(contentWithMedia.id);
    }
  }, [contentWithMedia, onEditImageClick]);

  const handleEditorSave = useCallback((zoom: number, offsetX: number, offsetY: number) => {
    if (contentWithMedia) {
      onZoomChange(contentWithMedia.id, zoom);
      onOffsetChange(contentWithMedia.id, offsetX, offsetY);
      onEditImageDone();
    }
  }, [contentWithMedia, onZoomChange, onOffsetChange, onEditImageDone]);

  const showEditOnHover = isAdmin && hasThumbnail && !isEditingThisDay;

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
      showEditOnHover={showEditOnHover}
    >
      {isUploading && <StyledSkeletonOverlay />}
      
      {hasThumbnail && (
        <>
          {isEditingThisDay ? (
            <StyledEditorContainer>
              <InlineImageEditor
                imageUrl={thumbnailUrl!}
                initialZoom={cropSettings.zoom}
                initialOffsetX={cropSettings.offsetX}
                initialOffsetY={cropSettings.offsetY}
                onSave={handleEditorSave}
                onCancel={onEditImageCancel}
                showDoneButton={true}
              />
            </StyledEditorContainer>
          ) : (
            <>
              <StyledBackgroundImageContainer>
                <StyledBackgroundImage
                  src={thumbnailUrl!}
                  alt=""
                  zoom={cropSettings.zoom}
                  offsetX={cropSettings.offsetX}
                  offsetY={cropSettings.offsetY}
                />
              </StyledBackgroundImageContainer>
              {isAdmin && (
                <StyledEditButton className="edit-button" onClick={handleEditClick}>
                  <Crop size={12} />
                  </StyledEditButton>
              )}
            </>
          )}
        </>
      )}

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
