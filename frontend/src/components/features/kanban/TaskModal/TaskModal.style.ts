import { styled } from '@mui/material/styles';
import { Box, TextField, Typography } from '@mui/material';

export const StyledModalContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  padding: theme.spacing(1, 0),
}));

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
}));

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Heebo", sans-serif',
  },
  '& .MuiSelect-select': {
    lineHeight: 1.8,
  },
  '& .MuiSelect-icon': {
    left: 'auto',
    right: 7,
  },
});

export const StyledFieldRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const StyledColorPalette = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

interface StyledColorSwatchProps {
  swatchColor: string;
  selected?: boolean;
}

export const StyledColorSwatch = styled('button', {
  shouldForwardProp: (prop) => prop !== 'swatchColor' && prop !== 'selected',
})<StyledColorSwatchProps>(({ swatchColor, selected }) => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: selected ? '2px solid #333' : '2px solid transparent',
  backgroundColor: swatchColor,
  cursor: 'pointer',
  outline: 'none',
  transition: 'transform 0.1s ease, border-color 0.1s ease',
  '&:hover': {
    transform: 'scale(1.15)',
  },
}));

export const StyledModalActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StyledDialogTitle = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const StyledColorLabelText = styled('div')(({ theme }) => ({
  fontSize: '0.85rem',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const StyledActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const StyledClearColorSwatch = styled('button')(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  outline: 'none',
  transition: 'transform 0.1s ease',
  '&:hover': {
    transform: 'scale(1.15)',
  },
}));
