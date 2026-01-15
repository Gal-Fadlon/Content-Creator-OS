import React, { useCallback, useRef, useState, useEffect } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckIcon from '@mui/icons-material/Check';
import {
  StyledEditorContainer,
  StyledImageContainer,
  StyledImage,
  StyledDragOverlay,
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
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [offsetX, setOffsetX] = useState(initialOffsetX);
  const [offsetY, setOffsetY] = useState(initialOffsetY);

  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

    setOffsetX((prev) => Math.max(-50, Math.min(50, prev + percentX)));
    setOffsetY((prev) => Math.max(-50, Math.min(50, prev + percentY)));
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, [zoom]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  const handleZoomChange = useCallback((_: Event, value: number | number[]) => {
    setZoom(value as number);
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
          draggable={false}
        />
      </StyledImageContainer>

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
          min={0.5}
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
