/**
 * Events Service Mock Implementation
 * Uses local mock data for development/demo purposes
 */

import type { EventItem, EventRequest } from '@/types/content';
import type { CreateEventDTO, UpdateEventDTO, CreateEventRequestDTO } from '@/services/api/types';
import type { EventsService } from './eventsService';
import { mockEvents } from '@/data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state
let events: EventItem[] = [...mockEvents];
let eventRequests: EventRequest[] = [];

export const eventsServiceMock: EventsService = {
  // Events
  async getAll(clientId: string) {
    await delay(150);
    return events.filter(e => e.clientId === clientId);
  },

  async getById(id: string) {
    await delay(100);
    const event = events.find(e => e.id === id);
    if (!event) {
      throw new Error(`Event not found: ${id}`);
    }
    return { ...event };
  },

  async create(data: CreateEventDTO) {
    await delay(200);
    const now = new Date().toISOString();
    const newEvent: EventItem = {
      ...data,
      id: `event-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    events = [...events, newEvent];
    return newEvent;
  },

  async update(id: string, data: UpdateEventDTO) {
    await delay(150);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error(`Event not found: ${id}`);
    }
    const updated: EventItem = {
      ...events[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    events = events.map(e => e.id === id ? updated : e);
    return updated;
  },

  async delete(id: string) {
    await delay(100);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error(`Event not found: ${id}`);
    }
    events = events.filter(e => e.id !== id);
  },

  // Event Requests
  async getRequests(clientId: string) {
    await delay(150);
    return eventRequests.filter(r => r.clientId === clientId);
  },

  async createRequest(data: CreateEventRequestDTO) {
    await delay(200);
    const newRequest: EventRequest = {
      ...data,
      id: `request-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    eventRequests = [...eventRequests, newRequest];
    return newRequest;
  },

  async approveRequest(id: string) {
    await delay(200);
    const request = eventRequests.find(r => r.id === id);
    if (!request) {
      throw new Error(`Event request not found: ${id}`);
    }

    // Update request status
    eventRequests = eventRequests.map(r => 
      r.id === id ? { ...r, status: 'approved' as const } : r
    );

    // Create the event
    const now = new Date().toISOString();
    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      clientId: request.clientId,
      title: request.title,
      description: request.description,
      date: request.date,
      color: 'blue',
      createdAt: now,
      updatedAt: now,
    };
    events = [...events, newEvent];

    return newEvent;
  },

  async rejectRequest(id: string) {
    await delay(150);
    const index = eventRequests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Event request not found: ${id}`);
    }
    const updated: EventRequest = {
      ...eventRequests[index],
      status: 'rejected',
    };
    eventRequests = eventRequests.map(r => r.id === id ? updated : r);
    return updated;
  },
};

// Helper to reset state for testing
export function resetEventsMock() {
  events = [...mockEvents];
  eventRequests = [];
}

// Helper to get all events (for internal use)
export function getAllEventsMock() {
  return [...events];
}

// Helper to get all requests (for internal use)
export function getAllEventRequestsMock() {
  return [...eventRequests];
}
