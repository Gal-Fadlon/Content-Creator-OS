# Services Implementation

## Overview

Service layer providing data access abstraction with mock/real API toggle for seamless development and production switching.

## Structure

```
services/
├── services.ts              # Central service factory with mock toggle
├── queryKeys.ts             # React Query key factory
├── api/
│   ├── client.ts            # Axios instance with interceptors
│   └── types.ts             # DTOs and API types
├── auth/
│   ├── authService.ts       # Real API implementation
│   └── authService.mock.ts  # Mock implementation
├── clients/
│   ├── clientsService.ts
│   └── clientsService.mock.ts
├── content/
│   ├── contentService.ts
│   └── contentService.mock.ts
├── events/
│   ├── eventsService.ts
│   └── eventsService.mock.ts
└── notifications/
    ├── notificationsService.ts
    └── notificationsService.mock.ts
```

## Mock/Real Toggle

Controlled via environment variable:
```
VITE_USE_MOCK_API=true   # Uses mock services (default)
VITE_USE_MOCK_API=false  # Uses real API
```

Usage:
```ts
import { services } from '@/services/services';
const clients = await services.clients.getAll();
```

## Services Summary

### `AuthService`
- `getCurrentUser()` - Get authenticated user
- `login(credentials)` - Authenticate user
- `logout()` - End session
- `switchRole(role)` - Toggle admin/client role (demo)

### `ClientsService`
- `getAll()` - Fetch all clients
- `getById(id)` - Fetch single client
- `updateTheme(clientId, theme)` - Update monthly theme

### `ContentService`
- `getAll(clientId)` - Fetch client content items
- `getById(id)` - Fetch single content
- `create(data)` / `update(id, data)` / `delete(id)` - CRUD operations

### `EventsService`
- `getAll(clientId)` / `getById(id)` - Fetch events
- `create(data)` / `update(id, data)` / `delete(id)` - Event CRUD
- `getRequests(clientId)` - Fetch event requests
- `createRequest(data)` - Submit event request (client)
- `approveRequest(id)` / `rejectRequest(id)` - Admin actions

### `NotificationsService`
- `getAll()` - Fetch all notifications
- `markRead(id)` / `markAllRead()` - Mark as read
- `create(data)` / `delete(id)` / `clearAll()` - CRUD

## Query Keys

Centralized key factory for React Query cache consistency:
- `queryKeys.auth.user` / `.session`
- `queryKeys.clients.all` / `.detail(id)`
- `queryKeys.content.all(clientId)` / `.detail(id)` / `.byDate()` / `.byMonth()`
- `queryKeys.events.all(clientId)` / `.detail(id)` / `.requests.all()`
- `queryKeys.notifications.all` / `.unreadCount`

## API Client

Axios instance with:
- Base URL from `VITE_API_URL` or `/api`
- Auth token injection via request interceptor
- 401 handling with token refresh placeholder
- 10s timeout
