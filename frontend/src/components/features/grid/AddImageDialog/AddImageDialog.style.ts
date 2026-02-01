import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogActions, Box, Button } from '@mui/material';

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    maxWidth: 400,
    width: '100%',
  },
});

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

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  gap: theme.spacing(1),
}));

export const StyledConfirmButton = styled(Button)({
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
});
