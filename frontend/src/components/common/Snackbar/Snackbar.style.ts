import { styled } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';

export const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    fontFamily: '"Heebo", sans-serif',
  },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  alignItems: 'center',
  '& .MuiAlert-message': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
  },
  '& .MuiAlert-icon': {
    marginRight: theme.spacing(1),
  },
}));
