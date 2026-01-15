/**
 * App Providers
 * Unified provider composition for the entire app
 *
 * Provider order (dependencies flow top to bottom):
 * 1. ThemeProvider - MUI theme
 * 2. QueryClientProvider - React Query
 * 3. SnackbarProvider - Toast notifications
 * 4. AuthProvider - User session & role
 * 5. SelectedClientProvider - Selected client state
 * 6. CalendarNavProvider - Month navigation
 * 7. ViewModeProvider - Calendar vs Grid toggle
 * 8. FilterProvider - Content filters
 * 9. ModalProvider - Modal open/close state
 * 10. MonthlyStateProvider - Backdrops, stickers, themes (depends on CalendarNav)
 *
 * Note: Server state (content, events, clients, notifications) is handled
 * by React Query hooks, not contexts!
 */

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { AuthProvider } from './AuthProvider';
import { SelectedClientProvider } from './SelectedClientProvider';
import { ViewModeProvider } from './ViewModeProvider';
import { CalendarNavProvider } from './CalendarNavProvider';
import { FilterProvider } from './FilterProvider';
import { ModalProvider } from './ModalProvider';
import { MonthlyStateProvider } from './MonthlyStateProvider';

// Create query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <AuthProvider>
            <SelectedClientProvider>
              <CalendarNavProvider>
                <ViewModeProvider>
                  <FilterProvider>
                    <ModalProvider>
                      <MonthlyStateProvider>
                        {children}
                      </MonthlyStateProvider>
                    </ModalProvider>
                  </FilterProvider>
                </ViewModeProvider>
              </CalendarNavProvider>
            </SelectedClientProvider>
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default AppProviders;
