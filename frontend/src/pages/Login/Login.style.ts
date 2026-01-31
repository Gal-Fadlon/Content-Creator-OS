/**
 * Login Page Styles
 */

import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

export const StyledLoginPage = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #f0ebe3 50%, ${theme.palette.background.paper} 100%)`,
  padding: theme.spacing(2),
}));

export const StyledLoginCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 420,
  padding: theme.spacing(5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08)',
  textAlign: 'center',
}));

export const StyledLogo = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  boxShadow: '0 8px 24px rgba(130, 61, 34, 0.3)',
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Playfair Display", serif',
  fontSize: '1.75rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const StyledSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
}));

export const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
}));

export const StyledInputGroup = styled(Box)({
  textAlign: 'right',
});

export const StyledLabel = styled('label')(({ theme }) => ({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.75),
}));

export const StyledInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '14px 16px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  border: `1.5px solid ${theme.palette.divider}`,
  borderRadius: 12,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  direction: 'rtl',
  textAlign: 'right',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',

  '&::placeholder': {
    color: theme.palette.text.disabled,
  },

  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
  },

  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    cursor: 'not-allowed',
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '14px 24px',
  marginTop: theme.spacing(1),
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: 12,
  textTransform: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  boxShadow: '0 4px 16px rgba(130, 61, 34, 0.3)',
  transition: 'transform 0.2s, box-shadow 0.2s',

  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: '0 6px 20px rgba(130, 61, 34, 0.4)',
    transform: 'translateY(-1px)',
  },

  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    boxShadow: 'none',
  },
}));

export const StyledError = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: `${theme.palette.error.main}10`,
  border: `1px solid ${theme.palette.error.main}30`,
  borderRadius: 8,
  color: theme.palette.error.main,
  fontSize: '0.875rem',
  textAlign: 'center',
}));

export const StyledFooter = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  fontSize: '0.75rem',
  color: theme.palette.text.disabled,
}));
