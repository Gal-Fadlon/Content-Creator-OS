import React from 'react';
import { Tooltip } from '@mui/material';
import { AVAILABLE_STICKERS, type StickerDefinition } from '@/constants/stickers.constants';
import { StyledGrid, StyledStickerButton } from './StickerGrid.style';

interface StickerGridProps {
  onStickerClick: (sticker: StickerDefinition) => void;
}

const StickerGrid: React.FC<StickerGridProps> = ({ onStickerClick }) => {
  return (
    <StyledGrid>
      {AVAILABLE_STICKERS.map((sticker) => {
        const Icon = sticker.icon;
        return (
          <Tooltip key={sticker.id} title={sticker.label} placement="top">
            <StyledStickerButton onClick={() => onStickerClick(sticker)}>
              <Icon size={24} />
            </StyledStickerButton>
          </Tooltip>
        );
      })}
    </StyledGrid>
  );
};

export default React.memo(StickerGrid);
