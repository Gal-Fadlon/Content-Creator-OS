import { styled } from '@mui/material/styles';
import { Chip, MenuItem } from '@mui/material';
import type { ContentType } from '@/types/content';

interface StyledContentTypeBadgeProps {
  contentType?: ContentType;
  clickable?: boolean;
}

export const StyledContentTypeBadge = styled(Chip, {
  shouldForwardProp: (prop) => !['contentType', 'clickable'].includes(prop as string),
})<StyledContentTypeBadgeProps>(({ theme, contentType, clickable }) => ({
  position: 'absolute',
  bottom: theme.spacing(0.5),
  insetInlineStart: theme.spacing(0.5),
  height: 'auto',
  fontSize: '0.5rem',
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  maxWidth: 'calc(100% - 8px)',

  '& .MuiChip-label': {
    padding: theme.spacing(0.25, 0.5),
  },

  ...(clickable && {
    cursor: 'pointer',
    '&:hover': {
      filter: 'brightness(1.1)',
      transform: 'scale(1.05)',
    },
    transition: theme.transitions.create(['filter', 'transform'], {
      duration: theme.transitions.duration.short,
    }),
  }),

  ...(contentType === 'reel' && {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
  }),

  ...(contentType === 'story' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.primary,
  }),

  ...(contentType === 'post' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }),

  ...(contentType === 'carousel' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
  }),
}));

interface StyledMenuItemProps {
  contentType?: ContentType;
}

export const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'contentType',
})<StyledMenuItemProps>(({ theme, contentType }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  fontWeight: 500,
  minHeight: 32,
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),

  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginLeft: theme.spacing(1),

    ...(contentType === 'post' && {
      backgroundColor: theme.palette.primary.main,
    }),
    ...(contentType === 'reel' && {
      backgroundColor: theme.palette.info.main,
    }),
    ...(contentType === 'carousel' && {
      backgroundColor: theme.palette.success.main,
    }),
    ...(contentType === 'story' && {
      backgroundColor: theme.palette.secondary.main,
    }),
  },

  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
  },
}));
