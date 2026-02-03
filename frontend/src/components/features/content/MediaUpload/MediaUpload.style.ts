import { styled } from '@mui/material/styles';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';

export const StyledMediaContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
});

interface StyledClickableImageProps {
  clickable?: boolean;
}

export const StyledClickableImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'clickable',
})<StyledClickableImageProps>(({ clickable }) => ({
  position: 'relative',
  cursor: clickable ? 'pointer' : 'default',
  borderRadius: 8,
  overflow: 'hidden',
  transition: 'transform 0.2s ease, opacity 0.2s ease',
  ...(clickable && {
    '&:hover': {
      transform: 'scale(1.02)',
      '& img': {
        opacity: 0.85,
      },
    },
  }),
}));

export const StyledMediaImage = styled('img')({
  maxWidth: '100%',
  maxHeight: 200,
  borderRadius: 8,
  objectFit: 'contain',
  display: 'block',
  transition: 'opacity 0.2s ease',
});

export const StyledMediaActionButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
}));

export const StyledDownloadButton = styled(StyledMediaActionButton)(({ theme }) => ({
  left: theme.spacing(1),
}));

interface StyledUploadAreaProps {
  hasPreview?: boolean;
  isDragging?: boolean;
}

export const StyledUploadArea = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'hasPreview' && prop !== 'isDragging',
})<StyledUploadAreaProps>(({ theme, hasPreview, isDragging }) => ({
  width: '100%',
  border: `2px dashed rgba(200, 173, 127, 0.4)`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'background-color']),
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',

  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.05)',
  },

  ...(hasPreview && {
    borderStyle: 'solid',
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.05)',
  }),

  ...(isDragging && {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.1)',
    borderStyle: 'solid',
  }),
}));

export const StyledUploadIcon = styled(Box)(() => ({
  color: 'rgba(200, 173, 127, 0.6)',
}));

export const StyledUploadText = styled(Typography)(() => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(200, 173, 127, 0.8)',
}));

export const StyledPreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledPreviewImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 128,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

export const StyledReplaceText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  color: theme.palette.secondary.main,
}));
