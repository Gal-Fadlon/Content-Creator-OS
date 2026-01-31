import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';

interface StyledCommentContainerProps {
  isOwnComment?: boolean;
}

export const StyledCommentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOwnComment',
})<StyledCommentContainerProps>(({ theme, isOwnComment }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5),
  borderRadius: 12,
  background: isOwnComment 
    ? theme.palette.primary.light + '15'
    : theme.palette.grey[50],
  border: `1px solid ${isOwnComment ? theme.palette.primary.light : theme.palette.grey[200]}`,
  position: 'relative',
}));

export const StyledCommentHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const StyledUserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const StyledUserName = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

interface StyledRoleBadgeProps {
  role: 'admin' | 'client';
}

export const StyledRoleBadge = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'role',
})<StyledRoleBadgeProps>(({ theme, role }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.7rem',
  fontWeight: 500,
  padding: '2px 6px',
  borderRadius: 4,
  background: role === 'admin' 
    ? theme.palette.primary.main 
    : theme.palette.secondary.main,
  color: role === 'admin' 
    ? theme.palette.common.white 
    : theme.palette.text.primary,
}));

export const StyledTimestamp = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

export const StyledMessage = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  color: theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

export const StyledDeleteButton = styled(IconButton)(({ theme }) => ({
  padding: 4,
  color: theme.palette.text.secondary,
  opacity: 0.6,
  transition: 'opacity 0.2s',
  '&:hover': {
    opacity: 1,
    color: theme.palette.error.main,
  },
}));
