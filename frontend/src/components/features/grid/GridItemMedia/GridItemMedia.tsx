import React from 'react';
import { Typography } from '@mui/material';
import { GRID_ITEM_MEDIA } from '@/constants/strings.constants';
import {
  StyledMedia,
  StyledPlaceholder,
} from './GridItemMedia.style';
import type { ContentType } from '@/types/content';

interface GridItemMediaProps {
  mediaUrl?: string;
  coverImageUrl?: string;
  type: ContentType;
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

  // Always show image in grid - this is an Instagram grid preview
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
