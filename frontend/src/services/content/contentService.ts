/**
 * Content Service Interface
 * Defines the contract for content CRUD operations
 */

import type { ContentItem } from '@/types/content';
import type { CreateContentDTO, UpdateContentDTO } from '@/services/api/types';
import { apiClient } from '@/services/api/client';

export interface ContentService {
  getAll: (clientId: string) => Promise<ContentItem[]>;
  getById: (id: string) => Promise<ContentItem>;
  create: (data: CreateContentDTO) => Promise<ContentItem>;
  update: (id: string, data: UpdateContentDTO) => Promise<ContentItem>;
  delete: (id: string) => Promise<void>;
}

export const contentService: ContentService = {
  async getAll(clientId: string) {
    const response = await apiClient.get<ContentItem[]>(`/clients/${clientId}/content`);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<ContentItem>(`/content/${id}`);
    return response.data;
  },

  async create(data: CreateContentDTO) {
    const response = await apiClient.post<ContentItem>('/content', data);
    return response.data;
  },

  async update(id: string, data: UpdateContentDTO) {
    const response = await apiClient.patch<ContentItem>(`/content/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/content/${id}`);
  },
};
