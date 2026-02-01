import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledGridViewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const StyledHiddenInput = styled('input')({
  display: 'none',
});

export const StyledGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 200px)',
  gap: theme.spacing(0.5),
  justifyContent: 'center',
  margin: '0 auto',
}));

export const StyledEmptyMessage = styled(Box)(({ theme }) => ({
  gridColumn: '1 / -1',
  textAlign: 'center',
  padding: theme.spacing(6, 0),
  color: theme.palette.text.secondary,
  fontFamily: '"Heebo", sans-serif',
}));
