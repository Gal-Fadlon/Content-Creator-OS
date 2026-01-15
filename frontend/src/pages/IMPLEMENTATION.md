# Pages Implementation

## Overview

Top-level page components that compose layouts and features into full views.

## Structure

```
pages/
├── Dashboard/
│   ├── Dashboard.tsx        # Main dashboard page
│   └── Dashboard.style.ts   # Page-level styles
└── NotFound/
    ├── NotFound.tsx         # 404 error page
    └── NotFound.style.ts    # Error page styles
```

## Pages Summary

### `Dashboard`
The main application page containing:
- **Dynamic Backdrop**: Monthly background image overlay
- **StickerBank & StickerOverlay**: Admin sticker management
- **BrandHeader & AppHeader**: Navigation and controls
- **MonthlyThemeEditor**: Theme configuration section
- **FilterBar**: Content filtering
- **CalendarView / GridView**: Togglable content views
- **ContentModal & ClientEventRequestModal**: Modal dialogs

Key contexts used:
- `useMonthlyState()` - Monthly backdrop/theme
- `useViewMode()` - Calendar vs Grid toggle
- `useContentModal()` / `useEventRequestModal()` - Modal management

### `NotFound`
Simple 404 error page with:
- Hebrew "Page not found" message
- Link to return home
- RTL layout support

## Styling Pattern

Each page follows the component/style separation:
- `.tsx` - Component logic and composition
- `.style.ts` - MUI styled-components with theme integration
