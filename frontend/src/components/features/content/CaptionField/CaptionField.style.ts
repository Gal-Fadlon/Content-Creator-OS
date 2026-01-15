import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';

export const StyledFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const StyledLabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StyledLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  textAlign: 'right',
}));

export const StyledCopyButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.secondary.main,
  gap: theme.spacing(0.5),
  '&:hover': {
    color: theme.palette.secondary.dark,
    backgroundColor: 'rgba(200, 173, 127, 0.1)',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  direction: 'rtl',
  '& .MuiOutlinedInput-root': {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Heebo", sans-serif',
    textAlign: 'right',
  },
}));

export const StyledReadOnlyBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  direction: 'rtl',
  textAlign: 'right',
}));

export const StyledReadOnlyText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  whiteSpace: 'pre-wrap',
  textAlign: 'right',
  direction: 'rtl',
}));
