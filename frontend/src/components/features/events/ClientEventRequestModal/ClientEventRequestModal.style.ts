import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
} from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 450,
    width: '100%',
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.25rem',
  fontWeight: 600,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  paddingTop: theme.spacing(2),
}));

export const StyledFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const StyledLabel = styled(InputLabel)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'flex-end',
  gap: theme.spacing(0.5),
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Heebo", sans-serif',
  },
}));

export const StyledDateButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textAlign: 'start',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 400,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  '&:hover': {
    borderColor: theme.palette.text.primary,
  },
  // Fix icon overlap with text in RTL
  '& .MuiButton-startIcon': {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
}));

export const StyledSubmitButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  gap: theme.spacing(1),
  // Reverse order so icon is on the left in RTL, and flip the icon to point left
  flexDirection: 'row-reverse',
  '& .MuiSvgIcon-root': {
    transform: 'scaleX(-1)',
  },
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));
