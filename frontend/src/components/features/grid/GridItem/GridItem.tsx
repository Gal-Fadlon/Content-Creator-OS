import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
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
  StyledUploadingOverlay,
} from './GridItem.style';

interface GridItemProps {
  item: ContentItem;
  isAdmin: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDragOver: (e: React.DragEvent, itemId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, itemId: string) => void;
  onDragEnd: () => void;
  onCoverClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onEditDone: () => void;
  onEditCancel: () => void;
  onZoomChange: (zoom: number) => void;
  onOffsetChange: (offsetX: number, offsetY: number) => void;
}

const GridItem: React.FC<GridItemProps> = ({
  item,
  isAdmin,
  isEditing,
  isDeleting,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onCoverClick,
  onEditClick,
  onDeleteClick,
  onEditDone,
  onEditCancel,
  onZoomChange,
  onOffsetChange,
}) => {
  const zoom = item.gridZoom ?? 1;
  const offsetX = item.gridOffsetX ?? 0;
  const offsetY = item.gridOffsetY ?? 0;
  const isUploading = item.isUploading ?? false;
  const showLoadingOverlay = isUploading || isDeleting;

  return (
    <StyledGridItemContainer
      draggable={isAdmin && !isEditing && !showLoadingOverlay}
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

      {/* Loading overlay - shown while uploading or deleting */}
      {showLoadingOverlay && (
        <StyledUploadingOverlay>
          <CircularProgress size={32} sx={{ color: 'white' }} />
        </StyledUploadingOverlay>
      )}

      {/* Editing controls - shown when editing */}
      {isEditing && !showLoadingOverlay && (
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

      {/* Admin overlay controls - shown on hover when not editing or loading */}
      {isAdmin && !isEditing && !showLoadingOverlay && (
        <GridItemOverlay onCoverClick={onCoverClick} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
      )}

      {/* Cover image indicator */}
      {item.coverImageUrl && !isEditing && !showLoadingOverlay && (
        <StyledCoverBadge label={GRID_ITEM.coverBadge} size="small" />
      )}

      {/* Content type badge */}
      {!isEditing && !showLoadingOverlay && <ContentTypeBadge type={item.type} />}
    </StyledGridItemContainer>
  );
};

export default React.memo(GridItem);
