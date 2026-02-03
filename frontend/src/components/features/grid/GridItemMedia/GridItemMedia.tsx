import React, { useRef } from 'react';
import { Typography, Box } from '@mui/material';
import { GRID_ITEM_MEDIA } from '@/constants/strings.constants';
import { useImageCover } from '@/hooks/useImageCover';
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
  zoom,
  offsetX,
  offsetY,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUrl = coverImageUrl || mediaUrl;
  const { imageAspectRatio, containerAspectRatio } = useImageCover(imageUrl, containerRef);

  if (!imageUrl) {
    return (
      <StyledPlaceholder>
        <Typography variant="caption">{GRID_ITEM_MEDIA.noMedia}</Typography>
      </StyledPlaceholder>
    );
  }

  // Always show image in grid - this is an Instagram grid preview
  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <StyledMedia
        src={imageUrl}
        alt=""
        zoom={zoom}
        offsetX={offsetX}
        offsetY={offsetY}
        imageAspectRatio={imageAspectRatio}
        containerAspectRatio={containerAspectRatio}
      />
    </Box>
  );
};

export default React.memo(GridItemMedia);
