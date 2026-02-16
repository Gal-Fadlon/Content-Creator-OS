import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface StyledColumnRootProps {
  columnColor?: string;
}

export const StyledColumnRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'columnColor',
})<StyledColumnRootProps>(({ theme, columnColor }) => ({
  flex: '1 1 0',
  minWidth: 280,
  maxWidth: 380,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(247, 245, 240, 0.5)',
  borderRadius: 16,
  borderTop: `3px solid ${columnColor || theme.palette.divider}`,
  overflow: 'hidden',
}));

export const StyledColumnHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 1, 2),
}));

export const StyledColumnTitle = styled('div')(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledTaskCount = styled('span')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(0,0,0,0.06)',
  borderRadius: 10,
  padding: '2px 8px',
}));

interface StyledDropZoneProps {
  isDraggingOver?: boolean;
}

export const StyledDropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDraggingOver',
})<StyledDropZoneProps>(({ theme, isDraggingOver }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  minHeight: 100,
  borderRadius: 8,
  transition: 'background-color 0.15s ease',
  backgroundColor: isDraggingOver ? 'rgba(130, 61, 34, 0.06)' : 'transparent',
}));

export const StyledEmptyState = styled('div')(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.disabled,
  fontSize: '0.8rem',
  padding: theme.spacing(3, 1),
}));

export const StyledAddButton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5, 1.5, 1.5),
}));

export const StyledAddTaskButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.75),
  width: '100%',
  padding: theme.spacing(0.75, 1),
  border: 'none',
  borderRadius: 8,
  backgroundColor: 'transparent',
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: 'rgba(130, 61, 34, 0.06)',
  },
}));
