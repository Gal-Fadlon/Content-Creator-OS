import { styled } from '@mui/material/styles';
import { Box, Slider, IconButton } from '@mui/material';

export const StyledEditorContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

export const StyledImageContainer = styled(Box)({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
});

interface StyledImageProps {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export const StyledImage = styled('img', {
  shouldForwardProp: (prop) => !['zoom', 'offsetX', 'offsetY'].includes(prop as string),
})<StyledImageProps>(({ zoom, offsetX, offsetY }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
  transition: 'transform 0.1s ease-out',
}));

export const StyledDragOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  cursor: 'move',
  touchAction: 'none',
});

// Optional overlay to match calendar view (so user sees what it will look like)
export const StyledPreviewOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
  pointerEvents: 'none',
  zIndex: 0,
});

export const StyledCropGrid = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
  `,
  backgroundSize: '33.333% 33.333%',
  backgroundPosition: 'center center',
});

export const StyledControlsPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  padding: theme.spacing(1, 1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledSlider = styled(Slider)(({ theme }) => ({
  flex: 1,
  color: theme.palette.secondary.main,
  '& .MuiSlider-thumb': {
    width: 14,
    height: 14,
  },
  '& .MuiSlider-track': {
    height: 3,
  },
  '& .MuiSlider-rail': {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

export const StyledSliderValue = styled(Box)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.7)',
  minWidth: 36,
  textAlign: 'center',
}));

export const StyledDoneButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  width: 28,
  height: 28,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
}));
