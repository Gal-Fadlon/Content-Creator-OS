import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';

interface StyledContentTypeBadgeProps {
  contentType?: 'reel' | 'story' | 'post';
}

export const StyledContentTypeBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'contentType',
})<StyledContentTypeBadgeProps>(({ theme, contentType }) => ({
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
}));
