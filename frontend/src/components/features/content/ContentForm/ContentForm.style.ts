import { styled } from '@mui/material/styles';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

export const StyledButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

export const StyledApproveButton = styled(Button)(({ theme }) => ({
  flex: 1,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  gap: theme.spacing(1),
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

export const StyledRejectButton = styled(Button)(({ theme }) => ({
  flex: 1,
  background: theme.palette.background.paper,
  color: theme.palette.error.main,
  border: `1px solid ${theme.palette.error.main}`,
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  gap: theme.spacing(1),
  '&:hover': {
    background: theme.palette.error.light,
    borderColor: theme.palette.error.dark,
  },
}));

export const StyledRejectDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(1),
    minWidth: 360,
  },
}));

export const StyledRejectDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  textAlign: 'center',
  color: theme.palette.error.main,
}));

export const StyledRejectDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

export const StyledRejectTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
  },
}));

export const StyledRejectDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));
