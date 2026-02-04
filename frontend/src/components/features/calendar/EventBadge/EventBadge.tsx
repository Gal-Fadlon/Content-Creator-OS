import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { EventItem } from '@/types/content';
import { EVENT_BADGE } from '@/constants/strings.constants';
import {
  StyledEventChip,
  StyledHoverCard,
  StyledHoverContent,
  StyledEventTitle,
  StyledDescriptionLabel,
  StyledDescriptionText,
} from './EventBadge.style';

interface EventBadgeProps {
  event: EventItem;
  isAdmin: boolean;
  draggedItemId: string | null;
  onItemClick: (itemId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDragEnd: () => void;
}

const HOVER_DELAY = 300; // ms delay before showing popover

const EventBadge: React.FC<EventBadgeProps> = ({
  event,
  isAdmin,
  draggedItemId,
  onItemClick,
  onDragStart,
  onDragEnd,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    // Add delay before showing popover to allow drag to start
    hoverTimeoutRef.current = window.setTimeout(() => {
      setAnchorEl(target);
    }, HOVER_DELAY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setAnchorEl(null);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onItemClick(event.id, e);
    },
    [event.id, onItemClick]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      // Clear hover timeout and close popover when starting to drag
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setAnchorEl(null);
      if (!isAdmin) return;
      onDragStart(e, event.id);
    },
    [isAdmin, event.id, onDragStart]
  );

  const isDragging = draggedItemId === event.id;
  const isOpen = Boolean(anchorEl) && !isDragging;

  return (
    <>
      <div
        draggable={isAdmin}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: isAdmin ? 'grab' : 'pointer', display: 'inline-block' }}
      >
        <StyledEventChip
          label={event.title}
          eventColor={event.color}
          isDragging={isDragging}
          isCompleted={event.itemType === 'task' && event.isCompleted}
          size="small"
          sx={{ pointerEvents: 'none' }}
        />
      </div>

      <StyledHoverCard
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleMouseLeave}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus
        disableEnforceFocus
        disableAutoFocus
        sx={{ pointerEvents: 'none' }}
      >
        <StyledHoverContent>
          <StyledEventTitle>{event.title}</StyledEventTitle>

          {event.description && (
            <>
              <StyledDescriptionLabel>{EVENT_BADGE.descriptionLabel}</StyledDescriptionLabel>
              <StyledDescriptionText>{event.description}</StyledDescriptionText>
            </>
          )}
        </StyledHoverContent>
      </StyledHoverCard>
    </>
  );
};

export default React.memo(EventBadge);
