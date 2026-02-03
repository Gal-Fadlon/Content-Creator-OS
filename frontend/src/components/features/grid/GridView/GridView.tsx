import React, { useState, useCallback, useRef } from 'react';
import GridItem from '../GridItem/GridItem';
import GridItemSkeleton from '../GridItemSkeleton/GridItemSkeleton';
import AddImageButton from '../AddImageButton/AddImageButton';
import AddImageDialog from '../AddImageDialog/AddImageDialog';
import { useGridContent } from './useGridContent';
import { useGridDragDrop } from './useGridDragDrop';
import { GRID_VIEW } from '@/constants/strings.constants';
import {
  StyledGridViewContainer,
  StyledHiddenInput,
  StyledGrid,
  StyledEmptyMessage,
  StyledDropZoneOverlay,
} from './GridView.style';

const InteractiveGridView: React.FC = () => {
  const {
    isAdmin,
    showSkeletons,
    skeletonCount,
    clientContent,
    fileInputRef,
    addFileInputRef,
    showAddDialog,
    setShowAddDialog,
    newImagePreview,
    deletingItemId,
    handleCoverUploadClick,
    handleFileChange,
    handleZoomChange,
    handleOffsetChange,
    handleTypeChange,
    handleAddNewImage,
    handleConfirmAddImage,
    handleCancelAdd,
    handleAddButtonClick,
    handleDeleteItem,
    handleFilesDrop,
  } = useGridContent();

  const {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useGridDragDrop(clientContent);

  // Inline editing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // File drop zone state
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleEditClick = useCallback((itemId: string) => {
    setEditingItemId(itemId);
  }, []);

  const handleEditDone = useCallback(() => {
    setEditingItemId(null);
  }, []);

  // Cancel editing without saving - just close the editor
  const handleEditCancel = useCallback(() => {
    setEditingItemId(null);
  }, []);

  // File drop handlers (for dropping files from OS)
  const handleFileDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    // Only show overlay if dragging files (not internal grid items)
    if (e.dataTransfer.types.includes('Files') && isAdmin) {
      setIsFileDragOver(true);
    }
  }, [isAdmin]);

  const handleFileDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsFileDragOver(false);
    }
  }, []);

  const handleFileDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsFileDragOver(false);

    // Only process if it's a file drop (not internal drag)
    if (!e.dataTransfer.types.includes('Files')) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesDrop(files);
    }
  }, [handleFilesDrop]);

  return (
    <StyledGridViewContainer
      onDragEnter={handleFileDragEnter}
      onDragLeave={handleFileDragLeave}
      onDragOver={handleFileDragOver}
      onDrop={handleFileDrop}
    >
      {/* Drop zone overlay */}
      {isFileDragOver && (
        <StyledDropZoneOverlay>
          {GRID_VIEW.dropZoneMessage}
        </StyledDropZoneOverlay>
      )}

      {/* Hidden file inputs */}
      <StyledHiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <StyledHiddenInput
        ref={addFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAddNewImage}
      />

      {/* 3-Column Grid with 4:5 aspect ratio - Instagram style */}
      <StyledGrid>
        {/* Show skeletons while loading */}
        {showSkeletons && (
          Array.from({ length: skeletonCount }).map((_, index) => (
            <GridItemSkeleton key={`skeleton-${index}`} />
          ))
        )}

        {/* Show actual content when loaded */}
        {!showSkeletons && clientContent.map((item) => (
          <GridItem
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            isEditing={editingItemId === item.id}
            isDeleting={deletingItemId === item.id}
            isDragged={draggedItem === item.id}
            isDragOver={dragOverItem === item.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onCoverClick={() => handleCoverUploadClick(item.id)}
            onEditClick={() => handleEditClick(item.id)}
            onDeleteClick={() => handleDeleteItem(item.id)}
            onEditDone={handleEditDone}
            onEditCancel={handleEditCancel}
            onZoomChange={(zoom) => handleZoomChange(item.id, zoom)}
            onOffsetChange={(x, y) => handleOffsetChange(item.id, x, y)}
            onTypeChange={(type) => handleTypeChange(item.id, type)}
          />
        ))}

        {/* Add new image button - always at the end for admin */}
        {isAdmin && <AddImageButton onClick={handleAddButtonClick} />}

        {clientContent.length === 0 && !isAdmin && !showSkeletons && (
          <StyledEmptyMessage>
            {GRID_VIEW.emptyMessage}
          </StyledEmptyMessage>
        )}
      </StyledGrid>

      {/* Add Image Dialog */}
      <AddImageDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        imagePreview={newImagePreview}
        onConfirm={handleConfirmAddImage}
        onCancel={handleCancelAdd}
      />
    </StyledGridViewContainer>
  );
};

export default React.memo(InteractiveGridView);
