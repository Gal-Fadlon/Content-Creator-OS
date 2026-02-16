import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledTaskManagerRoot = styled(Box)({
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(247, 245, 240, 0.3)',
});

export const StyledTaskManagerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'rgba(247, 245, 240, 0.5)',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    alignItems: 'stretch',
  },
}));

export const StyledHeaderTitle = styled('h1')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  margin: 0,
  fontFamily: '"Playfair Display", serif',
}));

export const StyledFilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
  },
}));

export const StyledAddTaskButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: theme.spacing(1, 2.5),
  border: 'none',
  borderRadius: 12,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: '0.875rem',
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const StyledBoardSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3, 4),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));
