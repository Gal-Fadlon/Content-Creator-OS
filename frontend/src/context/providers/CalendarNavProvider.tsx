/**
 * Calendar Navigation Provider
 * Manages the current month and navigation
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { addMonths, subMonths, startOfMonth, format } from 'date-fns';

interface CalendarNavContextValue {
  /** Current month being displayed */
  currentMonth: Date;
  /** Set the current month */
  setCurrentMonth: (date: Date) => void;
  /** Navigate to next month */
  goToNextMonth: () => void;
  /** Navigate to previous month */
  goToPrevMonth: () => void;
  /** Navigate to today's month */
  goToToday: () => void;
  /** Month key in "YYYY-MM" format (for cache keys, etc.) */
  monthKey: string;
}

const CalendarNavContext = createContext<CalendarNavContextValue | undefined>(undefined);

interface CalendarNavProviderProps {
  children: ReactNode;
  /** Initial month to display */
  defaultMonth?: Date;
}

export function CalendarNavProvider({
  children,
  defaultMonth = new Date(),
}: CalendarNavProviderProps) {
  const [currentMonth, setCurrentMonthState] = useState(() => startOfMonth(defaultMonth));

  const setCurrentMonth = useCallback((date: Date) => {
    setCurrentMonthState(startOfMonth(date));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonthState((prev) => startOfMonth(addMonths(prev, 1)));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentMonthState((prev) => startOfMonth(subMonths(prev, 1)));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonthState(startOfMonth(new Date()));
  }, []);

  const monthKey = useMemo(() => format(currentMonth, 'yyyy-MM'), [currentMonth]);

  const value = useMemo<CalendarNavContextValue>(() => ({
    currentMonth,
    setCurrentMonth,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
    monthKey,
  }), [currentMonth, setCurrentMonth, goToNextMonth, goToPrevMonth, goToToday, monthKey]);

  return (
    <CalendarNavContext.Provider value={value}>
      {children}
    </CalendarNavContext.Provider>
  );
}

/**
 * Hook to access calendar navigation
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCalendarNav() {
  const context = useContext(CalendarNavContext);
  if (context === undefined) {
    throw new Error('useCalendarNav must be used within CalendarNavProvider');
  }
  return context;
}

/**
 * Hook to get just the month key (minimizes re-renders)
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMonthKey(): string {
  const { monthKey } = useCalendarNav();
  return monthKey;
}
