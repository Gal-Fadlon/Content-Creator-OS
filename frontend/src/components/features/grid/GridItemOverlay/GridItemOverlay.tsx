import React, { useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { GRID_OVERLAY } from '@/constants/strings.constants';
import {
  StyledOverlay,
  StyledOverlayButton,
} from './GridItemOverlay.style';

interface GridItemOverlayProps {
  onCoverClick: () => void;
  onEditClick: () => void;
}

const GridItemOverlay: React.FC<GridItemOverlayProps> = ({
  onCoverClick,
  onEditClick,
}) => {
  // Stop propagation to prevent drag when clicking buttons
  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick();
  }, [onEditClick]);

  const handleCoverClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCoverClick();
  }, [onCoverClick]);

  return (
    <StyledOverlay className="grid-item-overlay">
      <StyledOverlayButton
        onClick={handleEditClick}
        title={GRID_OVERLAY.adjustZoomPosition}
        size="small"
      >
        <EditIcon />
      </StyledOverlayButton>
      <StyledOverlayButton
        onClick={handleCoverClick}
        title={GRID_OVERLAY.replaceCover}
        size="small"
      >
        <SwapHorizIcon />
      </StyledOverlayButton>
    </StyledOverlay>
  );
};

export default React.memo(GridItemOverlay);
