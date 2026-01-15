# Layout Components

This folder contains **application-level layout components** responsible for the main UI structure, navigation, and global controls.

## File Structure

Each component follows the pattern:
```
ComponentName/
  ├── ComponentName.tsx      # Component logic
  └── ComponentName.style.ts # MUI styled components
```

## Components Overview

### AppHeader
Main application header bar containing:
- Logo and title
- `ClientSelector` (admin only)
- Client name display (client role)
- `NotificationBell`
- `ViewToggle` (calendar/grid)
- `BackdropManager` (admin only)
- `RoleToggle`
- "Request Event" button (client role)

**Props:** `viewMode`, `onViewModeChange`, `onRequestEvent`

### BackdropManager
Dialog for selecting monthly calendar backdrops (admin only).
- Preset backdrop options (minimal, cream, warm, botanical, marble, linen)
- Custom image upload
- Uses `useMonthlyState` context to persist selection per month

### BrandHeader
Simple branded header with gradient background and title. Uses Cormorant Garamond font.

### ClientSelector
Drawer component for admin to switch between clients.
- Displays client list with avatars
- Shows pending approvals count
- Uses `useClients` query hook and `SelectedClientProvider`

### MonthlyThemeEditor
Inline editable text field for monthly themes.
- Displays month/year label with theme text
- Edit mode with save/cancel (admin only)
- Uses `useMonthlyState` context

### NotificationBell
Notification icon with badge and popover list.
- Shows unread count badge
- Popover with notification list
- Auto-marks all as read on open
- Uses `useNotifications` query hooks

### RoleToggle
Toggle between admin/client roles (for demo purposes).
- Two icon buttons (admin/client)
- Uses `useAuth` context

### ViewToggle
Toggle between calendar and grid views.
- Two buttons with icons
- Exports `ViewMode` type

**Props:** `viewMode`, `onViewModeChange`

## Styling Conventions

- All styles use MUI `styled()` API
- Consistent button containers with rounded borders and shadows
- Typography: Heebo (sans-serif) for UI, Cormorant Garamond for headings
- Custom props use `shouldForwardProp` to prevent DOM warnings

## Dependencies

- MUI components (`AppBar`, `Drawer`, `Popover`, `Dialog`, etc.)
- Context providers: `AuthProvider`, `SelectedClientProvider`, `CalendarNavProvider`, `MonthlyStateProvider`
- Query hooks: `useClients`, `useNotifications`
- String constants from `@/constants/strings.constants`
