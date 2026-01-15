import { styled } from '@mui/material/styles';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';

export const StyledTypeSelectorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const StyledToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: '100%',
  direction: 'ltr',
  '& .MuiToggleButtonGroup-grouped': {
    flex: 1,
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:first-of-type)': {
      marginLeft: -1,
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
  },
}));

export const StyledTypeButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  borderRadius: theme.spacing(3),
  textTransform: 'uppercase',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  '&.Mui-selected': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
    color: theme.palette.text.primary,
    borderColor: 'transparent',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
    },
  },
}));
