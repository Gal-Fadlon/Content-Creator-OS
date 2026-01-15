import React from 'react';
import { Typography } from '@mui/material';
import { GRID_ITEM_MEDIA } from '@/constants/strings.constants';
import {
  StyledMedia,
  StyledVideoContainer,
  StyledVideo,
  StyledPlaceholder,
} from './GridItemMedia.style';

interface GridItemMediaProps {
  mediaUrl?: string;
  coverImageUrl?: string;
  type: 'post' | 'story' | 'reel';
  zoom: number;
  offsetX: number;
  offsetY: number;
}

const GridItemMedia: React.FC<GridItemMediaProps> = ({
  mediaUrl,
  coverImageUrl,
  type,
  zoom,
  offsetX,
  offsetY,
}) => {
  if (!coverImageUrl && !mediaUrl) {
    return (
      <StyledPlaceholder>
        <Typography variant="caption">{GRID_ITEM_MEDIA.noMedia}</Typography>
      </StyledPlaceholder>
    );
  }

  // Reel without cover shows video
  if (type === 'reel' && !coverImageUrl && mediaUrl) {
    return (
      <StyledVideoContainer>
        <StyledVideo
          src={mediaUrl}
          muted
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </StyledVideoContainer>
    );
  }

  return (
    <StyledMedia
      src={coverImageUrl || mediaUrl}
      alt=""
      zoom={zoom}
      offsetX={offsetX}
      offsetY={offsetY}
    />
  );
};

export default React.memo(GridItemMedia);
