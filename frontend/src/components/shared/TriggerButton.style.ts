import { styled } from '@mui/material/styles';
import { Button, Box } from '@mui/material';

// Container to match ViewToggle exactly
export const StyledTriggerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  padding: 4,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
}));

export const StyledTriggerButton = styled(Button)(({ theme }) => ({
  height: 30,
  gap: 6,
  paddingLeft: 12,
  paddingRight: 12,
  borderRadius: 6,
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  fontSize: '0.8125rem',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiButton-startIcon': {
    margin: 0,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
}));
