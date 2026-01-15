/**
 * Notifications Service Mock Implementation
 * Uses local mock data for development/demo purposes
 */

import type { Notification } from '@/types/content';
import type { NotificationsService, CreateNotificationDTO } from './notificationsService';
import { mockNotifications } from '@/data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state
let notifications: Notification[] = [...mockNotifications];

export const notificationsServiceMock: NotificationsService = {
  async getAll() {
    await delay(100);
    return [...notifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async markRead(id: string) {
    await delay(50);
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error(`Notification not found: ${id}`);
    }
    const updated: Notification = { ...notifications[index], read: true };
    notifications = notifications.map(n => n.id === id ? updated : n);
    return updated;
  },

  async markAllRead() {
    await delay(50);
    notifications = notifications.map(n => ({ ...n, read: true }));
  },

  async create(data: CreateNotificationDTO) {
    await delay(100);
    const newNotification: Notification = {
      ...data,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications = [newNotification, ...notifications];
    return newNotification;
  },

  async delete(id: string) {
    await delay(50);
    notifications = notifications.filter(n => n.id !== id);
  },

  async clearAll() {
    await delay(50);
    notifications = [];
  },
};

// Helper to reset state for testing
export function resetNotificationsMock() {
  notifications = [...mockNotifications];
}

// Helper to add notification (for internal use by other mocks)
export function addNotificationMock(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications = [newNotification, ...notifications];
  return newNotification;
}
