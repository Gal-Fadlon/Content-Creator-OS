import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledAppLayoutRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  width: '100%',
});

export const StyledMainContent = styled(Box)({
  flex: 1,
  minWidth: 0,
  minHeight: '100vh',
});
