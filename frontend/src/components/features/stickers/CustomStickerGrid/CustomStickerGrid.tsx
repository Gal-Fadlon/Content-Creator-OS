import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from '@mui/material';
import { CUSTOM_STICKER_GRID } from '@/constants/strings.constants';
import {
  StyledContainer,
  StyledTitle,
  StyledGrid,
  StyledStickerWrapper,
  StyledStickerButton,
  StyledStickerImage,
  StyledRemoveButton,
} from './CustomStickerGrid.style';

interface CustomSticker {
  id: string;
  imageUrl: string;
  label: string;
}

interface CustomStickerGridProps {
  stickers: CustomSticker[];
  onStickerClick: (sticker: CustomSticker) => void;
  onRemove: (stickerId: string) => void;
}

const CustomStickerGrid: React.FC<CustomStickerGridProps> = ({
  stickers,
  onStickerClick,
  onRemove,
}) => {
  if (stickers.length === 0) return null;

  return (
    <StyledContainer>
      <StyledTitle>{CUSTOM_STICKER_GRID.title}</StyledTitle>
      <StyledGrid>
        {stickers.map((sticker) => (
          <StyledStickerWrapper key={sticker.id}>
            <Tooltip title={sticker.label} placement="top">
              <StyledStickerButton onClick={() => onStickerClick(sticker)}>
                <StyledStickerImage src={sticker.imageUrl} alt={sticker.label} />
              </StyledStickerButton>
            </Tooltip>
            <StyledRemoveButton
              onClick={() => onRemove(sticker.id)}
              size="small"
            >
              <CloseIcon />
            </StyledRemoveButton>
          </StyledStickerWrapper>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
};

export default React.memo(CustomStickerGrid);
