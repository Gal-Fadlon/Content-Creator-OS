import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

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

export const StyledPlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.secondary,
}));
