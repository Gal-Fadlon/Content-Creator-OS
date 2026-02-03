# Hooks Implementation

## Structure

```
hooks/
├── useImageCover.ts    # Image aspect ratio tracking for cover-style display
└── queries/
    ├── useClients.ts       # Client data hooks
    ├── useContent.ts       # Content CRUD hooks
    ├── useEvents.ts        # Events & event requests hooks
    ├── useNotifications.ts # Notification hooks with Realtime
    └── useComments.ts      # Content comments hooks
```

## Hooks Summary

### `useClients.ts`
- `useClients()` - Fetch all clients
- `useClient(id)` - Fetch single client
- `useUpdateClientTheme()` - Update monthly theme

### `useContent.ts`
- `useContentItems(clientId)` - Fetch client content
- `useCreateContent()` / `useUpdateContent()` / `useDeleteContent()`
- `useBatchUpdateContent()` - Batch update for reordering

### `useEvents.ts`
- `useEvents(clientId)` - Fetch events
- `useEventRequests(clientId)` - Fetch requests with Realtime
- `useApproveEventRequest()` / `useRejectEventRequest()`

### `useNotifications.ts`
- `useNotifications()` - Fetch with Supabase Realtime subscription
- `useUnreadCount()` - Derived unread count
- `useMarkAllNotificationsRead()` - Optimistic updates

### `useComments.ts`
- `useContentComments(contentId)` - Fetch comments for content
- `useCreateComment()` / `useDeleteComment()` - Mutations with cache invalidation

## Patterns

- **Supabase Realtime**: Notifications and event requests use Realtime for instant updates
- **Optimistic Updates**: Content updates and notification reads update UI immediately
- **Cache Invalidation**: Mutations invalidate related queries
