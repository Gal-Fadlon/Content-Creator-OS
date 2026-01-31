/**
 * Events Service Interface
 * Defines the contract for event operations
 * Now uses Supabase
 */

import type { EventItem, EventRequest } from '@/types/content';
import type { CreateEventDTO, UpdateEventDTO, CreateEventRequestDTO } from '@/services/api/types';
import { supabase } from '@/services/supabase/supabaseClient';
import type { EventRow, EventRequestRow } from '@/services/supabase/supabaseTypes';
import { withTimeout } from '@/helpers/timeout';

const QUERY_TIMEOUT = 15000; // 15 seconds for database queries

export interface EventsService {
  getAll: (clientId: string) => Promise<EventItem[]>;
  getById: (id: string) => Promise<EventItem>;
  create: (data: CreateEventDTO) => Promise<EventItem>;
  update: (id: string, data: UpdateEventDTO) => Promise<EventItem>;
  delete: (id: string) => Promise<void>;
  getRequests: (clientId: string) => Promise<EventRequest[]>;
  createRequest: (data: CreateEventRequestDTO) => Promise<EventRequest>;
  approveRequest: (id: string) => Promise<EventItem>; // Returns created event
  rejectRequest: (id: string) => Promise<EventRequest>;
}

// Transform database row to frontend type
const toEventItem = (row: EventRow): EventItem => ({
  id: row.id,
  clientId: row.client_id,
  title: row.title,
  description: row.description || undefined,
  date: row.event_date,
  color: row.color,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toEventRequest = (row: EventRequestRow): EventRequest => ({
  id: row.id,
  clientId: row.client_id,
  title: row.title,
  description: row.description || undefined,
  date: row.requested_date,
  status: row.status,
  createdAt: row.created_at,
});

export const eventsService: EventsService = {
  async getAll(clientId: string) {
    const queryPromise = supabase
      .from('events')
      .select('*')
      .eq('client_id', clientId)
      .order('event_date', { ascending: true });

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading events timed out. Please try again.'
    );

    if (error) throw error;

    return (data || []).map(toEventItem);
  },

  async getById(id: string) {
    const queryPromise = supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading event timed out.'
    );

    if (error) throw error;

    return toEventItem(data);
  },

  async create(data: CreateEventDTO) {
    const insertPromise = supabase
      .from('events')
      .insert({
        client_id: data.clientId,
        title: data.title,
        description: data.description || null,
        event_date: data.date,
        color: data.color || 'red',
      })
      .select()
      .single();

    const { data: created, error } = await withTimeout(
      insertPromise,
      QUERY_TIMEOUT,
      'Creating event timed out. Please try again.'
    );

    if (error) throw error;

    return toEventItem(created);
  },

  async update(id: string, data: UpdateEventDTO) {
    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.date !== undefined) update.event_date = data.date;
    if (data.color !== undefined) update.color = data.color;

    const { data: updated, error } = await supabase
      .from('events')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return toEventItem(updated);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getRequests(clientId: string) {
    const { data, error } = await supabase
      .from('event_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(toEventRequest);
  },

  async createRequest(data: CreateEventRequestDTO) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const { data: created, error } = await supabase
      .from('event_requests')
      .insert({
        client_id: data.clientId,
        requested_by: user.id,
        title: data.title,
        description: data.description || null,
        requested_date: data.date,
      })
      .select()
      .single();

    if (error) throw error;

    return toEventRequest(created);
  },

  async approveRequest(id: string) {
    const { data: { user } } = await supabase.auth.getUser();

    // First get the request details
    const { data: request, error: fetchError } = await supabase
      .from('event_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Update the request status
    const { error: updateError } = await supabase
      .from('event_requests')
      .update({
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Create the event from the approved request
    const { data: newEvent, error: createError } = await supabase
      .from('events')
      .insert({
        client_id: request.client_id,
        title: request.title,
        description: request.description,
        event_date: request.requested_date,
        color: 'blue',
        created_by: user?.id,
      })
      .select()
      .single();

    if (createError) throw createError;

    return toEventItem(newEvent);
  },

  async rejectRequest(id: string) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: updated, error } = await supabase
      .from('event_requests')
      .update({
        status: 'rejected',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return toEventRequest(updated);
  },
};
