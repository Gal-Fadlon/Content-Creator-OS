import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledGridContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

export const StyledDayHeadersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  marginBottom: theme.spacing(1.5),
}));

export const StyledDayHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1, 0),
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const StyledDaysGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(0.5),
}));
