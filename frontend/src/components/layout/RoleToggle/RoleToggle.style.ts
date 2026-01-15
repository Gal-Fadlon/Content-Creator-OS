import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

export const StyledRoleToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

interface StyledRoleIconButtonProps {
  isActive?: boolean;
}

export const StyledRoleIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<StyledRoleIconButtonProps>(({ theme, isActive }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  color: isActive ? theme.palette.common.white : theme.palette.text.secondary,
  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
  border: isActive ? 'none' : `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['background-color', 'color', 'border-color'], {
    duration: 200,
  }),
  '&:hover': {
    backgroundColor: isActive 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
    color: isActive ? theme.palette.common.white : theme.palette.text.primary,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
}));
