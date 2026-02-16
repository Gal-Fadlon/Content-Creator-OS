import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledFiltersRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
}));

export const StyledSearchInput = styled('input')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: theme.spacing(1, 2),
  fontSize: '0.85rem',
  backgroundColor: 'rgba(255,255,255,0.8)',
  outline: 'none',
  width: 220,
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
  '&:focus': {
    borderColor: theme.palette.primary.main,
  },
  '&::placeholder': {
    color: theme.palette.text.disabled,
  },
}));

interface StyledFilterPillProps {
  active?: boolean;
}

export const StyledFilterPill = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledFilterPillProps>(({ theme, active }) => ({
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: 20,
  padding: theme.spacing(0.5, 1.5),
  fontSize: '0.78rem',
  fontWeight: active ? 600 : 400,
  backgroundColor: active ? 'rgba(130, 61, 34, 0.1)' : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: active ? 'rgba(130, 61, 34, 0.14)' : 'rgba(130, 61, 34, 0.05)',
  },
}));
