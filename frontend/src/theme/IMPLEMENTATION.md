# Theme Implementation

## Overview

MUI theme configuration implementing a boutique moodboard design system with RTL Hebrew support and luxury paper card aesthetics.

## Structure

```
theme/
├── index.ts           # Theme creation and export
├── ThemeProvider.tsx  # React provider wrapper
├── palette.ts         # Color definitions and palette
├── typography.ts      # Font families and text styles
├── components.ts      # MUI component overrides
└── rtlCache.ts        # Emotion cache for RTL
```

## Files Summary

### `index.ts`
Creates the MUI theme combining palette, typography, and component overrides with RTL direction and 8px spacing system.

### `ThemeProvider.tsx`
Wraps the app with:
- `CacheProvider` for Emotion RTL cache
- `MuiThemeProvider` with light theme
- `CssBaseline` for consistent base styles

### `palette.ts`
**Core Colors:**
- `earthBrown` (#823d22) - Primary
- `sandGold` (#c8ad7f) - Secondary
- `burgundy` (#6b1b00) - Error
- `royalBlue` (#002366) - Info
- `cream` (#f7f5f0) - Background paper
- `charcoal` (#3d2e24) - Text primary

**Extended Palette (custom):**
- `status` - draft, pending, approved, published
- `contentType` - reel, story, post
- `marker` - red, blue, beige, brown, black (for events)

### `typography.ts`
**Font Families:**
- Body: Assistant, Heebo, Rubik (Hebrew-friendly)
- Display: Playfair Display (headings)
- Mono: JetBrains Mono (technical)

**Key Settings:**
- `textTransform: 'none'` on buttons (preserves Hebrew case)
- Optimized line heights for RTL text

### `components.ts`
MUI overrides for boutique aesthetic:
- **Buttons**: 12px radius, gradient backgrounds, no shadows
- **Cards/Paper**: 16px radius, soft shadows, cream gradient
- **Dialogs**: 20px radius, RTL direction
- **Inputs**: 10px radius, RTL text alignment
- **Select/Menu**: RTL positioning, icon on left

### `rtlCache.ts`
Simple Emotion cache (RTL handled via CSS direction property).

## Usage

```tsx
import { ThemeProvider } from '@/theme/ThemeProvider';
import { lightTheme } from '@/theme';

// Access custom palette
theme.palette.status.approved  // '#002366'
theme.palette.marker.red       // '#6b1b00'
theme.palette.contentType.reel // '#002366'
```
