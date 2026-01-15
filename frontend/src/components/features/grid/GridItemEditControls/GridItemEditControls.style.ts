import { styled } from '@mui/material/styles';
import { Box, Typography, Slider, IconButton } from '@mui/material';

export const StyledEditOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  cursor: 'move',
  touchAction: 'none',
}));

export const StyledDragArea = styled(Box)({
  flex: 1,
  cursor: 'move',
});

export const StyledControlsPanel = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  padding: theme.spacing(1, 1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const StyledControlRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledControlLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.625rem',
  color: theme.palette.common.white,
  minWidth: 24,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const StyledSlider = styled(Slider)(({ theme }) => ({
  flex: 1,
  color: theme.palette.secondary.main,
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
  },
  '& .MuiSlider-track': {
    height: 3,
  },
  '& .MuiSlider-rail': {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
}));

export const StyledSliderValue = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.625rem',
  color: 'rgba(255, 255, 255, 0.7)',
  minWidth: 28,
  textAlign: 'left',
}));

export const StyledDoneButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  width: 24,
  height: 24,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.875rem',
  },
}));

export const StyledCropGrid = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)
  `,
  backgroundSize: '33.333% 33.333%',
  backgroundPosition: 'center center',
});
