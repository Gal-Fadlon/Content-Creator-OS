# Best Practices for Content Creator OS

This document outlines the coding standards and best practices for this project.

> **For LLMs**: This file covers both frontend and backend conventions. Read the relevant section based on what you're working on.

---

# Table of Contents

- [Frontend Best Practices](#frontend-best-practices)
  - [RTL Support](#rtl-right-to-left-support)
  - [Styling Guidelines](#styling-guidelines)
  - [Component Structure](#component-structure)
  - [File Structure Guidelines](#file-structure-guidelines)
  - [React Best Practices](#react-best-practices)
  - [UI/UX Guidelines](#uiux-guidelines)
- [Backend Best Practices](#backend-best-practices)
  - [Architecture Principles](#architecture-principles)
  - [Project Structure](#backend-project-structure)
  - [API Design](#api-design)
  - [Database & Supabase](#database--supabase)
  - [Authentication & Authorization](#authentication--authorization)
  - [Error Handling](#error-handling)
  - [Security](#security)
  - [Performance](#performance)
  - [Testing](#testing)

---

# Frontend Best Practices

## RTL (Right-to-Left) Support

This is a Hebrew application with full RTL support.

### Global RTL Configuration

RTL is configured at multiple levels:
1. `index.html` - `<html lang="he" dir="rtl">`
2. MUI Theme - `direction: 'rtl'` in `baseThemeOptions`
3. Emotion Cache - `stylis-plugin-rtl` in `rtlCache.ts`
4. Global CSS - `html { direction: rtl; }` in `index.css`
5. MUI Component Overrides - RTL defaults in `theme/components.ts`

### Input Components RTL

All input components should inherit RTL from the theme. If you need to add a new input component:
- **DO NOT** manually add `direction: 'rtl'` or `textAlign: 'right'` to individual components
- **DO** add RTL defaults to `frontend/src/theme/components.ts` for the MUI component type
- This ensures consistency across the entire application

### Text Alignment in RTL

- Use `textAlign: 'right'` for Hebrew text
- Use `justifyContent: 'flex-start'` (not `flex-end`) to align items to the right in RTL context
- For flex containers, remember that `flex-start` means "right" in RTL

### Calendar Navigation Arrows

In RTL mode, navigation arrows should be visually swapped:
- Left arrow (`ChevronLeftIcon`) should navigate **forward** (next)
- Right arrow (`ChevronRightIcon`) should navigate **backward** (previous)

---

## Styling Guidelines

### Styled Components

Use MUI's `styled()` function for all component styling:

```tsx
// ✅ CORRECT - Use styled from MUI
import { styled } from '@mui/material/styles';

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));
```

```tsx
// ❌ INCORRECT - Don't use inline sx prop for complex styles
<Button sx={{ padding: 16, borderRadius: 8, ... }} />
```

### Style File Organization

Each component should have its styles in a separate `.style.ts` file.

**Component directory structure:**

```
ComponentName/
├── ComponentName.tsx         # Component logic
├── ComponentName.style.ts    # Styled components
├── ComponentName.helper.ts   # (optional) Helper functions used only by this component
└── useComponentName.ts       # (optional) Hook used only by this component
```

❌ **Do NOT** add to a component directory:
- No `index.ts` barrel files
- No subcomponents in the same directory

If a component needs subcomponents, each subcomponent gets its **own directory**:

```
// ✅ CORRECT
features/calendar/
├── CalendarDay/
│   ├── CalendarDay.tsx
│   └── CalendarDay.style.ts
├── ContentBadge/              ← Separate directory for sub-component
│   ├── ContentBadge.tsx
│   └── ContentBadge.style.ts
└── EventBadge/                ← Separate directory for sub-component
    ├── EventBadge.tsx
    └── EventBadge.style.ts

// ❌ INCORRECT - Multiple components in one directory
features/calendar/
└── CalendarDay/
    ├── CalendarDay.tsx
    ├── CalendarDay.style.ts
    ├── ContentBadge.tsx       ← Should be in its own directory!
    ├── ContentBadge.style.ts
    ├── EventBadge.tsx
    └── EventBadge.style.ts
```

### Avoid `!important`

Never use `!important` in styled-components as it can cause issues with the stylis CSS processor:

```tsx
// ❌ INCORRECT
textAlign: 'right !important' as any

// ✅ CORRECT
textAlign: 'right'
```

### Avoid Pseudo-element Issues

Be careful with `::placeholder` and other pseudo-elements in styled-components. If they cause build errors, apply the styles to the input element directly.

---

## MUI Component Customization

### Theme-Level Customization

Add component defaults in `frontend/src/theme/components.ts` rather than styling individual instances:

```tsx
// ✅ CORRECT - Add to theme/components.ts
MuiTextField: {
  styleOverrides: {
    root: {
      direction: 'rtl',
    },
  },
},
```

```tsx
// ❌ AVOID - Styling every instance manually
<TextField inputProps={{ dir: 'rtl', style: { textAlign: 'right' } }} />
```

### Select Component with RTL

When using `Select` components, ensure the dropdown menu also has RTL:

```tsx
MenuProps={{
  PaperProps: {
    sx: { direction: 'rtl' }
  }
}}
```

This is now configured globally in the theme.

---

## Component Structure

### Icon Positioning in RTL

For buttons with icons in RTL:
- `startIcon` appears on the **right** side of text
- `endIcon` appears on the **left** side of text
- Use `gap` for spacing between icon and text instead of margins

### Drawer/Panel Direction

In RTL mode, MUI flips the `anchor` prop:
- Use `anchor="left"` to make a drawer open from the **right**
- Use `anchor="right"` to make a drawer open from the **left**

---

## Date Formatting

### Hebrew Date Format

Use the format `DD/MM/YYYY` for dates:

```tsx
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
```

---

## Git Branch Naming Convention

Branch names must follow this format:
```
DELIVERY-<ticket-number>-<description>
```

Where `ticket-number` is the Jira delivery ticket number.

---

## General Guidelines

1. **Prefer editing existing files** over creating new ones
2. **Keep solutions simple** - don't over-engineer
3. **Follow DRY principle** - reuse existing abstractions
4. **Test RTL layout** after any UI changes
5. **Use Hebrew text** for all user-facing strings (defined in `constants/strings.constants.ts`)

---

## File Structure Guidelines

### No Barrel Files (index.ts / index.tsx)

Do not create `index.ts` or `index.tsx` barrel files that only re-export from other files. This applies to **all directories** including `components/`, `hooks/`, etc.

```tsx
// ✅ CORRECT - Direct imports
import CalendarView from '@/components/features/calendar/CalendarView/CalendarView';
import { useCalendarDragDrop } from '@/components/features/calendar/hooks/useCalendarDragDrop';
import { useStickerBank } from '@/components/features/stickers/hooks/useStickerBank';

// ❌ INCORRECT - Via barrel files
import { CalendarView } from '@/components/features/calendar';
import { useCalendarDragDrop } from '@/components/features/calendar/hooks';
import { useStickerBank } from '../hooks';
```

**Applies to:**
- Component directories (no `index.ts` to re-export component)
- Feature `hooks/` directories (no `index.ts` to group hook exports)
- Any other directory in `components/`

**Exception:** The `context/index.tsx` file is allowed because it contains the `AppProviders` component (actual logic), not just re-exports.

### Hook Organization

Hooks should only be in a shared `hooks/` directory if they are **used by more than one component**. Otherwise, the hook belongs in the component's own directory.

**Single-use hook (in component directory):**
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.style.ts
└── useComponentName.ts    ← Hook used only by this component
```

**Shared hook (in feature hooks directory):**
```
features/calendar/
├── hooks/
│   └── useSharedHook.ts   ← Used by multiple calendar components
├── ComponentA/
│   └── ...
└── ComponentB/
    └── ...
```

### Helper Functions Organization

Helper functions (utilities) follow the same principle as hooks: **colocate with the component that uses them**.

**Single-use helper (in component directory):**
```
CalendarView/
├── CalendarView.tsx
├── CalendarView.style.ts
├── CalendarView.helper.ts    ← Utilities used only by CalendarView
└── useCalendarData.ts
```

```tsx
// In CalendarView.helper.ts
export const applyContentFilters = (...) => { ... };
export const generateCalendarDates = (...) => { ... };
export const formatDateISO = (...) => { ... };

// In useCalendarData.ts
import { applyContentFilters, generateCalendarDates, formatDateISO } from './CalendarView.helper';
```

**Shared helpers across multiple components:**
If a helper is used by multiple components within a feature, consider:
1. Placing it in the parent component's helper file if one component is a child
2. Creating a shared types file in `@/types/` if it's a type guard

```tsx
// ✅ CORRECT - Type guard in parent component's helper (ContentForm is child of ContentModal)
// ContentModal/contentModal.helper.ts
export const isContentItem = (item: CalendarItem): item is ContentItem => { ... };

// ContentForm/ContentForm.tsx
import { isContentItem } from '../ContentModal/ContentModal.helper';
```

❌ **Do NOT** create a global `utils/` folder for single-use functions. Every function should live as close as possible to where it's used.

### Shared Types

When a type/interface is used by multiple files but the hook that defines it is only used by one component:
- Move the type to `@/types/content.ts` (or appropriate types file)
- Keep the hook in the component directory

```tsx
// ✅ CORRECT
// In @/types/content.ts
export interface CalendarDayData { ... }

// In CalendarView/useCalendarData.ts
import type { CalendarDayData } from '@/types/content';
```

---

## React Best Practices

### Hooks Must Be Called Unconditionally

All React hooks must be called before any early return statements. This prevents the "Rendered fewer hooks than expected" error:

```tsx
// ✅ CORRECT
const MyComponent = () => {
  const { isAdmin } = useAuth();
  const [state, setState] = useState(false);

  if (!isAdmin) return null;

  return <div>...</div>;
};

// ❌ INCORRECT
const MyComponent = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null; // Early return BEFORE all hooks!

  const [state, setState] = useState(false); // This causes the error
  return <div>...</div>;
};
```

---

## UI/UX Guidelines

### No Toast Notifications for Routine Operations

Don't show toast notifications for routine operations like:
- Reordering items (drag & drop)
- Saving inline edits
- Updating cover images

Reserve toasts for important confirmations or errors.

### Icons-Only Buttons Must Have Tooltips

When using icon-only buttons (no text), always wrap them with a `Tooltip` for accessibility:

```tsx
<Tooltip title={LABEL_TEXT} arrow>
  <IconButton aria-label={LABEL_TEXT}>
    <SomeIcon />
  </IconButton>
</Tooltip>
```

### Consistent Button Sizing

When buttons should appear the same size (e.g., in a header), use the exact same pixel values rather than `theme.spacing()`:

```tsx
// ✅ CORRECT - Exact pixel values for consistency
export const StyledContainer = styled(Box)({
  borderRadius: 10,
  padding: 4,
});

export const StyledButton = styled(Button)({
  height: 30,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: '0.8125rem',
});
```

### Readable Button Text

Ensure button text has sufficient contrast with its background:
- Dark backgrounds (e.g., primary color) should have white text: `color: theme.palette.common.white`
- Light backgrounds should have dark text

### ClickAwayListener with Dialogs

When implementing click-away-to-close behavior, check if a dialog is open first to prevent closing the parent when interacting with the dialog:

```tsx
const handleClickAway = () => {
  if (showDialog) return; // Don't close if dialog is open
  onClose();
};
```

---

## RTL Positioning

### Use Logical CSS Properties

For RTL-compatible positioning, use logical CSS properties instead of physical ones:

```tsx
// ✅ CORRECT - Works in both LTR and RTL
insetInlineStart: 8,  // Instead of 'left'
insetInlineEnd: 8,    // Instead of 'right'

// ❌ AVOID - Physical properties don't flip in RTL
left: 8,
right: 8,
```

### Stylis-Plugin-RTL Auto-Flip Behavior

The `stylis-plugin-rtl` automatically flips certain CSS properties. Be aware of this when positioning elements:

**Properties that get flipped:**
- `left` ↔ `right`
- `margin-left` ↔ `margin-right`
- `padding-left` ↔ `padding-right`
- `flex-start` ↔ `flex-end` (in flexbox alignment)

**To prevent auto-flipping for fixed UI elements (like floating buttons):**

```tsx
// ✅ CORRECT - Use both properties to prevent flip
export const StyledFloatingButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  left: 'auto',  // Explicitly set to prevent RTL flip
  top: '50%',
}));
```

**Flexbox alignment in RTL:**
- Use `flex-start` when you want items on the **right** side (it gets flipped to right in RTL)
- Use `flex-end` when you want items on the **left** side (it gets flipped to left in RTL)

---

## Calendar Specific

### Consistent Calendar Grid

The calendar grid should always display 35 days (5 rows × 7 columns) regardless of the month, to prevent layout jumps when navigating between months.

### Disabled Days

Days that are not in the current month should be:
- Visually muted (lower opacity)
- Non-interactive (`pointerEvents: 'none'`, `cursor: 'default'`)

---
---

# Backend Best Practices

> **Stack**: Node.js + TypeScript + Supabase (PostgreSQL) + Cloudflare R2

---

## Architecture Principles

### 1. Clean Architecture Layers

Follow the **Clean Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│         (Controllers, Routes, Middleware)               │
├─────────────────────────────────────────────────────────┤
│                    Application Layer                     │
│              (Use Cases, DTOs, Validators)              │
├─────────────────────────────────────────────────────────┤
│                      Domain Layer                        │
│         (Entities, Business Rules, Interfaces)          │
├─────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                   │
│      (Database, External APIs, File Storage)            │
└─────────────────────────────────────────────────────────┘
```

**Dependencies flow inward only** - outer layers depend on inner layers, never the reverse.

### 2. SOLID Principles

| Principle | Application |
|-----------|-------------|
| **S**ingle Responsibility | Each module/class does one thing |
| **O**pen/Closed | Extend behavior without modifying existing code |
| **L**iskov Substitution | Interfaces should be substitutable |
| **I**nterface Segregation | Small, focused interfaces |
| **D**ependency Inversion | Depend on abstractions, not implementations |

### 3. Domain-Driven Design (DDD)

For complex business logic:
- Define **Aggregates** (Content, Client, Event)
- Use **Value Objects** for immutable data
- Implement **Repository Pattern** for data access
- Keep **Domain Events** for cross-aggregate communication

---

## Backend Project Structure

```
backend/
├── src/
│   ├── config/                 # Configuration management
│   │   ├── index.ts            # Config aggregator
│   │   ├── database.ts         # Database config
│   │   ├── auth.ts             # Auth config
│   │   └── storage.ts          # R2/S3 config
│   │
│   ├── modules/                # Feature modules (domain-driven)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── clients/
│   │   │   ├── clients.controller.ts
│   │   │   ├── clients.service.ts
│   │   │   ├── clients.repository.ts
│   │   │   ├── clients.routes.ts
│   │   │   ├── clients.dto.ts
│   │   │   └── clients.validation.ts
│   │   │
│   │   ├── content/
│   │   │   └── ... (same pattern)
│   │   │
│   │   └── events/
│   │       └── ... (same pattern)
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── requestLogger.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validateRequest.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── asyncHandler.ts
│   │   │   └── pagination.ts
│   │   │
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   ├── ValidationError.ts
│   │   │   └── UnauthorizedError.ts
│   │   │
│   │   └── types/
│   │       ├── express.d.ts
│   │       └── common.ts
│   │
│   ├── database/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── migrations/         # SQL migrations
│   │   └── seeds/              # Seed data
│   │
│   ├── storage/
│   │   ├── r2Client.ts         # Cloudflare R2 client
│   │   └── uploadService.ts    # Upload logic
│   │
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local                  # Local secrets (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

### Module Structure Pattern

Each module follows the same pattern:

```typescript
// modules/content/content.controller.ts
export class ContentController {
  constructor(private contentService: ContentService) {}
  
  getAll = asyncHandler(async (req, res) => { ... });
  getById = asyncHandler(async (req, res) => { ... });
  create = asyncHandler(async (req, res) => { ... });
  update = asyncHandler(async (req, res) => { ... });
  delete = asyncHandler(async (req, res) => { ... });
}

// modules/content/content.service.ts
export class ContentService {
  constructor(private contentRepo: ContentRepository) {}
  
  async getAll(clientId: string): Promise<Content[]> { ... }
  async getById(id: string): Promise<Content | null> { ... }
  async create(data: CreateContentDto): Promise<Content> { ... }
  async update(id: string, data: UpdateContentDto): Promise<Content> { ... }
  async delete(id: string): Promise<void> { ... }
}

// modules/content/content.repository.ts
export class ContentRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async findAll(clientId: string): Promise<Content[]> { ... }
  async findById(id: string): Promise<Content | null> { ... }
  async insert(data: InsertContent): Promise<Content> { ... }
  async update(id: string, data: UpdateContent): Promise<Content> { ... }
  async delete(id: string): Promise<void> { ... }
}
```

---

## API Design

### RESTful Conventions

| Action | HTTP Method | URL Pattern | Response Code |
|--------|-------------|-------------|---------------|
| List | `GET` | `/api/v1/resources` | 200 |
| Get one | `GET` | `/api/v1/resources/:id` | 200 |
| Create | `POST` | `/api/v1/resources` | 201 |
| Update (full) | `PUT` | `/api/v1/resources/:id` | 200 |
| Update (partial) | `PATCH` | `/api/v1/resources/:id` | 200 |
| Delete | `DELETE` | `/api/v1/resources/:id` | 204 |

### API Versioning

Always version your APIs:

```typescript
// ✅ CORRECT
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/content', contentRouter);

// ❌ INCORRECT - No versioning
app.use('/clients', clientsRouter);
```

### Request/Response Format

**Consistent response structure:**

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### DTOs (Data Transfer Objects)

Always use DTOs for input/output:

```typescript
// content.dto.ts
export interface CreateContentDto {
  clientId: string;
  type: 'post' | 'story' | 'reel';
  caption?: string;
  scheduledDate?: string;
}

export interface ContentResponseDto {
  id: string;
  clientId: string;
  type: string;
  status: string;
  caption: string | null;
  scheduledDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// Transform entity to DTO
export const toContentDto = (entity: Content): ContentResponseDto => ({
  id: entity.id,
  clientId: entity.client_id,
  type: entity.type,
  status: entity.status,
  caption: entity.caption,
  scheduledDate: entity.scheduled_date,
  createdAt: entity.created_at,
  updatedAt: entity.updated_at,
});
```

### Input Validation

Use **Zod** for runtime validation:

```typescript
// content.validation.ts
import { z } from 'zod';

export const createContentSchema = z.object({
  body: z.object({
    clientId: z.string().uuid('Invalid client ID'),
    type: z.enum(['post', 'story', 'reel']),
    caption: z.string().max(2200).optional(),
    scheduledDate: z.string().datetime().optional(),
  }),
});

export const updateContentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    type: z.enum(['post', 'story', 'reel']).optional(),
    status: z.enum(['draft', 'pending', 'approved', 'published']).optional(),
    caption: z.string().max(2200).optional(),
  }),
});

// Middleware
export const validate = (schema: z.ZodSchema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  
  if (!result.success) {
    throw new ValidationError(result.error.errors);
  }
  
  next();
};
```

---

## Database & Supabase

### Supabase Client Setup

```typescript
// database/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client - bypasses RLS (use for admin operations)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create user-scoped client (respects RLS)
export const createUserClient = (accessToken: string) => {
  return createClient<Database>(supabaseUrl, process.env.SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};
```

### Query Best Practices

```typescript
// ✅ CORRECT - Select only needed columns
const { data } = await supabase
  .from('content')
  .select('id, type, status, caption, scheduled_date')
  .eq('client_id', clientId)
  .order('scheduled_date', { ascending: true });

// ❌ INCORRECT - Select all columns
const { data } = await supabase
  .from('content')
  .select('*');

// ✅ CORRECT - Use proper error handling
const { data, error } = await supabase
  .from('content')
  .select('*')
  .eq('id', id)
  .single();

if (error) {
  if (error.code === 'PGRST116') {
    throw new NotFoundError('Content not found');
  }
  throw new DatabaseError(error.message);
}

// ✅ CORRECT - Use transactions for related operations
const { data, error } = await supabase.rpc('create_content_with_notification', {
  p_content: contentData,
  p_notification: notificationData,
});
```

### Migration Best Practices

```sql
-- migrations/001_create_content_table.sql

-- Always use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('post', 'story', 'reel')),
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Always create indexes for foreign keys and frequently queried columns
CREATE INDEX IF NOT EXISTS idx_content_client_id ON content(client_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_scheduled_date ON content(scheduled_date);

-- Always add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## Authentication & Authorization

### JWT Middleware

```typescript
// shared/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '@/database/supabase';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'client';
    clientId: string | null;
  };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }
  
  const token = authHeader.substring(7);
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    throw new UnauthorizedError('Invalid or expired token');
  }
  
  // Get user profile with role
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, client_id')
    .eq('id', user.id)
    .single();
  
  (req as AuthenticatedRequest).user = {
    id: user.id,
    email: user.email!,
    role: profile?.role || 'client',
    clientId: profile?.client_id || null,
  };
  
  next();
};
```

### Role-Based Authorization

```typescript
// shared/middleware/authorize.ts
import { AuthenticatedRequest } from './auth';
import { ForbiddenError } from '@/shared/errors/ForbiddenError';

export const requireRole = (...roles: ('admin' | 'client')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};

export const requireAdmin = requireRole('admin');

export const requireSameClient = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { clientId } = req.params;
  
  if (req.user.role === 'admin') {
    return next(); // Admins can access any client
  }
  
  if (req.user.clientId !== clientId) {
    throw new ForbiddenError('Cannot access other client data');
  }
  
  next();
};
```

### Usage in Routes

```typescript
// modules/content/content.routes.ts
import { Router } from 'express';
import { authenticate, requireAdmin, requireSameClient } from '@/shared/middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Client can only access their own content
router.get('/clients/:clientId/content', requireSameClient, controller.getAll);
router.get('/clients/:clientId/content/:id', requireSameClient, controller.getById);

// Only admin can create/update/delete
router.post('/clients/:clientId/content', requireAdmin, controller.create);
router.patch('/content/:id', requireAdmin, controller.update);
router.delete('/content/:id', requireAdmin, controller.delete);

export default router;
```

---

## Error Handling

### Custom Error Classes

```typescript
// shared/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// shared/errors/NotFoundError.ts
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

// shared/errors/ValidationError.ts
export class ValidationError extends AppError {
  constructor(details: unknown) {
    super('Validation failed', 400, 'VALIDATION_ERROR', details);
  }
}

// shared/errors/UnauthorizedError.ts
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// shared/errors/ForbiddenError.ts
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
```

### Global Error Handler

```typescript
// shared/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/errors/AppError';
import { logger } from '@/shared/utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: (req as any).user?.id,
  });
  
  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }
  
  // Handle unknown errors (don't leak details in production)
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'Internal server error' : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
};
```

### Async Handler Wrapper

```typescript
// shared/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get('/content', asyncHandler(async (req, res) => {
  const content = await contentService.getAll();
  res.json({ success: true, data: content });
}));
```

---

## Security

### Security Headers

```typescript
// app.ts
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Rate Limiting

```typescript
// shared/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: { error: 'Too many login attempts, please try again later' },
});

// Usage
app.use('/api/', apiLimiter);
app.use('/api/v1/auth/login', authLimiter);
```

### Input Sanitization

```typescript
// Always sanitize user input
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
  allowedTags: [], // Strip all HTML
  allowedAttributes: {},
};

export const sanitizeInput = (input: string): string => {
  return sanitizeHtml(input.trim(), sanitizeOptions);
};

// In service
async create(data: CreateContentDto) {
  return this.contentRepo.insert({
    ...data,
    caption: data.caption ? sanitizeInput(data.caption) : null,
  });
}
```

### Environment Variables

```typescript
// config/index.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // R2
  R2_ENDPOINT: z.string().url(),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  
  // Security
  ALLOWED_ORIGINS: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:');
  console.error(result.error.format());
  process.exit(1);
}

export const config = result.data;
```

---

## Performance

### Database Query Optimization

```typescript
// ✅ Use pagination for list endpoints
async getAll(clientId: string, page = 1, limit = 20): Promise<PaginatedResult<Content>> {
  const offset = (page - 1) * limit;
  
  const { data, count, error } = await this.supabase
    .from('content')
    .select('*', { count: 'exact' })
    .eq('client_id', clientId)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });
  
  return {
    data: data || [],
    meta: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

// ✅ Use database functions for complex operations
const { data } = await supabase.rpc('get_content_with_stats', {
  p_client_id: clientId,
  p_month: month,
});
```

### Caching Strategy

```typescript
// Use Redis for frequently accessed data
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheMiddleware = (ttlSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `cache:${req.originalUrl}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    res.json = (data) => {
      redis.setex(cacheKey, ttlSeconds, JSON.stringify(data));
      return originalJson(data);
    };
    
    next();
  };
};

// Usage
router.get('/clients', cacheMiddleware(300), controller.getAll); // Cache 5 min
```

### Connection Pooling

Supabase handles connection pooling automatically, but for direct PostgreSQL:

```typescript
// If using pg directly
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## Testing

### Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   └── content.service.test.ts
│   └── utils/
│       └── pagination.test.ts
├── integration/
│   ├── api/
│   │   └── content.api.test.ts
│   └── database/
│       └── content.repository.test.ts
└── e2e/
    └── content.e2e.test.ts
```

### Unit Test Example

```typescript
// tests/unit/services/content.service.test.ts
import { ContentService } from '@/modules/content/content.service';
import { ContentRepository } from '@/modules/content/content.repository';

describe('ContentService', () => {
  let service: ContentService;
  let mockRepo: jest.Mocked<ContentRepository>;
  
  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    
    service = new ContentService(mockRepo);
  });
  
  describe('getById', () => {
    it('should return content when found', async () => {
      const mockContent = { id: '123', type: 'post' };
      mockRepo.findById.mockResolvedValue(mockContent);
      
      const result = await service.getById('123');
      
      expect(result).toEqual(mockContent);
      expect(mockRepo.findById).toHaveBeenCalledWith('123');
    });
    
    it('should throw NotFoundError when not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      
      await expect(service.getById('123')).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Integration Test Example

```typescript
// tests/integration/api/content.api.test.ts
import request from 'supertest';
import { app } from '@/app';
import { supabaseAdmin } from '@/database/supabase';

describe('Content API', () => {
  let authToken: string;
  let testClientId: string;
  
  beforeAll(async () => {
    // Setup test data
    const { data: client } = await supabaseAdmin
      .from('clients')
      .insert({ name: 'Test Client' })
      .select()
      .single();
    
    testClientId = client.id;
    
    // Get auth token
    authToken = await getTestAuthToken();
  });
  
  afterAll(async () => {
    // Cleanup
    await supabaseAdmin.from('clients').delete().eq('id', testClientId);
  });
  
  describe('GET /api/v1/clients/:clientId/content', () => {
    it('should return content list', async () => {
      const response = await request(app)
        .get(`/api/v1/clients/${testClientId}/content`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should return 401 without auth', async () => {
      await request(app)
        .get(`/api/v1/clients/${testClientId}/content`)
        .expect(401);
    });
  });
});
```

### Test Scripts

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "jest --testPathPattern=tests/e2e"
  }
}
```

---

## Logging

### Structured Logging

```typescript
// shared/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  base: {
    service: 'content-creator-api',
    env: process.env.NODE_ENV,
  },
});

// Usage
logger.info({ userId: user.id, action: 'login' }, 'User logged in');
logger.error({ error, path: req.path }, 'Request failed');
```

### Request Logging Middleware

```typescript
// shared/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '@/shared/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id,
    });
  });
  
  next();
};
```

---

## Git & CI/CD

### Git Branch Naming

```
DELIVERY-<ticket-number>-<description>

Examples:
- DELIVERY-123-add-content-api
- DELIVERY-456-fix-auth-middleware
```

### Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore

Examples:
- feat(content): add batch update endpoint
- fix(auth): handle expired token gracefully
- docs(api): update OpenAPI spec
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test:unit",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```
