import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';

interface StyledFilterPillProps {
  isActive?: boolean;
  variant?: 'default' | 'warning';
}

export const StyledFilterPill = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'variant',
})<StyledFilterPillProps>(({ theme, isActive, variant = 'default' }) => {
  const isWarning = variant === 'warning';
  
  return {
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(3),
    fontSize: '0.875rem',
    fontFamily: '"Heebo", sans-serif',
    fontWeight: 500,
    height: 'auto',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${theme.palette.divider}`,
    
    // Default inactive state
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    
    // Active state - same for all variants
    ...(isActive && {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      borderColor: 'rgba(0, 0, 0, 0.2)',
    }),
    
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.3)',
      backgroundColor: isActive 
        ? theme.palette.secondary.light
        : theme.palette.action.hover,
    },
    
    '& .MuiChip-label': {
      padding: theme.spacing(0.5, 1.5),
    },
  };
});
