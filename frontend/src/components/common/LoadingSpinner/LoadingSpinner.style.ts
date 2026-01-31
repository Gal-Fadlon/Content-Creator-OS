import { styled, Box } from '@mui/material';

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.primary.main,
}));
