import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const StyledPopoverContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 120,
  maxWidth: 200,
}));

export const StyledEventItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledEventTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontFamily: '"Heebo", sans-serif',
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));