import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, Box, Button, Typography } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 500,
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    direction: 'rtl',
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  background: 'linear-gradient(180deg, rgba(247, 245, 240, 0.95) 0%, rgba(247, 245, 240, 1) 100%)',
}));

export const StyledHiddenInput = styled('input')({
  display: 'none',
});

export const StyledClientMessage = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export const StyledClientMessageText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
}));

export const StyledSaveButton = styled(Button)(({ theme }) => ({
  width: '100%',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
  color: theme.palette.common.white,
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%)',
  },
}));
