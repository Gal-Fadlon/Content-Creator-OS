import { styled } from '@mui/material/styles';
import { Box, Typography, ButtonBase, IconButton } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export const StyledGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1),
}));

export const StyledStickerWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
}));

export const StyledStickerButton = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledStickerImage = styled('img')({
  width: 32,
  height: 32,
  objectFit: 'contain',
  margin: '0 auto',
});

export const StyledRemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: -4,
  right: -4,
  width: 16,
  height: 16,
  padding: 0,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  opacity: 0,
  transition: theme.transitions.create('opacity'),
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.75rem',
  },
}));
