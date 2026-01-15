import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';

export const StyledCalendarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontFamily: '"Heebo", sans-serif',

  '& .rdp': {
    margin: 0,
  },

  '& .rdp-months': {
    display: 'flex',
    flexDirection: 'column',
  },

  '& .rdp-month': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },

  '& .rdp-caption': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: theme.spacing(0.5, 0),
  },

  '& .rdp-caption_label': {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontFamily: '"Heebo", sans-serif',
  },

  '& .rdp-nav': {
    display: 'flex',
    gap: theme.spacing(0.5),
  },

  '& .rdp-nav_button': {
    width: 28,
    height: 28,
    padding: 0,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.create(['background-color', 'opacity']),
    opacity: 0.5,
    '&:hover': {
      opacity: 1,
      backgroundColor: theme.palette.action.hover,
    },
    '&:disabled': {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
  },

  '& .rdp-nav_button_previous': {
    position: 'absolute',
    left: 0,
  },

  '& .rdp-nav_button_next': {
    position: 'absolute',
    right: 0,
  },

  '& .rdp-table': {
    width: '100%',
    borderCollapse: 'collapse',
  },

  '& .rdp-head_row': {
    display: 'flex',
  },

  '& .rdp-head_cell': {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },

  '& .rdp-tbody': {
    display: 'flex',
    flexDirection: 'column',
  },

  '& .rdp-row': {
    display: 'flex',
    marginTop: theme.spacing(0.5),
  },

  '& .rdp-cell': {
    width: 36,
    height: 36,
    textAlign: 'center',
    padding: 0,
  },

  '& .rdp-day': {
    width: 36,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 400,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    transition: theme.transitions.create(['background-color', 'color']),
    fontFamily: '"Heebo", sans-serif',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
  },

  '& .rdp-day_today': {
    backgroundColor: theme.palette.action.selected,
    fontWeight: 600,
  },

  '& .rdp-day_selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },

  '& .rdp-day_outside': {
    color: theme.palette.text.disabled,
    opacity: 0.5,
  },

  '& .rdp-day_disabled': {
    color: theme.palette.text.disabled,
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

export const StyledNavButton = styled(IconButton)(({ theme }) => ({
  width: 28,
  height: 28,
  padding: 0,
}));
