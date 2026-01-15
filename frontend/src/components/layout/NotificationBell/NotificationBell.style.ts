import { styled } from '@mui/material/styles';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  ButtonBase,
} from '@mui/material';

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'relative',
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    fontSize: '0.625rem',
    minWidth: 18,
    height: 18,
  },
}));

export const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    width: 320,
    maxHeight: 400,
    borderRadius: theme.shape.borderRadius,
  },
}));

export const StyledPopoverHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledPopoverTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '0.875rem',
}));

export const StyledNotificationList = styled(Box)(({ theme }) => ({
  maxHeight: 320,
  overflowY: 'auto',
}));

export const StyledEmptyMessage = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
}));

interface StyledNotificationItemProps {
  isUnread?: boolean;
}

export const StyledNotificationItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isUnread',
})<StyledNotificationItemProps>(({ theme, isUnread }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  textAlign: 'start',
  display: 'block',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: isUnread ? 'rgba(212, 168, 85, 0.1)' : 'transparent',
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const StyledNotificationContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

export const StyledUnreadDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.warning.main,
  marginTop: theme.spacing(0.75),
  flexShrink: 0,
}));

export const StyledNotificationTextWrapper = styled(Box)({
  flex: 1,
});

export const StyledNotificationTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

export const StyledNotificationMessage = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.25),
}));
