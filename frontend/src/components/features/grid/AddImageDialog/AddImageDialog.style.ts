import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 400,
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
  gap: theme.spacing(2),
}));

export const StyledPreviewContainer = styled(Box)(({ theme }) => ({
  aspectRatio: '4 / 5',
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export const StyledPreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  gap: theme.spacing(1),
}));

export const StyledCancelButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,
  '&:hover': {
    borderColor: theme.palette.error.dark,
    backgroundColor: 'rgba(211, 47, 47, 0.04)',
  },
}));

export const StyledConfirmButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
}));
