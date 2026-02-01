import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, Box, Button, TextField, ButtonBase, IconButton, Typography } from '@mui/material';

export const StyledTriggerButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
  gap: theme.spacing(1),
  fontSize: '0.75rem',
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
}));

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    maxWidth: 450,
    width: '100%',
  },
});

export const StyledDialogTitle = styled(DialogTitle)({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.25rem',
  fontWeight: 600,
});

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const StyledUploadArea = styled(ButtonBase)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: theme.transitions.create('border-color'),
  '&:hover': {
    borderColor: theme.palette.secondary.main,
  },
}));

export const StyledUploadIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const StyledUploadText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

export const StyledUploadSubtext = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.disabled,
}));

export const StyledPreviewContainer = styled(Box)({
  position: 'relative',
});

export const StyledPreviewImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 192,
  objectFit: 'contain',
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
}));

export const StyledClearButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  width: 20,
  height: 20,
  padding: 2,
  '& .MuiSvgIcon-root': {
    fontSize: '0.875rem',
  },
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

export const StyledHiddenInput = styled('input')({
  display: 'none',
});

export const StyledLabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const StyledLabel = styled(Typography)({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
});

export const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontFamily: '"Heebo", sans-serif',
    fontSize: '0.875rem',
  },
});

export const StyledActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const StyledSaveButton = styled(Button)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(1),
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  color: theme.palette.common.white,
  '&.Mui-disabled': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));
