# Common Components

Reusable UI components shared across the application.

## DatePicker

A styled date picker component wrapping `react-day-picker`.

**Files:**
- `DatePicker.tsx` - Main component
- `DatePicker.style.ts` - MUI styled components

**Usage:**
```tsx
<DatePicker
  selected={selectedDate}
  onSelect={handleDateSelect}
  showOutsideDays={true}
/>
```

**Features:**
- Single date selection mode
- Custom navigation icons (Lucide `ChevronLeft`/`ChevronRight`)
- Themed styling matching app design system
- Memoized for performance

---

## Snackbar

A notification snackbar component for displaying toast messages.

**Files:**
- `Snackbar.tsx` - Main component with `SnackbarMessage` interface
- `Snackbar.style.ts` - MUI styled components

**Usage:**
```tsx
<AppSnackbar
  messages={[{ id: '1', title: 'Success', variant: 'success' }]}
  onClose={handleClose}
/>
```

**Variants:**
- `default` → info (blue)
- `destructive` → error (red)
- `success` → success (green)

**Features:**
- Auto-hide after 5 seconds
- Supports title and description
- Bottom-right positioning
- Memoized for performance

---

## LoadingSpinner

Full-page loading indicator with MUI CircularProgress.

**Files:**
- `LoadingSpinner.tsx` - Main component
- `LoadingSpinner.style.ts` - MUI styled components

**Usage:**
```tsx
<LoadingSpinner />
```

---

## AuthGuard

Route protection components for authentication.

**Files:**
- `AuthGuard.tsx` - Exports `ProtectedRoute` and `PublicRoute`
- `AuthGuard.style.ts` - Style placeholder

**Usage:**
```tsx
<ProtectedRoute><Dashboard /></ProtectedRoute>
<PublicRoute><Login /></PublicRoute>
<AdminRoute><TaskManager /></AdminRoute>
```

`AdminRoute` checks `isActualAdmin` and redirects to `/` if not admin.
