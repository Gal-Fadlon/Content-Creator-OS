import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledOverlay = styled(Box)({
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 30,
});
