import { styled } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';

interface StyledGridItemContainerProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  isDragged?: boolean;
  isDragOver?: boolean;
}

export const StyledGridItemContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    !['isAdmin', 'isEditing', 'isDragged', 'isDragOver'].includes(prop as string),
})<StyledGridItemContainerProps>(({ theme, isAdmin, isEditing, isDragged, isDragOver }) => ({
  aspectRatio: '4 / 5',
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius / 2,
  overflow: 'hidden',
  position: 'relative',
  transition: theme.transitions.create(['opacity', 'transform', 'box-shadow']),

  '&:hover .grid-item-overlay': {
    opacity: 1,
  },

  ...(isAdmin && !isEditing && {
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  }),

  ...(isEditing && {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    zIndex: 10,
  }),

  ...(isDragged && {
    opacity: 0.5,
    transform: 'scale(0.95)',
  }),

  ...(isDragOver && {
    boxShadow: `0 0 0 2px ${theme.palette.secondary.main}, 0 0 0 4px ${theme.palette.background.paper}`,
  }),
}));

export const StyledMediaWrapper = styled(Box)({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
});

export const StyledCoverBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  height: 'auto',
  fontSize: '0.5625rem',
  fontFamily: '"Heebo", sans-serif',
  backgroundColor: 'rgba(200, 173, 127, 0.8)',
  color: theme.palette.text.primary,
  '& .MuiChip-label': {
    padding: theme.spacing(0.25, 0.75),
  },
}));

export const StyledUploadingOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 5,
}));
