import { styled } from '@mui/material/styles';
import { Box, IconButton, Paper, Typography, Chip } from '@mui/material';

export const StyledBankContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  /* @noflip */
  right: theme.spacing(2),
  left: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 50,
}));

interface StyledToggleButtonProps {
  isExpanded?: boolean;
}

export const StyledToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<StyledToggleButtonProps>(({ theme, isExpanded }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: isExpanded ? theme.palette.secondary.main : theme.palette.background.paper,
  border: `1px solid ${theme.palette.secondary.main}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: isExpanded ? theme.palette.secondary.light : theme.palette.action.hover,
  },
}));

export const StyledDrawer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  /* @noflip */
  right: 56,
  left: 'auto',
  top: '50%',
  transform: 'translateY(-50%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  animation: 'fadeIn 0.2s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(-50%) translateX(10px)' },
    to: { opacity: 1, transform: 'translateY(-50%) translateX(0)' },
  },
}));

export const StyledDrawerTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textAlign: 'center',
  fontWeight: 500,
  marginBottom: theme.spacing(1.5),
}));

export const StyledPlacedCount = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  /* @noflip */
  right: 0,
  left: 'auto',
  top: 64,
  height: 'auto',
  fontSize: '0.75rem',
  fontFamily: '"Heebo", sans-serif',
  backgroundColor: 'rgba(247, 245, 240, 0.8)',
  '& .MuiChip-label': {
    padding: theme.spacing(0.5, 1),
  },
}));
