import React from 'react';
import GridItemMedia from '../GridItemMedia/GridItemMedia';
import GridItemOverlay from '../GridItemOverlay/GridItemOverlay';
import GridItemEditControls from '../GridItemEditControls/GridItemEditControls';
import ContentTypeBadge from '../ContentTypeBadge/ContentTypeBadge';
import type { ContentItem } from '@/types/content';
import { GRID_ITEM } from '@/constants/strings.constants';
import {
  StyledGridItemContainer,
  StyledMediaWrapper,
  StyledCoverBadge,
} from './GridItem.style';

interface GridItemProps {
  item: ContentItem;
  isAdmin: boolean;
  isEditing: boolean;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDragOver: (e: React.DragEvent, itemId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, itemId: string) => void;
  onDragEnd: () => void;
  onCoverClick: () => void;
  onEditClick: () => void;
  onEditDone: () => void;
  onEditCancel: () => void;
  onZoomChange: (zoom: number) => void;
  onOffsetChange: (offsetX: number, offsetY: number) => void;
}

const GridItem: React.FC<GridItemProps> = ({
  item,
  isAdmin,
  isEditing,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onCoverClick,
  onEditClick,
  onEditDone,
  onEditCancel,
  onZoomChange,
  onOffsetChange,
}) => {
  const zoom = item.gridZoom ?? 1;
  const offsetX = item.gridOffsetX ?? 0;
  const offsetY = item.gridOffsetY ?? 0;

  return (
    <StyledGridItemContainer
      draggable={isAdmin && !isEditing}
      onDragStart={(e) => onDragStart(e as React.DragEvent, item.id)}
      onDragOver={(e) => onDragOver(e as React.DragEvent, item.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e as React.DragEvent, item.id)}
      onDragEnd={onDragEnd}
      isAdmin={isAdmin}
      isEditing={isEditing}
      isDragged={isDragged}
      isDragOver={isDragOver}
    >
      {/* Media display with zoom and positioning */}
      <StyledMediaWrapper>
        <GridItemMedia
          mediaUrl={item.mediaUrl}
          coverImageUrl={item.coverImageUrl}
          type={item.type}
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </StyledMediaWrapper>

      {/* Editing controls - shown when editing */}
      {isEditing && (
        <GridItemEditControls
          imageUrl={item.coverImageUrl || item.mediaUrl || ''}
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
          onZoomChange={onZoomChange}
          onOffsetChange={onOffsetChange}
          onDoneEditing={onEditDone}
          onCancelEditing={onEditCancel}
        />
      )}

      {/* Admin overlay controls - shown on hover when not editing */}
      {isAdmin && !isEditing && (
        <GridItemOverlay onCoverClick={onCoverClick} onEditClick={onEditClick} />
      )}

      {/* Cover image indicator */}
      {item.coverImageUrl && !isEditing && (
        <StyledCoverBadge label={GRID_ITEM.coverBadge} size="small" />
      )}

      {/* Content type badge */}
      {!isEditing && <ContentTypeBadge type={item.type} />}
    </StyledGridItemContainer>
  );
};

export default React.memo(GridItem);
