import React from 'react';
import { Crop, Plus } from 'lucide-react';
import { Tooltip, CircularProgress } from '@mui/material';
import ContentBadge from '../ContentBadge/ContentBadge';
import EventBadge from '../EventBadge/EventBadge';
import HiddenEventsPopover from '../HiddenEventsPopover/HiddenEventsPopover';
import InlineImageEditor from '@/components/features/grid/InlineImageEditor/InlineImageEditor';
import type { CalendarDayData } from '@/types/content';
import { CALENDAR } from '@/constants/strings.constants';
import { useCalendarDay } from './useCalendarDay';
import {
  StyledDayCell,
  StyledBackgroundImageContainer,
  StyledBackgroundImage,
  StyledEditButton,
  StyledAddButton,
  StyledEditorContainer,
  StyledSkeletonOverlay,
  StyledLoaderOverlay,
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
  isLoading: boolean;
  editingItemId: string | null;
  onDayClick: (date: Date) => void;
  onAddClick: (date: Date) => void;
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
  const {
    containerRef,
    hiddenEventsAnchor,
    isUploading,
    isDeleting,
    thumbnailUrl,
    cropSettings,
    isToday,
    isDragOver,
    hasThumbnail,
    hasOtherEventOnDate,
    isEditingThisDay,
    hiddenEvents,
    showEditOnHover,
    showAddOnHover,
    imageAspectRatio,
    containerAspectRatio,
    handleContentDragStart,
    handleEventDragStart,
    handleDayClick,
    handleEditClick,
    handleEditorSave,
    handleAddClick,
    handleMoreEventsClick,
    handleHiddenEventsClose,
    handleHiddenEventClick,
  } = useCalendarDay({
    day,
    draggedItemId,
    dragOverDate,
    editingItemId,
    isAdmin,
    onDayClick,
    onAddClick,
    onItemClick,
    onDragStart,
    onEditImageClick,
    onEditImageDone,
    onZoomChange,
    onOffsetChange,
  });

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
      showAddOnHover={showAddOnHover}
    >
      {(isUploading || (isLoading && day.isCurrentMonth)) && <StyledSkeletonOverlay />}

      {isDeleting && (
        <StyledLoaderOverlay>
          <CircularProgress size={24} sx={{ color: 'white' }} />
        </StyledLoaderOverlay>
      )}

      {showAddOnHover && (
        <Tooltip title={CALENDAR.addItem} placement="top">
          <StyledAddButton className="add-button" onClick={handleAddClick}>
            <Plus size={14} />
          </StyledAddButton>
        </Tooltip>
      )}

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
              <StyledBackgroundImageContainer ref={containerRef}>
                <StyledBackgroundImage
                  src={thumbnailUrl!}
                  alt=""
                  zoom={cropSettings.zoom}
                  offsetX={cropSettings.offsetX}
                  offsetY={cropSettings.offsetY}
                  imageAspectRatio={imageAspectRatio}
                  containerAspectRatio={containerAspectRatio}
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
        <StyledContentBadgesContainer eventCount={day.events.length}>
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
            <StyledMoreText
              hasThumbnail={hasThumbnail}
              isClickable
              onClick={handleMoreEventsClick}
            >
              {CALENDAR.moreEvents(day.events.length - 2)}
            </StyledMoreText>
          )}
        </StyledEventsContainer>
      )}

      <HiddenEventsPopover
        anchorEl={hiddenEventsAnchor}
        events={hiddenEvents}
        onClose={handleHiddenEventsClose}
        onEventClick={handleHiddenEventClick}
      />
    </StyledDayCell>
  );
};

export default React.memo(CalendarDay);
