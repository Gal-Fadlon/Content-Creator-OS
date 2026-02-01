import { styled } from '@mui/material/styles';
import { ButtonBase } from '@mui/material';

export const StyledAddButton = styled(ButtonBase)(({ theme }) => ({
  aspectRatio: '4 / 5',
  backgroundColor: theme.palette.action.hover,
  borderRadius: Number(theme.shape.borderRadius) / 2,
  border: `2px dashed ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  transition: theme.transitions.create(['border-color', 'background-color', 'color']),
  fontFamily: '"Heebo", sans-serif',

  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(200, 173, 127, 0.05)',
    color: theme.palette.text.primary,
  },

  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  },

  '& .MuiTypography-root': {
    fontFamily: '"Heebo", sans-serif',
  },
}));
