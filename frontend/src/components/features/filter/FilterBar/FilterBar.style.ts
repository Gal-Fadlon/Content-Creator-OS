import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledFilterBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));
