import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const StyledCalendarContainer = styled(Box)({
  position: 'relative',
});

export const StyledCalendarPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  backgroundColor: 'rgba(247, 245, 240, 0.85)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));
