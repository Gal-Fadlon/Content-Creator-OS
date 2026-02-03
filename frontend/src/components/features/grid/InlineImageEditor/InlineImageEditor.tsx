import React, { useCallback, useRef, useState, useEffect } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckIcon from '@mui/icons-material/Check';
import { useImageCover } from '@/hooks/useImageCover';
import {
  StyledEditorContainer,
  StyledImageContainer,
  StyledImage,
  StyledDragOverlay,
  StyledPreviewOverlay,
  StyledCropGrid,
  StyledControlsPanel,
  StyledSlider,
  StyledSliderValue,
  StyledDoneButton,
} from './InlineImageEditor.style';

interface InlineImageEditorProps {
  imageUrl: string;
  initialZoom?: number;
  initialOffsetX?: number;
  initialOffsetY?: number;
  onSave: (zoom: number, offsetX: number, offsetY: number) => void;
  onCancel?: () => void;
  showDoneButton?: boolean;
  autoSaveOnChange?: boolean;
  showOverlay?: boolean; // Show dark overlay to match calendar view
}

const InlineImageEditor: React.FC<InlineImageEditorProps> = ({
  imageUrl,
  initialZoom = 1,
  initialOffsetX = 0,
  initialOffsetY = 0,
  onSave,
  onCancel,
  showDoneButton = true,
  autoSaveOnChange = false,
  showOverlay = false,
}) => {
  // Ensure initial zoom is at least 1 (Instagram-style: image always covers container)
  const [zoom, setZoom] = useState(Math.max(1, initialZoom));
  const [offsetX, setOffsetX] = useState(initialOffsetX);
  const [offsetY, setOffsetY] = useState(initialOffsetY);

  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { imageAspectRatio, containerAspectRatio } = useImageCover(imageUrl, containerRef);

  // Calculate max pan offset based on zoom level AND image/container aspect ratio mismatch
  // Offset is in percentage of CONTAINER size
  // The image must always cover the container - calculate how much we can move
  const getMaxOffset = useCallback((currentZoom: number, axis: 'x' | 'y') => {
    if (!imageAspectRatio || !containerAspectRatio) {
      return 0;
    }

    // Calculate image size relative to container (as percentage of container)
    // At zoom=1, the image covers the container
    const fitToHeight = imageAspectRatio > containerAspectRatio;

    let imageWidthPercent: number;
    let imageHeightPercent: number;

    if (fitToHeight) {
      // Image is wider, fit to height (100%), width is larger
      imageHeightPercent = 100;
      imageWidthPercent = (imageAspectRatio / containerAspectRatio) * 100;
    } else {
      // Image is taller, fit to width (100%), height is larger
      imageWidthPercent = 100;
      imageHeightPercent = (containerAspectRatio / imageAspectRatio) * 100;
    }

    // Apply zoom
    imageWidthPercent *= currentZoom;
    imageHeightPercent *= currentZoom;

    // Calculate how much we can move (half of overflow on each side)
    // The image is centered, so we can move by half the overflow in each direction
    if (axis === 'x') {
      const overflowX = imageWidthPercent - 100;
      return Math.max(0, overflowX / 2);
    } else {
      const overflowY = imageHeightPercent - 100;
      return Math.max(0, overflowY / 2);
    }
  }, [imageAspectRatio, containerAspectRatio]);

  // Constrain offset values based on current zoom and axis
  const constrainOffset = useCallback((offset: number, currentZoom: number, axis: 'x' | 'y') => {
    const maxOffset = getMaxOffset(currentZoom, axis);
    return Math.max(-maxOffset, Math.min(maxOffset, offset));
  }, [getMaxOffset]);

  // Constrain offsets when zoom changes or image loads (bounce-back effect)
  useEffect(() => {
    const constrainedX = constrainOffset(offsetX, zoom, 'x');
    const constrainedY = constrainOffset(offsetY, zoom, 'y');

    if (constrainedX !== offsetX || constrainedY !== offsetY) {
      setOffsetX(constrainedX);
      setOffsetY(constrainedY);
    }
  }, [zoom, offsetX, offsetY, constrainOffset, imageAspectRatio]);

  // Auto-save when values change (for dialog use case)
  useEffect(() => {
    if (autoSaveOnChange) {
      onSave(zoom, offsetX, offsetY);
    }
  }, [zoom, offsetX, offsetY, autoSaveOnChange, onSave]);

  // Keyboard event handler for Enter (save) and Escape (cancel)
  useEffect(() => {
    if (!showDoneButton) return; // Only handle keyboard in edit mode

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSave(zoom, offsetX, offsetY);
      } else if (e.key === 'Escape' && onCancel) {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDoneButton, zoom, offsetX, offsetY, onSave, onCancel]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.stopPropagation();

    const containerRect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;

    // Convert pixel movement to percentage (scaled by zoom)
    const percentX = (deltaX / containerRect.width) * 100 / zoom;
    const percentY = (deltaY / containerRect.height) * 100 / zoom;

    // Apply constraints: can pan within zoomed area AND natural overflow area
    setOffsetX((prev) => constrainOffset(prev + percentX, zoom, 'x'));
    setOffsetY((prev) => constrainOffset(prev + percentY, zoom, 'y'));
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, [zoom, constrainOffset]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    // Minimum zoom is 1 (image always covers container, Instagram-style)
    setZoom((prev) => Math.max(1, Math.min(3, prev + delta)));
  }, []);

  const handleZoomChange = useCallback((_: Event, value: number | number[]) => {
    // Ensure minimum zoom of 1 (Instagram-style: image always covers container)
    setZoom(Math.max(1, value as number));
  }, []);

  const handleDoneClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(zoom, offsetX, offsetY);
  }, [zoom, offsetX, offsetY, onSave]);

  // Auto-save on change (for dialog use case without done button)
  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <StyledEditorContainer ref={containerRef}>
      {/* Image with transformations */}
      <StyledImageContainer>
        <StyledImage
          src={imageUrl}
          alt="Edit"
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
          imageAspectRatio={imageAspectRatio}
          containerAspectRatio={containerAspectRatio}
          draggable={false}
        />
      </StyledImageContainer>

      {/* Preview overlay to show how it will look in calendar */}
      {showOverlay && <StyledPreviewOverlay />}

      {/* Drag overlay for panning */}
      <StyledDragOverlay
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Crop grid */}
      <StyledCropGrid />

      {/* Controls at bottom */}
      <StyledControlsPanel onMouseDown={handlePanelMouseDown}>
        <ZoomInIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
        <StyledSlider
          value={zoom}
          onChange={handleZoomChange}
          min={1}
          max={3}
          step={0.05}
          size="small"
        />
        <StyledSliderValue>{Math.round(zoom * 100)}%</StyledSliderValue>
        {showDoneButton && (
          <StyledDoneButton onClick={handleDoneClick} size="small">
            <CheckIcon />
          </StyledDoneButton>
        )}
      </StyledControlsPanel>
    </StyledEditorContainer>
  );
};

export default React.memo(InlineImageEditor);
