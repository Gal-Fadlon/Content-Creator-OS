import { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { lightTheme, cacheRtl } from './index';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider that wraps the application with MUI theme and RTL support
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <CacheProvider value={cacheRtl}>
      <MuiThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
