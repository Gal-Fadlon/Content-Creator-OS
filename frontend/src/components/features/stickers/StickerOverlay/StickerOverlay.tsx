import React from 'react';
import DraggableSticker from '../DraggableSticker/DraggableSticker';
import { useStickerDrag } from './useStickerDrag';
import { StyledOverlay } from './StickerOverlay.style';

interface StickerOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const StickerOverlay: React.FC<StickerOverlayProps> = () => {
  const {
    dragging,
    isAdmin,
    stickers,
    removeSticker,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useStickerDrag();

  return (
    <StyledOverlay
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {stickers.map((sticker) => (
        <DraggableSticker
          key={sticker.visibleId}
          sticker={sticker}
          isAdmin={isAdmin}
          isDragging={dragging === sticker.visibleId}
          onMouseDown={handleMouseDown}
          onDoubleClick={removeSticker}
        />
      ))}
    </StyledOverlay>
  );
};

export default React.memo(StickerOverlay);
