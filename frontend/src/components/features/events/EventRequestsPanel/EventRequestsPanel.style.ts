import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, IconButton, Typography, Chip, Drawer } from '@mui/material';

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 380,
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
  },
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const StyledBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.dark,
  fontWeight: 600,
  height: 24,
}));

export const StyledEmptyMessage = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(4),
}));

export const StyledRequestCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

export const StyledRequestHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

export const StyledRequestTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '1rem',
  color: theme.palette.text.primary,
}));

export const StyledRequestDate = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

export const StyledRequestDescription = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const StyledClientName = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.disabled,
  marginBottom: theme.spacing(1),
}));

export const StyledActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const StyledApproveButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  borderRadius: 8,
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
  },
}));

export const StyledRejectButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
  borderRadius: 8,
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
}));

export const StyledTriggerButton = styled(IconButton)(({ theme }) => ({
  position: 'relative',
}));
