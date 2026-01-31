/**
 * View Mode Provider
 * Manages the calendar vs grid view toggle
 * Persists selection to localStorage
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { CalendarView } from '@/types/content';

const STORAGE_KEY = 'content-creator-os-view-mode';

// Get initial view mode from localStorage or use default
function getInitialViewMode(defaultViewMode: CalendarView): CalendarView {
  if (typeof window === 'undefined') return defaultViewMode;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'calendar' || stored === 'grid') {
    return stored;
  }
  return defaultViewMode;
}

interface ViewModeContextValue {
  /** Current view mode */
  viewMode: CalendarView;
  /** Set the view mode */
  setViewMode: (mode: CalendarView) => void;
  /** Toggle between calendar and grid */
  toggleViewMode: () => void;
  /** Check if currently in calendar view */
  isCalendarView: boolean;
  /** Check if currently in grid view */
  isGridView: boolean;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

interface ViewModeProviderProps {
  children: ReactNode;
  /** Initial view mode */
  defaultViewMode?: CalendarView;
}

export function ViewModeProvider({
  children,
  defaultViewMode = 'calendar',
}: ViewModeProviderProps) {
  const [viewMode, setViewModeState] = useState<CalendarView>(() =>
    getInitialViewMode(defaultViewMode)
  );

  // Wrap setViewMode to also persist to localStorage
  const setViewMode = useCallback((mode: CalendarView) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewModeState((prev) => {
      const next = prev === 'calendar' ? 'grid' : 'calendar';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<ViewModeContextValue>(() => ({
    viewMode,
    setViewMode,
    toggleViewMode,
    isCalendarView: viewMode === 'calendar',
    isGridView: viewMode === 'grid',
  }), [viewMode, toggleViewMode]);

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
}

/**
 * Hook to access view mode context
 */
export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within ViewModeProvider');
  }
  return context;
}
