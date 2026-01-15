import React, { useState, useCallback, useRef, useEffect } from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ImageIcon from '@mui/icons-material/Image';
import type { ContentItem } from '@/types/content';
import { CONTENT_TYPE_LABELS_HE, CONTENT_BADGE } from '@/constants/strings.constants';
import {
  StyledBadgeContainer,
  StyledHoverCard,
  StyledHoverContent,
  StyledTypeRow,
  StyledTypeLabel,
  StyledDescriptionSection,
  StyledDescriptionLabel,
  StyledDescriptionText,
  StyledCaptionText,
} from './ContentBadge.style';

interface ContentBadgeProps {
  item: ContentItem;
  hasThumbnail: boolean;
  isAdmin: boolean;
  draggedItemId: string | null;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDragEnd: () => void;
  onItemClick: (itemId: string, e: React.MouseEvent) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'reel':
      return <MovieIcon fontSize="inherit" />;
    case 'story':
      return <AutoStoriesIcon fontSize="inherit" />;
    default:
      return <ImageIcon fontSize="inherit" />;
  }
};

const getTypeLabel = (type: string) => {
  return CONTENT_TYPE_LABELS_HE[type as keyof typeof CONTENT_TYPE_LABELS_HE] || CONTENT_TYPE_LABELS_HE.post;
};

const HOVER_DELAY = 300; // ms delay before showing popover

const ContentBadge: React.FC<ContentBadgeProps> = ({
  item,
  hasThumbnail,
  isAdmin,
  draggedItemId,
  onDragStart,
  onDragEnd,
  onItemClick,
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

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (item.creativeDescription || item.caption) {
      const target = event.currentTarget;
      // Add delay before showing popover to allow drag to start
      hoverTimeoutRef.current = window.setTimeout(() => {
        setAnchorEl(target);
      }, HOVER_DELAY);
    }
  }, [item.creativeDescription, item.caption]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setAnchorEl(null);
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      // Clear hover timeout and close popover when starting to drag
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setAnchorEl(null);
      onDragStart(e, item.id);
    },
    [item.id, onDragStart]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onItemClick(item.id, e);
    },
    [item.id, onItemClick]
  );

  const isOpen = Boolean(anchorEl) && !draggedItemId;
  const isDragging = draggedItemId === item.id;

  return (
    <>
      <StyledBadgeContainer
        draggable={isAdmin}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        hasThumbnail={hasThumbnail}
        contentType={item.type}
        isAdmin={isAdmin}
        isDragging={isDragging}
      >
        {getTypeIcon(item.type)}
      </StyledBadgeContainer>

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
          <StyledTypeRow>
            {getTypeIcon(item.type)}
            <StyledTypeLabel>{getTypeLabel(item.type)}</StyledTypeLabel>
          </StyledTypeRow>

          {item.creativeDescription && (
            <StyledDescriptionSection>
              <StyledDescriptionLabel>{CONTENT_BADGE.creativeDescriptionLabel}</StyledDescriptionLabel>
              <StyledDescriptionText>{item.creativeDescription}</StyledDescriptionText>
            </StyledDescriptionSection>
          )}

          {item.caption && (
            <StyledDescriptionSection>
              <StyledDescriptionLabel>{CONTENT_BADGE.captionLabel}</StyledDescriptionLabel>
              <StyledCaptionText>{item.caption}</StyledCaptionText>
            </StyledDescriptionSection>
          )}
        </StyledHoverContent>
      </StyledHoverCard>
    </>
  );
};

export default React.memo(ContentBadge);
