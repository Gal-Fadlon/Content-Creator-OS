/**
 * Notifications Service Interface
 * Defines the contract for notification operations
 */

import type { Notification } from '@/types/content';
import { apiClient } from '@/services/api/client';

export interface CreateNotificationDTO {
  type: Notification['type'];
  title: string;
  message: string;
  contentId?: string;
  eventRequestId?: string;
  clientId?: string;
}

export interface NotificationsService {
  getAll: () => Promise<Notification[]>;
  markRead: (id: string) => Promise<Notification>;
  markAllRead: () => Promise<void>;
  create: (data: CreateNotificationDTO) => Promise<Notification>;
  delete: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const notificationsService: NotificationsService = {
  async getAll() {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  async markRead(id: string) {
    const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllRead() {
    await apiClient.post('/notifications/mark-all-read');
  },

  async create(data: CreateNotificationDTO) {
    const response = await apiClient.post<Notification>('/notifications', data);
    return response.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/notifications/${id}`);
  },

  async clearAll() {
    await apiClient.delete('/notifications');
  },
};
