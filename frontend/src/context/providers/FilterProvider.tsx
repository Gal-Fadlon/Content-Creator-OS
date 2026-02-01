/**
 * Filter Provider
 * Manages content filters
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { ContentFilters } from '@/types/content';

interface FilterContextValue {
  /** Current filters */
  filters: ContentFilters;
  /** Set all filters at once */
  setFilters: (filters: ContentFilters) => void;
  /** Update a single filter */
  updateFilter: <K extends keyof ContentFilters>(key: K, value: ContentFilters[K]) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Whether any filters are active */
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  /** Initial filters */
  defaultFilters?: ContentFilters;
}

const emptyFilters: ContentFilters = {};

export function FilterProvider({
  children,
  defaultFilters = emptyFilters,
}: FilterProviderProps) {
  const [filters, setFilters] = useState<ContentFilters>(defaultFilters);

  const updateFilter = useCallback(<K extends keyof ContentFilters>(
    key: K,
    value: ContentFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(emptyFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
      return value !== undefined && value !== null && value !== '';
    });
  }, [filters]);

  const value = useMemo<FilterContextValue>(() => ({
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  }), [filters, updateFilter, clearFilters, hasActiveFilters]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

/**
 * Hook to access filter context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
