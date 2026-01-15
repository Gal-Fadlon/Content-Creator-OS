import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';

export const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledNavigationRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(1.5),
}));

export const StyledNavButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(200, 173, 127, 0.2)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
  },
}));

export const StyledMonthContainer = styled(Box)({
  textAlign: 'center',
});

export const StyledMonthName = styled(Typography)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '3.5rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

export const StyledYear = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '1.125rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.2em',
  marginTop: theme.spacing(0.5),
}));

export const StyledThemeContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const StyledThemeLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

export const StyledThemeText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Amatic SC", cursive',
  fontSize: '1.5rem',
  color: theme.palette.info.main,
  marginTop: theme.spacing(0.5),
}));
