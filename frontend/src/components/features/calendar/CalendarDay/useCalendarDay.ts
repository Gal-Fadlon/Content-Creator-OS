import { useMemo, useCallback, useRef, useState } from 'react';
import { useUploadingState } from '@/context/providers/ModalProvider';
import { useImageCover } from '@/hooks/useImageCover';
import type { CalendarDayData } from '@/types/content';
import { getPrimaryMediaUrl } from '@/helpers/media.helper';

interface UseCalendarDayProps {
  day: CalendarDayData;
  dragOverDate: string | null;
  editingItemId: string | null;
  isAdmin: boolean;
  onDayClick: (date: Date) => void;
  onAddClick: (date: Date) => void;
  onItemClick: (itemId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, itemId: string, itemType: 'content' | 'event') => void;
  onEditImageClick: (itemId: string) => void;
  onEditImageDone: () => void;
  onZoomChange: (itemId: string, zoom: number) => void;
  onOffsetChange: (itemId: string, offsetX: number, offsetY: number) => void;
}

export function useCalendarDay({
  day,
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
}: UseCalendarDayProps) {
  const { isDateUploading, isDateDeleting } = useUploadingState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenEventsAnchor, setHiddenEventsAnchor] = useState<HTMLElement | null>(null);

  const dateStr = day.date.toISOString().split('T')[0];
  const isUploading = isDateUploading(dateStr);
  const isDeleting = isDateDeleting(dateStr);

  const contentWithMedia = useMemo(
    () => day.content.find((item) => getPrimaryMediaUrl(item)),
    [day.content]
  );

  const thumbnailUrl = useMemo(
    () => (contentWithMedia ? getPrimaryMediaUrl(contentWithMedia) : undefined),
    [contentWithMedia]
  );

  const cropSettings = useMemo(
    () => ({
      zoom: contentWithMedia?.gridZoom ?? 1,
      offsetX: contentWithMedia?.gridOffsetX ?? 0,
      offsetY: contentWithMedia?.gridOffsetY ?? 0,
    }),
    [contentWithMedia]
  );

  const isToday = day.date.toDateString() === new Date().toDateString();
  const isDragOver = dragOverDate === dateStr;
  const hasThumbnail = !!thumbnailUrl && day.isCurrentMonth;

  const isEditingThisDay = useMemo(
    () => contentWithMedia && editingItemId === contentWithMedia.id,
    [contentWithMedia, editingItemId]
  );

  const hiddenEvents = useMemo(() => day.events.slice(2), [day.events]);

  const showEditOnHover = isAdmin && hasThumbnail && !isEditingThisDay;
  const hasItems = day.content.length > 0 || day.events.length > 0;
  const showAddOnHover = isAdmin && day.isCurrentMonth && !isEditingThisDay && hasItems;

  const { imageAspectRatio, containerAspectRatio } = useImageCover(thumbnailUrl, containerRef);

  // Handlers
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
    if (isEditingThisDay) return;
    if (day.isCurrentMonth) {
      onDayClick(day.date);
    }
  }, [day.isCurrentMonth, day.date, onDayClick, isEditingThisDay]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (contentWithMedia) {
        onEditImageClick(contentWithMedia.id);
      }
    },
    [contentWithMedia, onEditImageClick]
  );

  const handleEditorSave = useCallback(
    (zoom: number, offsetX: number, offsetY: number) => {
      if (contentWithMedia) {
        onZoomChange(contentWithMedia.id, zoom);
        onOffsetChange(contentWithMedia.id, offsetX, offsetY);
        onEditImageDone();
      }
    },
    [contentWithMedia, onZoomChange, onOffsetChange, onEditImageDone]
  );

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddClick(day.date);
    },
    [day.date, onAddClick]
  );

  const handleMoreEventsClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setHiddenEventsAnchor(e.currentTarget);
  }, []);

  const handleHiddenEventsClose = useCallback(() => {
    setHiddenEventsAnchor(null);
  }, []);

  const handleHiddenEventClick = useCallback(
    (eventId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setHiddenEventsAnchor(null);
      onItemClick(eventId, e);
    },
    [onItemClick]
  );

  return {
    // Refs
    containerRef,

    // State
    hiddenEventsAnchor,
    isUploading,
    isDeleting,

    // Computed values
    thumbnailUrl,
    cropSettings,
    isToday,
    isDragOver,
    hasThumbnail,
    isEditingThisDay,
    hiddenEvents,
    showEditOnHover,
    showAddOnHover,
    imageAspectRatio,
    containerAspectRatio,

    // Handlers
    handleContentDragStart,
    handleEventDragStart,
    handleDayClick,
    handleEditClick,
    handleEditorSave,
    handleAddClick,
    handleMoreEventsClick,
    handleHiddenEventsClose,
    handleHiddenEventClick,
  };
}
