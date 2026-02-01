import { styled } from '@mui/material/styles';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';

export const StyledModeToggleContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

export const StyledToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'transparent',
  gap: theme.spacing(1.5),
  '& .MuiToggleButtonGroup-grouped': {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: `${theme.spacing(3)} !important`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  },
}));

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  color: theme.palette.text.secondary,
  gap: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(200, 173, 127, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
}));
