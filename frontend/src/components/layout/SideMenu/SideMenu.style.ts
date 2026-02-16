import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface StyledSideMenuRootProps {
  collapsed?: boolean;
}

export const SIDE_MENU_EXPANDED_WIDTH = 240;
export const SIDE_MENU_COLLAPSED_WIDTH = 64;

export const StyledSideMenuRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<StyledSideMenuRootProps>(({ theme, collapsed }) => ({
  width: collapsed ? SIDE_MENU_COLLAPSED_WIDTH : SIDE_MENU_EXPANDED_WIDTH,
  minWidth: collapsed ? SIDE_MENU_COLLAPSED_WIDTH : SIDE_MENU_EXPANDED_WIDTH,
  height: '100vh',
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(247, 245, 240, 0.95)',
  backdropFilter: 'blur(12px)',
  borderInlineEnd: `1px solid ${theme.palette.divider}`,
  transition: 'width 0.25s ease, min-width 0.25s ease',
  overflow: 'hidden',
  zIndex: 10,
}));

export const StyledMenuList = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(2, 1),
}));

interface StyledMenuItemProps {
  active?: boolean;
  collapsed?: boolean;
}

export const StyledMenuItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'collapsed',
})<StyledMenuItemProps>(({ theme, active, collapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  borderRadius: 12,
  padding: theme.spacing(1.25, 1.5),
  gap: theme.spacing(1.5),
  justifyContent: collapsed ? 'center' : 'flex-start',
  backgroundColor: active ? 'rgba(130, 61, 34, 0.14)' : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  fontWeight: active ? 600 : 400,
  '&:hover': {
    backgroundColor: active ? 'rgba(130, 61, 34, 0.14)' : 'rgba(130, 61, 34, 0.08)',
  },
  transition: 'background-color 0.15s ease, color 0.15s ease',
}));

export const StyledMenuLabel = styled('span')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '0.9rem',
});

export const StyledCollapseButton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'center',
}));
