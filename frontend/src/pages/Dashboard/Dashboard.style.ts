import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

interface StyledBackdropOverlayProps {
  hasImage?: boolean;
}

export const StyledBackdropOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasImage',
})<StyledBackdropOverlayProps>(({ theme, hasImage }) => ({
  position: 'fixed',
  inset: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: -1,
  pointerEvents: 'none',
  backgroundColor: hasImage ? undefined : theme.palette.background.default,
}));

export const StyledPageContainer = styled(Box)({
  direction: 'rtl',
  minHeight: '100%',
  position: 'relative',
});

export const StyledThemeSection = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'rgba(247, 245, 240, 0.5)',
  backdropFilter: 'blur(4px)',
}));

export const StyledThemeContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export const StyledFilterSection = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledFilterContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export const StyledMainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
