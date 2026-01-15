/**
 * View Mode Provider
 * Manages the calendar vs grid view toggle
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { CalendarView } from '@/types/content';

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
  const [viewMode, setViewMode] = useState<CalendarView>(defaultViewMode);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'calendar' ? 'grid' : 'calendar'));
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
