import { styled } from '@mui/material/styles';
import { Box, IconButton, alpha } from '@mui/material';

export const StyledOverlay = styled(Box, {
  name: 'GridItemOverlay',
  slot: 'Root',
})(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: theme.transitions.create('opacity'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  pointerEvents: 'none', // Allow drag through overlay
}));

export const StyledOverlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  color: theme.palette.common.white,
  padding: theme.spacing(1.5),
  transition: theme.transitions.create(['background-color', 'transform']),
  pointerEvents: 'auto', // Enable click on buttons
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: 'scale(1.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
}));

