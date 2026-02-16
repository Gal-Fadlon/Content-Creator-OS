import { Components, Theme } from '@mui/material/styles';
import { colors } from './palette';

/**
 * MUI component overrides to match the boutique design system
 * Paper card aesthetics with soft shadows
 */

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        direction: 'rtl',
      },
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(130, 61, 34, 0.3)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '8px 20px',
        fontWeight: 500,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(130, 61, 34, 0.15)',
        },
        '&.MuiButton-containedPrimary': {
          background: `linear-gradient(135deg, ${colors.earthBrown} 0%, #a35a3a 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, #5c2a17 0%, ${colors.earthBrown} 100%)`,
          },
          '&.Mui-disabled': {
            background: 'rgba(61, 46, 36, 0.12)',
            color: 'rgba(61, 46, 36, 0.26)',
          },
        },
        '&.MuiButton-containedSecondary': {
          background: `linear-gradient(135deg, ${colors.sandGold} 0%, #dcc9a3 100%)`,
          color: colors.charcoal,
          '&:hover': {
            background: `linear-gradient(135deg, #a8915f 0%, ${colors.sandGold} 100%)`,
          },
        },
      },
      outlined: {
        borderWidth: '1.5px',
        '&:hover': {
          borderWidth: '1.5px',
        },
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 4px 24px -8px rgba(130, 61, 34, 0.12)',
        border: '1px solid rgba(61, 46, 36, 0.08)',
        background: `linear-gradient(180deg, ${colors.cream} 0%, #f5f2eb 100%)`,
      },
    },
  },
  
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: '12px',
      },
      elevation1: {
        boxShadow: '0 4px 24px -8px rgba(130, 61, 34, 0.12)',
      },
      elevation2: {
        boxShadow: '0 8px 32px -4px rgba(130, 61, 34, 0.15)',
      },
      elevation3: {
        boxShadow: '0 12px 48px -12px rgba(130, 61, 34, 0.2), 0 4px 16px -4px rgba(130, 61, 34, 0.1)',
      },
    },
  },
  
  MuiTextField: {
    styleOverrides: {
      root: {
        direction: 'rtl',
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          '& fieldset': {
            borderColor: 'rgba(61, 46, 36, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: colors.sandGold,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.earthBrown,
            borderWidth: '2px',
          },
        },
        '& .MuiInputBase-input': {
          textAlign: 'right',
        },
        '& .MuiInputBase-inputMultiline': {
          textAlign: 'right',
        },
      },
    },
    defaultProps: {
      slotProps: {
        input: {
          dir: 'rtl',
        },
      },
    },
  },
  
  MuiInputBase: {
    styleOverrides: {
      root: {
        direction: 'rtl',
        textAlign: 'right',
      },
      input: {
        textAlign: 'right',
        '&::placeholder': {
          textAlign: 'right',
        },
      },
    },
  },
  
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        direction: 'rtl',
      },
      input: {
        textAlign: 'right',
      },
    },
  },
  
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '20px',
        boxShadow: '0 24px 80px -20px rgba(26, 26, 46, 0.25)',
        direction: 'rtl',
      },
    },
  },
  
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: '20px 24px',
        fontWeight: 600,
      },
    },
  },
  
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '20px 24px',
      },
    },
  },
  
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
        gap: '12px',
      },
    },
  },
  
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorPrimary': {
          background: `linear-gradient(135deg, ${colors.earthBrown} 0%, #a35a3a 100%)`,
        },
        '&.MuiChip-colorSecondary': {
          background: `linear-gradient(135deg, ${colors.sandGold} 0%, #dcc9a3 100%)`,
          color: colors.charcoal,
        },
      },
    },
  },
  
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: colors.midnight,
        borderRadius: '8px',
        fontSize: '0.8125rem',
        padding: '8px 12px',
      },
      arrow: {
        color: colors.midnight,
      },
    },
  },
  
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
        '&:hover': {
          backgroundColor: 'rgba(200, 173, 127, 0.15)',
        },
      },
    },
  },
  
  MuiSelect: {
    styleOverrides: {
      root: {
        direction: 'rtl',
        borderRadius: '10px',
      },
      select: {
        textAlign: 'right',
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'flex-start', // In RTL, flex-start is the right side
      },
      icon: {
        right: 'auto',
        left: 7,
      },
    },
    defaultProps: {
      MenuProps: {
        slotProps: {
          paper: {
            sx: {
              direction: 'rtl',
            },
          },
        },
      },
    },
  },
  
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: '12px',
        boxShadow: '0 8px 32px -4px rgba(130, 61, 34, 0.15)',
        border: '1px solid rgba(61, 46, 36, 0.08)',
      },
    },
  },
  
  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        margin: '2px 6px',
        direction: 'rtl',
        textAlign: 'right',
        justifyContent: 'flex-start', // In RTL, flex-start is the right side
        '&:hover': {
          backgroundColor: 'rgba(200, 173, 127, 0.15)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(200, 173, 127, 0.25)',
          '&:hover': {
            backgroundColor: 'rgba(200, 173, 127, 0.35)',
          },
        },
      },
    },
  },
  
  MuiInputLabel: {
    styleOverrides: {
      root: {
        right: 14,
        left: 'unset',
        transformOrigin: 'right',
        textAlign: 'right',
      },
    },
  },
  
  MuiFormLabel: {
    styleOverrides: {
      root: {
        textAlign: 'right',
      },
    },
  },
  
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: '3px',
        borderRadius: '3px 3px 0 0',
      },
    },
  },
  
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        minHeight: '48px',
      },
    },
  },
  
  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 600,
      },
    },
  },
  
  MuiAvatar: {
    styleOverrides: {
      root: {
        border: `2px solid ${colors.cream}`,
        boxShadow: '0 2px 8px rgba(130, 61, 34, 0.15)',
      },
    },
  },
  
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 46,
        height: 26,
        padding: 0,
      },
      switchBase: {
        padding: 2,
        '&.Mui-checked': {
          transform: 'translateX(20px)',
          '& + .MuiSwitch-track': {
            backgroundColor: colors.earthBrown,
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 22,
        height: 22,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
      },
      track: {
        borderRadius: 13,
        backgroundColor: colors.lightGray,
        opacity: 1,
      },
    },
  },
};
