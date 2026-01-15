import { styled } from '@mui/material/styles';
import { Box, Typography, TextField } from '@mui/material';

export const StyledFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const StyledLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  textAlign: 'right',
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
  backgroundColor: 'rgba(200, 173, 127, 0.1)',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid rgba(200, 173, 127, 0.2)`,
  direction: 'rtl',
  textAlign: 'right',
}));

export const StyledReadOnlyText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  textAlign: 'right',
  direction: 'rtl',
}));
