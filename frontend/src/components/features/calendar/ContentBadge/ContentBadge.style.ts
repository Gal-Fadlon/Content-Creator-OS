import { styled } from '@mui/material/styles';
import { Box, Typography, Popover } from '@mui/material';

interface StyledBadgeContainerProps {
  hasThumbnail?: boolean;
  contentType?: 'reel' | 'carousel' | 'post';
  isAdmin?: boolean;
  isDragging?: boolean;
}

export const StyledBadgeContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['hasThumbnail', 'contentType', 'isAdmin', 'isDragging'].includes(prop as string),
})<StyledBadgeContainerProps>(({ theme, hasThumbnail, contentType, isAdmin, isDragging }) => ({
  cursor: isAdmin ? 'grab' : 'pointer',
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('transform'),
  opacity: isDragging ? 0.5 : 1,

  '&:hover': {
    transform: 'scale(1.1)',
  },

  '&:active': {
    cursor: isAdmin ? 'grabbing' : 'pointer',
  },

  ...(hasThumbnail && {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: theme.palette.text.primary,
  }),

  ...(!hasThumbnail && {
    backgroundColor: theme.palette.action.hover,
  }),

  ...(!hasThumbnail &&
    contentType === 'reel' && {
      backgroundColor: 'rgba(0, 35, 102, 0.2)',
      color: theme.palette.info.main,
    }),

  ...(!hasThumbnail &&
    contentType === 'story' && {
      backgroundColor: 'rgba(200, 173, 127, 0.3)',
      color: theme.palette.primary.main,
    }),

  ...(!hasThumbnail &&
    contentType === 'post' && {
      backgroundColor: 'rgba(130, 61, 34, 0.2)',
      color: theme.palette.primary.main,
    }),
}));

export const StyledHoverCard = styled(Popover)(({ theme }) => ({
  pointerEvents: 'none',
  '& .MuiPopover-paper': {
    width: 256,
    padding: theme.spacing(1.5),
    textAlign: 'start',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[8],
  },
}));

export const StyledHoverContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const StyledTypeRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledTypeLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

export const StyledDescriptionSection = styled(Box)({});

export const StyledDescriptionLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.625rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.25),
}));

export const StyledDescriptionText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.primary,
  lineHeight: 1.5,
}));

export const StyledCaptionText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));
