import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface StyledMediaProps {
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
}

export const StyledMedia = styled('img', {
  shouldForwardProp: (prop) => !['zoom', 'offsetX', 'offsetY'].includes(prop as string),
})<StyledMediaProps>(({ zoom = 1, offsetX = 0, offsetY = 0 }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
  transition: 'transform 0.1s ease-out',
}));

export const StyledVideoContainer = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
});

export const StyledVideo = styled('video', {
  shouldForwardProp: (prop) => !['zoom', 'offsetX', 'offsetY'].includes(prop as string),
})<StyledMediaProps>(({ zoom = 1, offsetX = 0, offsetY = 0 }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: `scale(${zoom}) translate(${offsetX}%, ${offsetY}%)`,
  transition: 'transform 0.1s ease-out',
}));

export const StyledPlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.secondary,
}));

export const StyledVideoIndicator = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(0.5),
  left: theme.spacing(0.5),
  color: theme.palette.common.white,
  fontSize: '0.75rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.shape.borderRadius / 2,
}));
