import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Plus, Expand } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { MEDIA_UPLOAD } from '@/constants/strings.constants';
import type { ContentMedia } from '@/types/content';
import {
  StyledContainer,
  StyledMediaGrid,
  StyledMediaItem,
  StyledMediaThumb,
  StyledRemoveButton,
  StyledExpandButton,
  StyledAddButton,
  StyledDropZone,
  StyledUploadIcon,
  StyledUploadText,
  StyledLoadingOverlay,
  StyledLightbox,
  StyledLightboxContent,
  StyledLightboxImage,
  StyledLightboxClose,
} from './MultiMediaUpload.style';

// Pending upload item (before upload completes)
export interface PendingMedia {
  id: string; // Temporary ID
  file: File;
  previewUrl: string;
  isUploading: boolean;
}

// Combined media item for reordering
type MediaItem =
  | { type: 'existing'; id: string; url: string; data: ContentMedia }
  | { type: 'pending'; id: string; url: string; data: PendingMedia };

interface MultiMediaUploadProps {
  // Existing media from database
  existingMedia?: ContentMedia[];
  // Pending uploads (local files not yet saved)
  pendingMedia?: PendingMedia[];
  // Whether user can edit
  isAdmin: boolean;
  // Max number of images allowed
  maxImages?: number;
  // Callbacks
  onAddFiles: (files: File[]) => void;
  onRemoveExisting?: (mediaId: string) => void;
  onRemovePending?: (pendingId: string) => void;
  onReorderExisting?: (mediaIds: string[]) => void;
  onReorderPending?: (pendingIds: string[]) => void;
}

const MultiMediaUpload: React.FC<MultiMediaUploadProps> = ({
  existingMedia = [],
  pendingMedia = [],
  isAdmin,
  maxImages = 10,
  onAddFiles,
  onRemoveExisting,
  onRemovePending,
  onReorderExisting,
  onReorderPending,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<MediaItem | null>(null);
  const [dragOverItem, setDragOverItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalMedia = existingMedia.length + pendingMedia.length;
  const canAddMore = totalMedia < maxImages;
  const hasMedia = totalMedia > 0;

  // Combine existing and pending media into a single list for display
  const allMedia: MediaItem[] = [
    ...existingMedia.map(m => ({ type: 'existing' as const, id: m.id, url: m.mediaUrl, data: m })),
    ...pendingMedia.map(p => ({ type: 'pending' as const, id: p.id, url: p.previewUrl, data: p })),
  ];

  // File drop zone handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canAddMore) return;

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (files.length > 0) {
      const remaining = maxImages - totalMedia;
      onAddFiles(files.slice(0, remaining));
    }
  }, [canAddMore, maxImages, totalMedia, onAddFiles]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(
      file => file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length > 0) {
      const remaining = maxImages - totalMedia;
      onAddFiles(validFiles.slice(0, remaining));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [maxImages, totalMedia, onAddFiles]);

  const handleRemoveExisting = useCallback((mediaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveExisting?.(mediaId);
  }, [onRemoveExisting]);

  const handleRemovePending = useCallback((pendingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemovePending?.(pendingId);
  }, [onRemovePending]);

  const handleExpand = useCallback((url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxUrl(url);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxUrl(null);
  }, []);

  // Drag and drop reordering handlers
  const handleItemDragStart = useCallback((item: MediaItem, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);
  }, []);

  const handleItemDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  const handleItemDragOver = useCallback((item: MediaItem, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem && draggedItem.id !== item.id) {
      setDragOverItem(item);
    }
  }, [draggedItem]);

  const handleItemDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);

  const handleItemDrop = useCallback((targetItem: MediaItem, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Helper to reorder items
    const reorderItems = (
      ids: string[],
      fromId: string,
      toId: string,
      onReorder?: (newOrder: string[]) => void
    ) => {
      const fromIndex = ids.indexOf(fromId);
      const toIndex = ids.indexOf(toId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newOrder = [...ids];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, fromId);
        onReorder?.(newOrder);
      }
    };

    // Reorder existing or pending media
    if (draggedItem.type === 'existing' && targetItem.type === 'existing') {
      reorderItems(existingMedia.map(m => m.id), draggedItem.id, targetItem.id, onReorderExisting);
    } else if (draggedItem.type === 'pending' && targetItem.type === 'pending') {
      reorderItems(pendingMedia.map(p => p.id), draggedItem.id, targetItem.id, onReorderPending);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  }, [draggedItem, existingMedia, pendingMedia, onReorderExisting, onReorderPending]);

  // Render a single media item
  const renderMediaItem = (item: MediaItem) => {
    const isItemDragging = draggedItem?.id === item.id;
    const isItemDragOver = dragOverItem?.id === item.id;
    const isPending = item.type === 'pending';
    const pendingData = isPending ? (item.data as PendingMedia) : null;

    return (
      <StyledMediaItem
        key={item.id}
        isDragging={isItemDragging}
        isDragOver={isItemDragOver}
        draggable={isAdmin}
        onDragStart={(e) => handleItemDragStart(item, e)}
        onDragEnd={handleItemDragEnd}
        onDragOver={(e) => handleItemDragOver(item, e)}
        onDragLeave={handleItemDragLeave}
        onDrop={(e) => handleItemDrop(item, e)}
      >
        <StyledMediaThumb src={item.url} alt="" />
        <StyledExpandButton
          className="expand-button"
          onClick={(e) => handleExpand(item.url, e)}
        >
          <Expand size={12} />
        </StyledExpandButton>
        {isAdmin && (
          <>
            {isPending && pendingData?.isUploading ? (
              <StyledLoadingOverlay>
                <CircularProgress size={20} sx={{ color: 'white' }} />
              </StyledLoadingOverlay>
            ) : (
              <StyledRemoveButton
                onClick={(e) =>
                  isPending
                    ? handleRemovePending(item.id, e)
                    : handleRemoveExisting(item.id, e)
                }
              >
                <X size={12} />
              </StyledRemoveButton>
            )}
          </>
        )}
      </StyledMediaItem>
    );
  };

  // Shared lightbox component
  const lightbox = (
    <StyledLightbox open={!!lightboxUrl} onClose={handleCloseLightbox}>
      <StyledLightboxContent>
        <StyledLightboxClose onClick={handleCloseLightbox}>
          <X size={24} />
        </StyledLightboxClose>
        {lightboxUrl && <StyledLightboxImage src={lightboxUrl} alt="" />}
      </StyledLightboxContent>
    </StyledLightbox>
  );

  if (!isAdmin) {
    // Client view - just show images with expand option
    if (!hasMedia) return null;

    return (
      <StyledContainer>
        <StyledMediaGrid>
          {existingMedia.map((media) => (
            <StyledMediaItem key={media.id}>
              <StyledMediaThumb src={media.mediaUrl} alt="" />
              <StyledExpandButton
                className="expand-button"
                onClick={(e) => handleExpand(media.mediaUrl, e)}
              >
                <Expand size={12} />
              </StyledExpandButton>
            </StyledMediaItem>
          ))}
        </StyledMediaGrid>
        {lightbox}
      </StyledContainer>
    );
  }

  // Admin view - show images with upload and reorder capability
  return (
    <StyledContainer>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {hasMedia ? (
        <StyledMediaGrid>
          {allMedia.map(renderMediaItem)}

          {canAddMore && (
            <StyledAddButton onClick={handleClick}>
              <Plus size={24} />
            </StyledAddButton>
          )}
        </StyledMediaGrid>
      ) : (
        <StyledDropZone
          onClick={handleClick}
          isDragging={isDragging}
          hasMedia={hasMedia}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <StyledUploadIcon>
            <Upload size={32} />
          </StyledUploadIcon>
          <StyledUploadText>{MEDIA_UPLOAD.uploadPrompt}</StyledUploadText>
        </StyledDropZone>
      )}

      {lightbox}
    </StyledContainer>
  );
};

export default React.memo(MultiMediaUpload);
