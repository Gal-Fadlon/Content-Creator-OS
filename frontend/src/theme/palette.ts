import { PaletteOptions } from '@mui/material';

/**
 * Color palette extracted from the boutique moodboard design system
 * Luxury palette with physical paper card aesthetics
 */

// Raw color values for reference and direct use
export const colors = {
  // Primary colors
  earthBrown: '#823d22',
  sandGold: '#c8ad7f',
  burgundy: '#6b1b00',
  royalBlue: '#002366',
  
  // Neutrals
  cream: '#f7f5f0',
  lightGray: '#d6d6d6',
  charcoal: '#3d2e24',
  midnight: '#1a1a2e',
  
  // Status colors
  draft: '#999999',
  pending: '#d4a855',
  approved: '#002366',
  published: '#4a8c6f',
  
  // Content type colors
  reel: '#002366',
  story: '#c8ad7f',
  post: '#823d22',
  
  // Marker colors for events
  markerRed: '#6b1b00',
  markerBlue: '#002366',
  markerBeige: '#d4c4a8',
  markerBrown: '#823d22',
  markerBlack: '#262626',
} as const;

// Light theme palette
export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: colors.earthBrown,
    light: '#a35a3a',
    dark: '#5c2a17',
    contrastText: colors.cream,
  },
  secondary: {
    main: colors.sandGold,
    light: '#dcc9a3',
    dark: '#a8915f',
    contrastText: colors.charcoal,
  },
  error: {
    main: colors.burgundy,
    light: '#8f3520',
    dark: '#4a1200',
    contrastText: colors.cream,
  },
  warning: {
    main: colors.pending,
    light: '#e0be7a',
    dark: '#b8923e',
    contrastText: colors.charcoal,
  },
  info: {
    main: colors.royalBlue,
    light: '#1a4080',
    dark: '#001540',
    contrastText: colors.cream,
  },
  success: {
    main: colors.published,
    light: '#6aab8c',
    dark: '#356b50',
    contrastText: colors.cream,
  },
  background: {
    default: colors.lightGray,
    paper: colors.cream,
  },
  text: {
    primary: colors.charcoal,
    secondary: '#6b5a4e',
    disabled: '#a39990',
  },
  divider: 'rgba(61, 46, 36, 0.12)',
  action: {
    active: colors.earthBrown,
    hover: 'rgba(130, 61, 34, 0.08)',
    selected: 'rgba(130, 61, 34, 0.14)',
    disabled: 'rgba(61, 46, 36, 0.26)',
    disabledBackground: 'rgba(61, 46, 36, 0.12)',
  },
};

// Custom palette extensions for the design system
declare module '@mui/material/styles' {
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    status?: {
      draft: string;
      pending: string;
      approved: string;
      published: string;
    };
    contentType?: {
      reel: string;
      story: string;
      post: string;
    };
    marker?: {
      red: string;
      blue: string;
      beige: string;
      brown: string;
      black: string;
    };
  }
}

// Extended palette options with custom colors
export const extendedPaletteOptions = {
  neutral: {
    main: colors.lightGray,
    light: '#e6e6e6',
    dark: '#b3b3b3',
    contrastText: colors.charcoal,
  },
  status: {
    draft: colors.draft,
    pending: colors.pending,
    approved: colors.approved,
    published: colors.published,
  },
  contentType: {
    reel: colors.reel,
    story: colors.story,
    post: colors.post,
  },
  marker: {
    red: colors.markerRed,
    blue: colors.markerBlue,
    beige: colors.markerBeige,
    brown: colors.markerBrown,
    black: colors.markerBlack,
  },
};
