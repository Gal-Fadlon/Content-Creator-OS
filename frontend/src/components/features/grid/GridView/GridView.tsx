import React, { useState, useCallback } from 'react';
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
    handleAddNewImage,
    handleConfirmAddImage,
    handleCancelAdd,
    handleAddButtonClick,
    handleDeleteItem,
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

  return (
    <StyledGridViewContainer>
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
