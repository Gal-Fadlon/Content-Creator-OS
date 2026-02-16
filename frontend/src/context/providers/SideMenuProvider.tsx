/**
 * SideMenu Provider
 * Manages collapsed/expanded state for the side navigation menu
 * Persists state to localStorage, auto-collapses on small screens
 */

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';

const STORAGE_KEY = 'content-creator-os-side-menu-collapsed';
const COLLAPSE_BREAKPOINT = 900; // px

interface SideMenuContextValue {
  collapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SideMenuContext = createContext<SideMenuContextValue | undefined>(undefined);

function getInitialCollapsed(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return window.innerWidth < COLLAPSE_BREAKPOINT;
}

export function SideMenuProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(getInitialCollapsed);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < COLLAPSE_BREAKPOINT) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  const value = useMemo<SideMenuContextValue>(() => ({
    collapsed,
    toggleCollapse,
    setCollapsed,
  }), [collapsed, toggleCollapse, setCollapsed]);

  return (
    <SideMenuContext.Provider value={value}>
      {children}
    </SideMenuContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSideMenu() {
  const context = useContext(SideMenuContext);
  if (context === undefined) {
    throw new Error('useSideMenu must be used within SideMenuProvider');
  }
  return context;
}
