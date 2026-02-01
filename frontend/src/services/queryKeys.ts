/**
 * React Query Key Factory
 * Centralized query key management for cache consistency
 */

export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },

  // Clients
  clients: {
    all: ['clients'] as const,
    detail: (id: string) => ['clients', id] as const,
  },

  // Content
  content: {
    all: (clientId: string) => ['content', clientId] as const,
    detail: (id: string) => ['content', 'detail', id] as const,
    byMonth: (clientId: string, monthKey: string) => ['content', clientId, 'month', monthKey] as const,
  },

  // Events
  events: {
    all: (clientId: string) => ['events', clientId] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
    byMonth: (clientId: string, monthKey: string) => ['events', clientId, 'month', monthKey] as const,
    requests: {
      all: (clientId: string) => ['events', 'requests', clientId] as const,
      detail: (id: string) => ['events', 'requests', 'detail', id] as const,
    },
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },

  // Comments
  comments: {
    byContent: (contentId: string) => ['comments', contentId] as const,
  },
} as const;
