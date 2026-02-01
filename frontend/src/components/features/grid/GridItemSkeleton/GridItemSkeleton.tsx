import React from 'react';
import { Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSkeletonContainer = styled('div')(({ theme }) => ({
  aspectRatio: '4 / 5',
  borderRadius: Number(theme.shape.borderRadius) / 2,
  overflow: 'hidden',
}));

const GridItemSkeleton: React.FC = () => {
  return (
    <StyledSkeletonContainer>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
      />
    </StyledSkeletonContainer>
  );
};

export default React.memo(GridItemSkeleton);
