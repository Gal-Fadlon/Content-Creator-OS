// @ts-ignore
import { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Typography configuration for RTL Hebrew support
 * Uses system fonts optimized for Hebrew text
 */

// Font family definitions (internal use only)
const fontFamilies = {
  // Primary Hebrew-friendly sans-serif
  body: '"Assistant", "Heebo", "Rubik", -apple-system, BlinkMacSystemFont, sans-serif',
  // Display font for headings
  display: '"Playfair Display", "Assistant", Georgia, serif',
  // Brand font for logo/branding
  brand: '"Playfair Display", Georgia, serif',
  // Monospace for code/technical content
  mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
} as const;

export const typography: TypographyOptions = {
  fontFamily: fontFamilies.body,
  
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: '3rem',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0.02em',
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '0.02em',
  },
  h3: {
    fontFamily: fontFamilies.display,
    fontSize: '1.875rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontFamily: fontFamilies.display,
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  h5: {
    fontFamily: fontFamilies.body,
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: fontFamilies.body,
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'none', // Keep original case for Hebrew
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};
