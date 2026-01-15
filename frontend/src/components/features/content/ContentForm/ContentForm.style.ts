import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const StyledApproveButton = styled(Button)(({ theme }) => ({
  width: '100%',
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  gap: theme.spacing(1),
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));
