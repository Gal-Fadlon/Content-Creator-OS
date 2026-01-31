/**
 * Services Factory
 * Central export for all services using Supabase
 * 
 * Usage:
 *   import { services } from '@/services/services';
 *   const clients = await services.clients.getAll();
 */

import type { AuthService } from './auth/authService';
import type { ClientsService } from './clients/clientsService';
import type { ContentService } from './content/contentService';
import type { EventsService } from './events/eventsService';
import type { NotificationsService } from './notifications/notificationsService';
import type { CommentsService } from './comments/commentsService';

import { authService } from './auth/authService';
import { clientsService } from './clients/clientsService';
import { contentService } from './content/contentService';
import { eventsService } from './events/eventsService';
import { notificationsService } from './notifications/notificationsService';
import { commentsService } from './comments/commentsService';

export interface Services {
  auth: AuthService;
  clients: ClientsService;
  content: ContentService;
  events: EventsService;
  notifications: NotificationsService;
  comments: CommentsService;
}

export const services: Services = {
  auth: authService,
  clients: clientsService,
  content: contentService,
  events: eventsService,
  notifications: notificationsService,
  comments: commentsService,
};
