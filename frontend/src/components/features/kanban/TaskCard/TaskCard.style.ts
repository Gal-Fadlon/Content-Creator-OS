import { styled } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';
import type { AdminTaskPriority } from '@/types/adminTask';

interface StyledTaskCardRootProps {
  colorLabel?: string;
  isDragging?: boolean;
}

export const StyledTaskCardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorLabel' && prop !== 'isDragging',
})<StyledTaskCardRootProps>(({ theme, colorLabel, isDragging }) => ({
  backgroundColor: isDragging ? '#fff' : 'rgba(255, 255, 255, 0.9)',
  borderRadius: 12,
  padding: theme.spacing(1.5),
  cursor: 'grab',
  border: `1px solid ${isDragging ? theme.palette.primary.main : theme.palette.divider}`,
  boxShadow: isDragging
    ? '0 8px 24px rgba(130, 61, 34, 0.18)'
    : '0 1px 3px rgba(0,0,0,0.04)',
  borderTop: colorLabel ? `4px solid ${colorLabel}` : undefined,
  transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(130, 61, 34, 0.1)',
  },
}));

export const StyledTaskTitle = styled('div')(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  marginBottom: theme.spacing(0.75),
}));

export const StyledTaskDescription = styled('div')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  opacity: 0.7,
  marginBottom: theme.spacing(0.75),
}));

export const StyledTaskMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  flexWrap: 'wrap',
}));

const PRIORITY_COLORS: Record<AdminTaskPriority, { bg: string; text: string }> = {
  low: { bg: '#e8f5e9', text: '#2e7d32' },
  medium: { bg: '#fff8e1', text: '#f57f17' },
  high: { bg: '#efebe9', text: '#5d4037' },
  urgent: { bg: '#fce4ec', text: '#880e4f' },
};

interface StyledPriorityChipProps {
  priority: AdminTaskPriority;
}

export const StyledPriorityChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'priority',
})<StyledPriorityChipProps>(({ priority }) => ({
  height: 22,
  fontSize: '0.7rem',
  fontWeight: 600,
  backgroundColor: PRIORITY_COLORS[priority].bg,
  color: PRIORITY_COLORS[priority].text,
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

interface StyledDueDateProps {
  overdue?: boolean;
}

export const StyledDueDate = styled('span', {
  shouldForwardProp: (prop) => prop !== 'overdue',
})<StyledDueDateProps>(({ theme, overdue }) => ({
  fontSize: '0.7rem',
  color: overdue ? '#d32f2f' : theme.palette.text.secondary,
  fontWeight: overdue ? 600 : 400,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.375),
}));
