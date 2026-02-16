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
import type { ContentService, ContentMediaService } from './content/contentService';
import type { EventsService } from './events/eventsService';
import type { NotificationsService } from './notifications/notificationsService';
import type { CommentsService } from './comments/commentsService';
import type { AdminTasksService } from './adminTasks/adminTasksService';

import { authService } from './auth/authService';
import { clientsService } from './clients/clientsService';
import { contentService, contentMediaService } from './content/contentService';
import { eventsService } from './events/eventsService';
import { notificationsService } from './notifications/notificationsService';
import { commentsService } from './comments/commentsService';
import { adminTasksService } from './adminTasks/adminTasksService';

export interface Services {
  auth: AuthService;
  clients: ClientsService;
  content: ContentService;
  contentMedia: ContentMediaService;
  events: EventsService;
  notifications: NotificationsService;
  comments: CommentsService;
  adminTasks: AdminTasksService;
}

export const services: Services = {
  auth: authService,
  clients: clientsService,
  content: contentService,
  contentMedia: contentMediaService,
  events: eventsService,
  notifications: notificationsService,
  comments: commentsService,
  adminTasks: adminTasksService,
};
