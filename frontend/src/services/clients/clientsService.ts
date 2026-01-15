/**
 * Clients Service Interface
 * Defines the contract for client operations
 */

import type { Client } from '@/types/content';
import type { UpdateClientThemeDTO } from '@/services/api/types';
import { apiClient } from '@/services/api/client';

export interface ClientsService {
  getAll: () => Promise<Client[]>;
  getById: (id: string) => Promise<Client>;
  updateTheme: (clientId: string, theme: string) => Promise<Client>;
}

export const clientsService: ClientsService = {
  async getAll() {
    const response = await apiClient.get<Client[]>('/clients');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  },

  async updateTheme(clientId: string, theme: string) {
    const response = await apiClient.patch<Client>(`/clients/${clientId}`, {
      monthlyTheme: theme,
    } as UpdateClientThemeDTO);
    return response.data;
  },
};
