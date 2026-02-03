import { styled } from '@mui/material/styles';
import { Chip, Popover, Box, Typography } from '@mui/material';

interface StyledEventChipProps {
  eventColor?: 'red' | 'blue' | 'beige' | 'brown' | 'black';
  isDragging?: boolean;
}

export const StyledEventChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'eventColor' && prop !== 'isDragging',
})<StyledEventChipProps>(({ theme, eventColor, isDragging }) => ({
  height: 'auto',
  fontSize: '0.5625rem',
  fontFamily: '"Heebo", sans-serif',
  cursor: 'grab',
  transition: theme.transitions.create(['transform', 'opacity']),
  maxWidth: 140,
  opacity: isDragging ? 0.5 : 1,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '&:active': {
    cursor: 'grabbing',
  },

  '& .MuiChip-label': {
    padding: theme.spacing(0.25, 0.75),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  ...(eventColor === 'red' && {
    backgroundColor: '#6b1b00',
    color: theme.palette.common.white,
  }),

  ...(eventColor === 'blue' && {
    backgroundColor: '#002366',
    color: theme.palette.common.white,
  }),

  ...(eventColor === 'beige' && {
    backgroundColor: '#c8ad7f',
    color: theme.palette.text.primary,
  }),

  ...(eventColor === 'brown' && {
    backgroundColor: '#823d22',
    color: theme.palette.common.white,
  }),

  ...(eventColor === 'black' && {
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.default,
  }),
}));

export const StyledHoverCard = styled(Popover)(({ theme }) => ({
  pointerEvents: 'none',
  '& .MuiPopover-paper': {
    width: 220,
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

export const StyledEventTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

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
