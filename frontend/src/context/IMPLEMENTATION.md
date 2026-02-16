# Context Layer Implementation

React Context providers for **client-side UI state** management.

> Server state (content, events, notifications) is handled by React Query hooks in `/hooks/queries/`.

## Provider Hierarchy

Providers are composed in `AppProviders.tsx`:

1. **ThemeProvider** – MUI theme
2. **QueryClientProvider** – React Query
3. **SnackbarProvider** – Toast notifications
4. **AuthProvider** – User session & role switching
5. **SideMenuProvider** – Side menu collapsed/expanded state
6. **SelectedClientProvider** – Currently selected client
6. **CalendarNavProvider** – Month navigation
7. **ViewModeProvider** – Calendar vs Grid toggle
8. **FilterProvider** – Content filters
9. **ModalProvider** – Modal open/close state
10. **MonthlyStateProvider** – Per-month backdrops, stickers, themes

## Providers Summary

| Provider | State | Hooks |
|----------|-------|-------|
| `SnackbarProvider` | Toast messages | `useToast` |
| `AuthProvider` | User, role, Supabase session | `useAuth` |
| `SideMenuProvider` | Collapsed state (localStorage) | `useSideMenu` |
| `SelectedClientProvider` | Selected client ID | `useSelectedClientId`, `useSelectedClient` |
| `CalendarNavProvider` | Current month | `useCalendarNav`, `useMonthKey` |
| `ViewModeProvider` | Calendar/Grid view | `useViewMode` |
| `FilterProvider` | Content filters | `useFilters` |
| `ModalProvider` | Content & event modals | `useContentModal`, `useEventRequestModal` |
| `MonthlyStateProvider` | Backdrop, stickers, theme | `useMonthlyState`, `useBackdrop`, `useStickers` |

## Auth Flow

`AuthProvider` uses **Supabase Auth**:
- `signIn(email, password)` - Login with credentials
- `signOut()` - Cancels queries, clears cache, signs out
- Auto-fetches user profile from `profiles` table
- Listens to auth state changes via `onAuthStateChange`
