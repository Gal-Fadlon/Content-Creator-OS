/**
 * Clients Service Mock Implementation
 * Uses local mock data for development/demo purposes
 */

import type { Client } from '@/types/content';
import type { ClientsService } from './clientsService';
import { mockClients } from '@/data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state (mutable copy of mock data)
let clients: Client[] = [...mockClients];

export const clientsServiceMock: ClientsService = {
  async getAll() {
    await delay(150);
    return [...clients];
  },

  async getById(id: string) {
    await delay(100);
    const client = clients.find(c => c.id === id);
    if (!client) {
      throw new Error(`Client not found: ${id}`);
    }
    return { ...client };
  },

  async updateTheme(clientId: string, theme: string) {
    await delay(100);
    const index = clients.findIndex(c => c.id === clientId);
    if (index === -1) {
      throw new Error(`Client not found: ${clientId}`);
    }
    clients[index] = { ...clients[index], monthlyTheme: theme };
    return { ...clients[index] };
  },
};

// Helper to reset state for testing
export function resetClientsMock() {
  clients = [...mockClients];
}
