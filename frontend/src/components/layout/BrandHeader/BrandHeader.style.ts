import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledBrandHeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2.5, 0),
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 10,
}));

export const StyledBrandTitle = styled(Typography)({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.5rem',
  letterSpacing: '0.2em',
  fontWeight: 400,
});
