import { styled } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  ButtonBase,
} from '@mui/material';

export { StyledTriggerContainer, StyledTriggerButton } from '@/components/shared/TriggerButton.style';

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    maxWidth: 500,
    width: '100%',
  },
});

export const StyledDialogTitle = styled(DialogTitle)({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.25rem',
  fontWeight: 600,
});

export const StyledDialogSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(-1),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const StyledBackdropGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(1.5),
}));

interface StyledBackdropOptionProps {
  isSelected?: boolean;
}

export const StyledBackdropOption = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<StyledBackdropOptionProps>(({ theme, isSelected }) => ({
  position: 'relative',
  aspectRatio: '16 / 9',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `2px solid ${isSelected ? theme.palette.info.main : theme.palette.divider}`,
  boxShadow: isSelected ? `0 0 0 2px rgba(0, 35, 102, 0.2)` : 'none',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:hover': {
    borderColor: isSelected ? theme.palette.info.main : theme.palette.secondary.main,
  },
}));

export const StyledBackdropImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

interface StyledBackdropColorProps {
  bgColor?: string;
}

export const StyledBackdropColor = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<StyledBackdropColorProps>(({ theme, bgColor }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: bgColor === 'cream' ? theme.palette.background.paper : theme.palette.background.default,
}));

export const StyledBackdropLabel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  padding: theme.spacing(0.5),
  textAlign: 'center',
}));

export const StyledBackdropLabelText = styled(Typography)({
  fontSize: '0.75rem',
  fontFamily: '"Heebo", sans-serif',
});

export const StyledSelectedIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  backgroundColor: theme.palette.info.main,
  color: theme.palette.common.white,
  borderRadius: '50%',
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledUploadSection = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const StyledUploadTitle = styled(Typography)({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
});

export const StyledUploadButton = styled(Button)(({ theme }) => ({
  gap: theme.spacing(1),
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
}));

export const StyledHiddenInput = styled('input')({
  display: 'none',
});

export const StyledApplyButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
