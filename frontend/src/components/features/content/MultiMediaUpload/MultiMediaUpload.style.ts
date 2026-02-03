import { styled } from '@mui/material/styles';
import { Box, ButtonBase, IconButton, Dialog } from '@mui/material';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const StyledMediaGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

interface StyledMediaItemProps {
  isDragging?: boolean;
  isDragOver?: boolean;
}

export const StyledMediaItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'isDragOver',
})<StyledMediaItemProps>(({ theme, isDragging, isDragOver }) => ({
  position: 'relative',
  width: 80,
  height: 80,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `2px solid ${isDragOver ? theme.palette.secondary.main : theme.palette.divider}`,
  opacity: isDragging ? 0.5 : 1,
  cursor: 'grab',
  transition: theme.transitions.create(['border-color', 'opacity', 'transform']),
  transform: isDragOver ? 'scale(1.05)' : 'scale(1)',
  '&:hover .expand-button': {
    opacity: 1,
  },
  '&:active': {
    cursor: 'grabbing',
  },
}));

export const StyledExpandButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 2,
  left: 2,
  width: 20,
  height: 20,
  padding: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: theme.palette.common.white,
  opacity: 0,
  transition: theme.transitions.create('opacity'),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));

export const StyledLightbox = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    maxWidth: '500px',
    maxHeight: '70vh',
    margin: 0,
    overflow: 'visible',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
});

export const StyledLightboxContent = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledLightboxImage = styled('img')({
  maxWidth: '500px',
  maxHeight: '70vh',
  objectFit: 'contain',
  borderRadius: 8,
});

export const StyledLightboxClose = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: -40,
  right: 0,
  color: theme.palette.common.white,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

export const StyledMediaThumb = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const StyledRemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 2,
  right: 2,
  width: 20,
  height: 20,
  padding: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));

export const StyledAddButton = styled(ButtonBase)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  transition: theme.transitions.create(['border-color', 'background-color']),
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.05)',
  },
}));

interface StyledDropZoneProps {
  isDragging?: boolean;
  hasMedia?: boolean;
}

export const StyledDropZone = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'hasMedia',
})<StyledDropZoneProps>(({ theme, isDragging, hasMedia }) => ({
  width: '100%',
  minHeight: hasMedia ? 'auto' : 120,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${isDragging ? theme.palette.secondary.main : 'rgba(200, 173, 127, 0.4)'}`,
  backgroundColor: isDragging ? 'rgba(200, 173, 127, 0.1)' : 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'background-color']),
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.05)',
  },
}));

export const StyledUploadIcon = styled(Box)({
  color: 'rgba(200, 173, 127, 0.6)',
});

export const StyledUploadText = styled(Box)({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(200, 173, 127, 0.8)',
});

export const StyledLoadingOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
