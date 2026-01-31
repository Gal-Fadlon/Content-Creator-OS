import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, IconButton } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '0.9375rem',
  color: theme.palette.text.primary,
}));

export const StyledCommentCount = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  background: theme.palette.grey[100],
  padding: '2px 8px',
  borderRadius: 10,
}));

export const StyledCommentsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxHeight: 240,
  overflowY: 'auto',
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  // Scrollbar styling
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[300],
    borderRadius: 3,
    '&:hover': {
      background: theme.palette.grey[400],
    },
  },
}));

export const StyledEmptyMessage = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  padding: theme.spacing(2),
}));

export const StyledInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-start',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    background: theme.palette.background.paper,
    fontSize: '0.875rem',
    minHeight: 40,
    padding: 0,
    alignItems: 'center',
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1.5),
    lineHeight: 1.5,
  },
}));

export const StyledSendButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  width: 40,
  height: 40,
  borderRadius: 10,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
  '&:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500],
  },
}));

export const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));
