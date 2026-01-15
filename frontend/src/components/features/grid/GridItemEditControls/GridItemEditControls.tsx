import React, { useCallback } from 'react';
import InlineImageEditor from '../InlineImageEditor/InlineImageEditor';

interface GridItemEditControlsProps {
  imageUrl: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onZoomChange: (zoom: number) => void;
  onOffsetChange: (x: number, y: number) => void;
  onDoneEditing: () => void;
  onCancelEditing: () => void;
}

const GridItemEditControls: React.FC<GridItemEditControlsProps> = ({
  imageUrl,
  zoom,
  offsetX,
  offsetY,
  onZoomChange,
  onOffsetChange,
  onDoneEditing,
  onCancelEditing,
}) => {
  const handleSave = useCallback(
    (newZoom: number, newOffsetX: number, newOffsetY: number) => {
      onZoomChange(newZoom);
      onOffsetChange(newOffsetX, newOffsetY);
      onDoneEditing();
    },
    [onZoomChange, onOffsetChange, onDoneEditing]
  );

  return (
    <InlineImageEditor
      imageUrl={imageUrl}
      initialZoom={zoom}
      initialOffsetX={offsetX}
      initialOffsetY={offsetY}
      onSave={handleSave}
      onCancel={onCancelEditing}
      showDoneButton={true}
    />
  );
};

export default React.memo(GridItemEditControls);
