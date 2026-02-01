import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export { StyledFieldContainer, StyledLabel, StyledTextField } from '@/components/shared/FormField.style';

export const StyledReadOnlyBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(200, 173, 127, 0.1)',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid rgba(200, 173, 127, 0.2)`,
  direction: 'rtl',
  textAlign: 'right',
}));

export const StyledReadOnlyText = styled(Typography)({
  fontFamily: '"Heebo", sans-serif',
  fontSize: '0.875rem',
  textAlign: 'right',
  direction: 'rtl',
});
