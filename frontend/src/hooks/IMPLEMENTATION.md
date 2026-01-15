# Hooks Implementation

## Overview

Custom React Query hooks for data fetching and mutations, providing a clean abstraction layer over the services.

## Structure

```
hooks/
└── queries/
    ├── useClients.ts      # Client data hooks
    ├── useContent.ts      # Content CRUD hooks
    ├── useEvents.ts       # Events & event requests hooks
    └── useNotifications.ts # Notification hooks
```

## Hooks Summary

### `useClients.ts`
- `useClients()` - Fetch all clients (5min stale time)
- `useClient(id)` - Fetch single client by ID
- `useUpdateClientTheme()` - Update client's monthly theme

### `useContent.ts`
- `useContentItems(clientId)` - Fetch all content for a client
- `useContentItem(id)` - Fetch single content item
- `useCreateContent()` - Create new content
- `useUpdateContent()` - Update content (with optimistic updates)
- `useDeleteContent()` - Delete content
- `useBatchUpdateContent()` - Batch update for reordering

### `useEvents.ts`
- `useEvents(clientId)` - Fetch all events for a client
- `useEvent(id)` - Fetch single event
- `useCreateEvent()` / `useUpdateEvent()` / `useDeleteEvent()` - Event CRUD
- `useEventRequests(clientId)` - Fetch event requests
- `useCreateEventRequest()` - Create event request (client role)
- `useApproveEventRequest()` / `useRejectEventRequest()` - Admin actions

### `useNotifications.ts`
- `useNotifications()` - Fetch all notifications (30s stale, 1min polling)
- `useUnreadCount()` - Derived unread count
- `useMarkNotificationRead()` / `useMarkAllNotificationsRead()` - Mark as read (optimistic)
- `useDeleteNotification()` / `useClearAllNotifications()` - Delete operations

## Patterns Used

- **Optimistic Updates**: Content updates and notification reads update UI immediately
- **Cache Invalidation**: Mutations invalidate related queries for fresh data
- **Conditional Fetching**: Queries use `enabled` flag to prevent fetching with null IDs
- **Stale Time**: Configured per-hook based on data volatility
