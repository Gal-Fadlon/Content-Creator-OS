import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface StyledStickerProps {
  isAdmin?: boolean;
  isDragging?: boolean;
  stickerColor?: string;
}

// Sticker color palette - replaces Tailwind color classes
const STICKER_COLORS: Record<string, string> = {
  'text-amber-500': '#f59e0b',
  'text-rose-500': '#f43f5e',
  'text-emerald-500': '#10b981',
  'text-sky-500': '#0ea5e9',
  'text-violet-500': '#8b5cf6',
  'text-pink-500': '#ec4899',
  'text-orange-500': '#f97316',
  'text-teal-500': '#14b8a6',
  'text-indigo-500': '#6366f1',
  'text-lime-500': '#84cc16',
};

export const StyledSticker = styled(Box, {
  shouldForwardProp: (prop) => !['isAdmin', 'isDragging', 'stickerColor'].includes(prop as string),
})<StyledStickerProps>(({ theme, isAdmin, isDragging, stickerColor }) => ({
  position: 'absolute',
  pointerEvents: 'auto',
  cursor: isAdmin ? 'grab' : 'default',
  
  // Sticker effect - drop shadow
  filter: 'drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.15))',
  transition: theme.transitions.create(['transform', 'filter']),
  
  // Hover effect
  '&:hover': {
    transform: 'scale(1.05) rotate(-2deg)',
    filter: 'drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.2))',
  },

  '&:active': {
    cursor: 'grabbing',
  },

  // Apply sticker color
  ...(stickerColor && STICKER_COLORS[stickerColor] && {
    color: STICKER_COLORS[stickerColor],
  }),

  // Dragging state
  ...(isDragging && {
    transform: 'scale(1.1)',
    zIndex: 50,
  }),
}));

export const StyledStickerImage = styled('img')({
  width: 40,
  height: 40,
  objectFit: 'contain',
});

export const StyledStickerIcon = styled(Box)({
  width: 40,
  height: 40,
});
