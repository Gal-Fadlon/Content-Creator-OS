import { styled } from '@mui/material/styles';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';

export const StyledMediaContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.action.hover,
  aspectRatio: '16 / 9',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
}));

export const StyledMediaImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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

export const StyledEditButton = styled(StyledMediaActionButton)(({ theme }) => ({
  right: theme.spacing(1),
}));

interface StyledUploadAreaProps {
  hasPreview?: boolean;
}

export const StyledUploadArea = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'hasPreview',
})<StyledUploadAreaProps>(({ theme, hasPreview }) => ({
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
}));

export const StyledUploadIcon = styled(Box)(({ theme }) => ({
  color: 'rgba(200, 173, 127, 0.6)',
}));

export const StyledUploadText = styled(Typography)(({ theme }) => ({
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
