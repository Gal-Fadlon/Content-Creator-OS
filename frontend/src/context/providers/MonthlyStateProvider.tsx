/**
 * Monthly State Provider
 * Manages per-month backdrop, stickers, and theme
 */

import { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import type { MonthlyState, PlacedSticker, CustomSticker } from '@/types/content';
import { useMonthKey } from './CalendarNavProvider';

// ============ STATE ============

interface MonthlyStatesMap {
  [monthKey: string]: MonthlyState;
}

// ============ ACTIONS ============

type MonthlyStateAction =
  | { type: 'SET_BACKDROP'; monthKey: string; backdrop: string }
  | { type: 'SET_STICKERS'; monthKey: string; stickers: PlacedSticker[] }
  | { type: 'SET_THEME'; monthKey: string; theme: string }
  | { type: 'ADD_CUSTOM_STICKER'; monthKey: string; sticker: CustomSticker }
  | { type: 'REMOVE_CUSTOM_STICKER'; monthKey: string; stickerId: string };

// ============ REDUCER ============

function createEmptyMonthState(monthKey: string): MonthlyState {
  return {
    monthKey,
    backdrop: '',
    stickers: [],
    customStickerBank: [],
    theme: '',
  };
}

function monthlyStateReducer(state: MonthlyStatesMap, action: MonthlyStateAction): MonthlyStatesMap {
  const getMonthState = (monthKey: string) => state[monthKey] ?? createEmptyMonthState(monthKey);

  switch (action.type) {
    case 'SET_BACKDROP':
      return {
        ...state,
        [action.monthKey]: {
          ...getMonthState(action.monthKey),
          backdrop: action.backdrop,
        },
      };

    case 'SET_STICKERS':
      return {
        ...state,
        [action.monthKey]: {
          ...getMonthState(action.monthKey),
          stickers: action.stickers,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        [action.monthKey]: {
          ...getMonthState(action.monthKey),
          theme: action.theme,
        },
      };

    case 'ADD_CUSTOM_STICKER':
      return {
        ...state,
        [action.monthKey]: {
          ...getMonthState(action.monthKey),
          customStickerBank: [
            ...getMonthState(action.monthKey).customStickerBank,
            action.sticker,
          ],
        },
      };

    case 'REMOVE_CUSTOM_STICKER':
      return {
        ...state,
        [action.monthKey]: {
          ...getMonthState(action.monthKey),
          customStickerBank: getMonthState(action.monthKey).customStickerBank.filter(
            (s) => s.id !== action.stickerId
          ),
        },
      };

    default:
      return state;
  }
}

// ============ CONTEXT ============

interface MonthlyStateContextValue {
  /** All monthly states */
  monthlyStates: MonthlyStatesMap;
  /** Current month's state */
  currentMonthState: MonthlyState;
  /** Set backdrop for current month */
  setBackdrop: (backdrop: string) => void;
  /** Set stickers for current month */
  setStickers: (stickers: PlacedSticker[]) => void;
  /** Set theme for current month */
  setTheme: (theme: string) => void;
  /** Add custom sticker to current month's bank */
  addCustomSticker: (sticker: Omit<CustomSticker, 'id' | 'createdAt'>) => void;
  /** Remove custom sticker from current month's bank */
  removeCustomSticker: (id: string) => void;
}

const MonthlyStateContext = createContext<MonthlyStateContextValue | undefined>(undefined);

interface MonthlyStateProviderProps {
  children: ReactNode;
}

export function MonthlyStateProvider({ children }: MonthlyStateProviderProps) {
  const [monthlyStates, dispatch] = useReducer(monthlyStateReducer, {});
  const monthKey = useMonthKey();

  const currentMonthState = useMemo<MonthlyState>(() => {
    return monthlyStates[monthKey] ?? createEmptyMonthState(monthKey);
  }, [monthlyStates, monthKey]);

  const setBackdrop = useCallback((backdrop: string) => {
    dispatch({ type: 'SET_BACKDROP', monthKey, backdrop });
  }, [monthKey]);

  const setStickers = useCallback((stickers: PlacedSticker[]) => {
    dispatch({ type: 'SET_STICKERS', monthKey, stickers });
  }, [monthKey]);

  const setTheme = useCallback((theme: string) => {
    dispatch({ type: 'SET_THEME', monthKey, theme });
  }, [monthKey]);

  const addCustomSticker = useCallback((stickerData: Omit<CustomSticker, 'id' | 'createdAt'>) => {
    const sticker: CustomSticker = {
      ...stickerData,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CUSTOM_STICKER', monthKey, sticker });
  }, [monthKey]);

  const removeCustomSticker = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_STICKER', monthKey, stickerId: id });
  }, [monthKey]);

  const value = useMemo<MonthlyStateContextValue>(() => ({
    monthlyStates,
    currentMonthState,
    setBackdrop,
    setStickers,
    setTheme,
    addCustomSticker,
    removeCustomSticker,
  }), [
    monthlyStates,
    currentMonthState,
    setBackdrop,
    setStickers,
    setTheme,
    addCustomSticker,
    removeCustomSticker,
  ]);

  return (
    <MonthlyStateContext.Provider value={value}>
      {children}
    </MonthlyStateContext.Provider>
  );
}

/**
 * Hook to access monthly state context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMonthlyState() {
  const context = useContext(MonthlyStateContext);
  if (context === undefined) {
    throw new Error('useMonthlyState must be used within MonthlyStateProvider');
  }
  return context;
}
