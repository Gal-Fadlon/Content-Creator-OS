import { createTheme, ThemeOptions } from '@mui/material/styles';
import { lightPalette, extendedPaletteOptions } from './palette';
import { typography } from './typography';
import { components } from './components';

// Re-export RTL cache for ThemeProvider
export { cacheRtl } from './rtlCache';

/**
 * Base theme options shared between themes
 */
const baseThemeOptions: Partial<ThemeOptions> = {
  direction: 'rtl',
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
};

/**
 * Light theme - default theme for the application
 * Boutique moodboard design with luxury paper card aesthetics
 */
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...lightPalette,
    ...extendedPaletteOptions,
  },
});
