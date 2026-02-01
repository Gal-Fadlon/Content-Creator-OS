import { styled } from '@mui/material/styles';
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  ButtonBase,
} from '@mui/material';

export { StyledTriggerContainer, StyledTriggerButton } from '@/components/shared/TriggerButton.style';

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 320,
    padding: theme.spacing(3),
  },
}));

export const StyledDrawerTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '1.125rem',
  marginBottom: theme.spacing(3),
  textAlign: 'right',
}));

export const StyledClientList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

interface StyledClientItemProps {
  isSelected?: boolean;
}

export const StyledClientItem = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<StyledClientItemProps>(({ theme, isSelected }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: theme.transitions.create(['background-color', 'border-color']),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledClientAvatar = styled(Avatar)({
  width: 40,
  height: 40,
});

export const StyledClientInfo = styled(Box)({
  flex: 1,
  textAlign: 'right',
});

export const StyledClientName = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

export const StyledClientMeta = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

export const StyledPendingText = styled('span')(({ theme }) => ({
  color: theme.palette.warning.main,
}));
