import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export { StyledFieldContainer, StyledLabel, StyledTextField } from '@/components/shared/FormField.style';

export const StyledReadOnlyBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  direction: 'rtl',
  textAlign: 'right',
}));

export const StyledReadOnlyText = styled(Typography)({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  whiteSpace: 'pre-wrap',
  textAlign: 'right',
  direction: 'rtl',
});
