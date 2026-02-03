import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { getCoverImageStyles } from '@/helpers/imageStyles.helper';

interface StyledMediaProps {
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  imageAspectRatio?: number | null;
  containerAspectRatio?: number | null;
}

export const StyledMedia = styled('img', {
  shouldForwardProp: (prop) => !['zoom', 'offsetX', 'offsetY', 'imageAspectRatio', 'containerAspectRatio'].includes(prop as string),
})<StyledMediaProps>(({ zoom = 1, offsetX = 0, offsetY = 0, imageAspectRatio, containerAspectRatio }) =>
  getCoverImageStyles({ zoom, offsetX, offsetY, imageAspectRatio, containerAspectRatio })
);

export const StyledPlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.text.secondary,
}));
