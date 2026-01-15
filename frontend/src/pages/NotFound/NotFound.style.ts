import { styled } from '@mui/material/styles';
import { Box, Typography, Link } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover,
}));

export const StyledContent = styled(Box)({
  textAlign: 'center',
});

export const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '2.25rem',
  fontWeight: 700,
}));

export const StyledMessage = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '1.25rem',
  color: theme.palette.text.secondary,
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'underline',
  '&:hover': {
    color: theme.palette.primary.dark,
  },
}));
