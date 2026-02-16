import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledBoardRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  flex: 1,
  overflowX: 'auto',
  padding: theme.spacing(0, 0, 2, 0),
  // Custom scrollbar
  '&::-webkit-scrollbar': {
    height: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(130, 61, 34, 0.2)',
    borderRadius: 3,
  },
}));
