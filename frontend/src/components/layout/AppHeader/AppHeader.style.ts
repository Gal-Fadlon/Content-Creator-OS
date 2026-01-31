import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box, Typography, Button, IconButton } from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: 'rgba(247, 245, 240, 0.9)', // cream with opacity
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  zIndex: theme.zIndex.appBar,
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1, 2),
  minHeight: 64,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1, 3),
  },
}));

export const StyledLogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const StyledLogoTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const StyledClientName = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

export const StyledActionsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const StyledEventRequestButton = styled(Button)(({ theme }) => ({
  height: 36,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  gap: theme.spacing(1),
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '& .MuiButton-startIcon': {
    margin: 0,
  },
}));

export const StyledLogoutButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.error.main,
    backgroundColor: 'rgba(107, 27, 0, 0.08)',
  },
}));
