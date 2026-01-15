import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const StyledViewToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  padding: 4,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
}));

interface StyledViewButtonProps {
  isActive?: boolean;
}

export const StyledViewButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<StyledViewButtonProps>(({ theme, isActive }) => ({
  height: 30,
  paddingLeft: 12,
  paddingRight: 12,
  borderRadius: 6,
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.8125rem',
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 'auto',
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: isActive ? 'rgba(200, 173, 127, 0.2)' : 'transparent',
  boxShadow: isActive ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
  '&:hover': {
    backgroundColor: isActive 
      ? 'rgba(200, 173, 127, 0.3)' 
      : theme.palette.action.hover,
  },
  gap: 6,
  '& .MuiButton-startIcon': {
    margin: 0,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
  },
}));
