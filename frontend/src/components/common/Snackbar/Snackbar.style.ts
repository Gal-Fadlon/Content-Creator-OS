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
  alignItems: 'flex-start',
  position: 'relative',
  paddingTop: theme.spacing(1.5),
  '& .MuiAlert-message': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
  },
  '& .MuiAlert-icon': {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.25),
  },
  '& .MuiAlert-action': {
    position: 'absolute',
    top: theme.spacing(0.5),
    left: theme.spacing(0.5),
    padding: 0,
    marginRight: 0,
  },
}));
