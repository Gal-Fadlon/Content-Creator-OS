# Constants Module

Centralized constants for the application, providing type-safe, maintainable values used across components.

## Files

### `strings.constants.ts`
All user-facing UI strings organized by feature/component. Supports Hebrew RTL text and includes dynamic string functions for parameterized messages. Designed for future i18n support.

### `calendar.constants.ts`
Calendar-specific constants including Hebrew (`DAYS_HE`, `MONTHS_HE`) and English (`MONTHS_EN`) day/month names.

### `stickers.constants.ts`
Sticker bank definitions with Lucide icons, colors, and labels. Includes `AVAILABLE_STICKERS` array and `ICON_MAP` for rendering saved stickers.

## Usage

```tsx
import { COMMON, STATUS_LABELS } from '@/constants/strings.constants';
import { MONTHS_HE } from '@/constants/calendar.constants';
import { AVAILABLE_STICKERS } from '@/constants/stickers.constants';
```

## Conventions

- All exports use `as const` for literal type inference
- String objects are organized by component/feature section
- Dynamic strings are implemented as functions: `(count: number) => string`
