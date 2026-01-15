/**
 * Content Service Mock Implementation
 * Uses local mock data for development/demo purposes
 */

import type { ContentItem } from '@/types/content';
import type { CreateContentDTO, UpdateContentDTO } from '@/services/api/types';
import type { ContentService } from './contentService';
import { mockContentItems } from '@/data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state (mutable copy of mock data)
let contentItems: ContentItem[] = [...mockContentItems];

export const contentServiceMock: ContentService = {
  async getAll(clientId: string) {
    await delay(150);
    return contentItems.filter(item => item.clientId === clientId);
  },

  async getById(id: string) {
    await delay(100);
    const item = contentItems.find(c => c.id === id);
    if (!item) {
      throw new Error(`Content not found: ${id}`);
    }
    return { ...item };
  },

  async create(data: CreateContentDTO) {
    await delay(200);
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...data,
      id: `content-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    contentItems = [...contentItems, newItem];
    return newItem;
  },

  async update(id: string, data: UpdateContentDTO) {
    await delay(150);
    const index = contentItems.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Content not found: ${id}`);
    }
    const updated: ContentItem = {
      ...contentItems[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    contentItems = contentItems.map(c => c.id === id ? updated : c);
    return updated;
  },

  async delete(id: string) {
    await delay(100);
    const index = contentItems.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Content not found: ${id}`);
    }
    contentItems = contentItems.filter(c => c.id !== id);
  },
};

// Helper to reset state for testing
export function resetContentMock() {
  contentItems = [...mockContentItems];
}

// Helper to get all content (for internal use)
export function getAllContentMock() {
  return [...contentItems];
}
