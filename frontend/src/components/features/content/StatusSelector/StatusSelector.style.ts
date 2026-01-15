import { styled } from '@mui/material/styles';
import { Box, FormControl, Typography, Select, MenuItem } from '@mui/material';

export const StyledFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const StyledLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  textAlign: 'right',
  width: '100%',
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  direction: 'rtl',
  '& .MuiSelect-select': {
    fontFamily: '"Heebo", sans-serif',
    textAlign: 'right',
    paddingRight: theme.spacing(1.75),
    paddingLeft: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-start', // In RTL, flex-start is the right side
  },
  '& .MuiSelect-icon': {
    right: 'auto',
    left: 7,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontFamily: '"Heebo", sans-serif',
  direction: 'rtl',
  textAlign: 'right',
  justifyContent: 'flex-start',
  width: '100%',
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
}));
