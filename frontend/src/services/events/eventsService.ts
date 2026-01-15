/**
 * Events Service Interface
 * Defines the contract for event and event request operations
 */

import type { EventItem, EventRequest } from '@/types/content';
import type { CreateEventDTO, UpdateEventDTO, CreateEventRequestDTO } from '@/services/api/types';
import { apiClient } from '@/services/api/client';

export interface EventsService {
  // Events
  getAll: (clientId: string) => Promise<EventItem[]>;
  getById: (id: string) => Promise<EventItem>;
  create: (data: CreateEventDTO) => Promise<EventItem>;
  update: (id: string, data: UpdateEventDTO) => Promise<EventItem>;
  delete: (id: string) => Promise<void>;

  // Event Requests
  getRequests: (clientId: string) => Promise<EventRequest[]>;
  createRequest: (data: CreateEventRequestDTO) => Promise<EventRequest>;
  approveRequest: (id: string) => Promise<EventItem>;
  rejectRequest: (id: string) => Promise<EventRequest>;
}

export const eventsService: EventsService = {
  // Events
  async getAll(clientId: string) {
    const response = await apiClient.get<EventItem[]>(`/clients/${clientId}/events`);
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<EventItem>(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventDTO) {
    const response = await apiClient.post<EventItem>('/events', data);
    return response.data;
  },

  async update(id: string, data: UpdateEventDTO) {
    const response = await apiClient.patch<EventItem>(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/events/${id}`);
  },

  // Event Requests
  async getRequests(clientId: string) {
    const response = await apiClient.get<EventRequest[]>(`/clients/${clientId}/event-requests`);
    return response.data;
  },

  async createRequest(data: CreateEventRequestDTO) {
    const response = await apiClient.post<EventRequest>('/event-requests', data);
    return response.data;
  },

  async approveRequest(id: string) {
    const response = await apiClient.post<EventItem>(`/event-requests/${id}/approve`);
    return response.data;
  },

  async rejectRequest(id: string) {
    const response = await apiClient.post<EventRequest>(`/event-requests/${id}/reject`);
    return response.data;
  },
};
