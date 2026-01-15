import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, TextField } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
}));

export const StyledLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.5,
  color: theme.palette.secondary.main,
}));

export const StyledDivider = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
}));

interface StyledThemeTextProps {
  isPlaceholder?: boolean;
}

export const StyledThemeText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isPlaceholder',
})<StyledThemeTextProps>(({ theme, isPlaceholder }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 400,
  lineHeight: 1.5,
  fontStyle: isPlaceholder ? 'italic' : 'normal',
  color: theme.palette.text.disabled,
}));

export const StyledEditContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledThemeInput = styled(TextField)(({ theme }) => ({
  minWidth: 200,
  '& .MuiInputBase-root': {
    fontFamily: '"Heebo", sans-serif',
    fontSize: '0.875rem',
    fontStyle: 'italic',
    color: theme.palette.text.disabled,
    '&::before': {
      borderBottomColor: 'rgba(200, 173, 127, 0.5)',
    },
    '&:hover::before': {
      borderBottomColor: theme.palette.secondary.main,
    },
    '&::after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1),
    textAlign: 'right',
    '&::placeholder': {
      fontFamily: '"Heebo", sans-serif',
      fontSize: '0.875rem',
      fontStyle: 'italic',
      color: theme.palette.text.disabled,
      opacity: 1,
    },
  },
}));

export const StyledSaveButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.success.main,
  padding: theme.spacing(0.75),
  '&:hover': {
    backgroundColor: 'rgba(200, 173, 127, 0.2)',
  },
}));

export const StyledCancelButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.75),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledDisplayContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
}));

export const StyledEditButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  opacity: 0,
  color: 'rgba(200, 173, 127, 0.6)',
  transition: theme.transitions.create(['opacity', 'color']),
  '&:hover': {
    backgroundColor: 'rgba(200, 173, 127, 0.2)',
    color: theme.palette.secondary.main,
  },
}));
