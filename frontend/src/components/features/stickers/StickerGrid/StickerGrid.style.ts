import { styled } from '@mui/material/styles';
import { Box, ButtonBase } from '@mui/material';

export const StyledGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const StyledStickerButton = styled(ButtonBase)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));
