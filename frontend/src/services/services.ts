/**
 * Services Factory
 * Central export for all services with mock/real toggle
 * 
 * Usage:
 *   import { services } from '@/services/services';
 *   const clients = await services.clients.getAll();
 * 
 * Toggle mock mode via environment variable:
 *   VITE_USE_MOCK_API=true  -> uses mock services (default)
 *   VITE_USE_MOCK_API=false -> uses real API services
 */

import type { AuthService } from './auth/authService';
import type { ClientsService } from './clients/clientsService';
import type { ContentService } from './content/contentService';
import type { EventsService } from './events/eventsService';
import type { NotificationsService } from './notifications/notificationsService';

import { authService } from './auth/authService';
import { authServiceMock } from './auth/authService.mock';
import { clientsService } from './clients/clientsService';
import { clientsServiceMock } from './clients/clientsService.mock';
import { contentService } from './content/contentService';
import { contentServiceMock } from './content/contentService.mock';
import { eventsService } from './events/eventsService';
import { eventsServiceMock } from './events/eventsService.mock';
import { notificationsService } from './notifications/notificationsService';
import { notificationsServiceMock } from './notifications/notificationsService.mock';

export interface Services {
  auth: AuthService;
  clients: ClientsService;
  content: ContentService;
  events: EventsService;
  notifications: NotificationsService;
}

// Default to mock mode unless explicitly set to 'false'
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const services: Services = {
  auth: USE_MOCK ? authServiceMock : authService,
  clients: USE_MOCK ? clientsServiceMock : clientsService,
  content: USE_MOCK ? contentServiceMock : contentService,
  events: USE_MOCK ? eventsServiceMock : eventsService,
  notifications: USE_MOCK ? notificationsServiceMock : notificationsService,
};

// Export individual services for direct import if needed
export { authServiceMock } from './auth/authService.mock';
export { clientsServiceMock } from './clients/clientsService.mock';
export { contentServiceMock } from './content/contentService.mock';
export { eventsServiceMock } from './events/eventsService.mock';
export { notificationsServiceMock } from './notifications/notificationsService.mock';
