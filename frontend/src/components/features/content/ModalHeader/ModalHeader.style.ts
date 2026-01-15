import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';

export const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const StyledDateText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.125rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const StyledActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const StyledDeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: 'rgba(107, 27, 0, 0.1)',
  },
}));

export const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
