import React from 'react';
import { ICON_MAP } from '@/constants/stickers.constants';
import { DRAGGABLE_STICKER } from '@/constants/strings.constants';
import type { PlacedSticker } from '@/types/content';
import {
  StyledSticker,
  StyledStickerImage,
  StyledStickerIcon,
} from './DraggableSticker.style';

interface DraggableStickerProps {
  sticker: PlacedSticker;
  isAdmin: boolean;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, sticker: PlacedSticker) => void;
  onDoubleClick: (visibleId: string) => void;
}

const DraggableSticker: React.FC<DraggableStickerProps> = ({
  sticker,
  isAdmin,
  isDragging,
  onMouseDown,
  onDoubleClick,
}) => {
  const isCustom = sticker.iconType === 'custom';
  const IconComponent = !isCustom && sticker.lucideIcon ? ICON_MAP[sticker.lucideIcon] : null;

  return (
    <StyledSticker
      isAdmin={isAdmin}
      isDragging={isDragging}
      stickerColor={sticker.color}
      style={{
        left: sticker.x,
        top: sticker.y,
        transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
      }}
      onMouseDown={(e) => onMouseDown(e, sticker)}
      onDoubleClick={() => isAdmin && onDoubleClick(sticker.visibleId)}
      title={isAdmin ? DRAGGABLE_STICKER.adminTooltip : sticker.label}
    >
      {isCustom && sticker.icon ? (
        <StyledStickerImage src={sticker.icon} alt={sticker.label} />
      ) : IconComponent ? (
        <StyledStickerIcon as={IconComponent} />
      ) : null}
    </StyledSticker>
  );
};

export default React.memo(DraggableSticker);
