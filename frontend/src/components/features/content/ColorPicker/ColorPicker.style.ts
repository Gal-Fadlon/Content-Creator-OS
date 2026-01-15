import { styled } from '@mui/material/styles';
import { Box, Typography, ButtonBase } from '@mui/material';

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
}));

export const StyledColorsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'flex-end',
}));

interface StyledColorButtonProps {
  colorValue: 'red' | 'blue' | 'beige' | 'brown' | 'black';
  isSelected?: boolean;
}

const colorMap = {
  red: '#6b1b00',
  blue: '#002366',
  beige: '#d4c4a8',
  brown: '#823d22',
  black: '#262626',
};

export const StyledColorButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['colorValue', 'isSelected'].includes(prop as string),
})<StyledColorButtonProps>(({ theme, colorValue, isSelected }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: colorMap[colorValue],
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: theme.transitions.create(['box-shadow', 'transform']),
  
  '&:hover': {
    transform: 'scale(1.1)',
  },
  
  ...(isSelected && {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.secondary.main}`,
  }),
}));
