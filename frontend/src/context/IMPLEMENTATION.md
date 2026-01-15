# Context Layer Implementation

This folder contains React Context providers for **client-side UI state** management.

> **Note:** Server state (content, events, clients, notifications) is handled by React Query hooks in `/hooks/queries/`, not contexts.

## Provider Hierarchy

Providers are composed in `AppProviders.tsx` in dependency order:

1. **ThemeProvider** – MUI theme
2. **QueryClientProvider** – React Query (5min stale, 10min gc)
3. **SnackbarProvider** – Toast notifications
4. **AuthProvider** – User session & role switching
5. **SelectedClientProvider** – Currently selected client
6. **CalendarNavProvider** – Month navigation
7. **ViewModeProvider** – Calendar vs Grid toggle
8. **FilterProvider** – Content filters
9. **ModalProvider** – Modal open/close state
10. **MonthlyStateProvider** – Per-month backdrops, stickers, themes

## Providers Summary

| Provider | State | Hooks |
|----------|-------|-------|
| `SnackbarProvider` | Toast messages queue | `useToast` |
| `AuthProvider` | User, role, auth state | `useAuth`, `useUserRole`, `useIsAdmin` |
| `SelectedClientProvider` | Selected client ID | `useSelectedClientId`, `useSelectedClient` |
| `CalendarNavProvider` | Current month, navigation | `useCalendarNav`, `useMonthKey` |
| `ViewModeProvider` | Calendar/Grid view mode | `useViewMode` |
| `FilterProvider` | Content filters | `useFilters` |
| `ModalProvider` | Content & event modals | `useModals`, `useContentModal`, `useEventRequestModal` |
| `MonthlyStateProvider` | Backdrop, stickers, theme per month | `useMonthlyState`, `useBackdrop`, `useStickers`, `useCustomStickerBank` |

## Patterns Used

- **createContext + Provider + custom hook** pattern for all contexts
- **useMemo** for stable context values to prevent unnecessary re-renders
- **useCallback** for action functions
- **useReducer** for complex state (MonthlyStateProvider)
- Specialized hooks (e.g., `useMonthKey`) to minimize re-renders by selecting only needed state
