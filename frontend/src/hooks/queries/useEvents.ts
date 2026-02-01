/**
 * React Query hooks for events and event requests
 * Uses realtime subscriptions for instant updates
 */

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
import { supabase } from '@/services/supabase/supabaseClient';
import type { CreateEventDTO, UpdateEventDTO, CreateEventRequestDTO } from '@/services/api/types';

// ============ EVENTS ============

/**
 * Fetch all events for a client
 */
export function useEvents(clientId: string | null) {
  return useQuery({
    queryKey: queryKeys.events.all(clientId ?? ''),
    queryFn: () => services.events.getAll(clientId!),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Create a new event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDTO) => services.events.create(data),
    onSuccess: (newEvent) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(newEvent.clientId),
      });
    },
  });
}

/**
 * Update an existing event
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDTO }) =>
      services.events.update(id, data),
    onSuccess: (updatedEvent) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(updatedEvent.clientId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(updatedEvent.id),
      });
    },
  });
}

/**
 * Delete an event
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId: string }) =>
      services.events.delete(id).then(() => clientId),
    onSuccess: (clientId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(clientId),
      });
    },
  });
}

// ============ EVENT REQUESTS ============

/**
 * Fetch all event requests for a client with realtime subscription
 */
export function useEventRequests(clientId: string | null) {
  const queryClient = useQueryClient();

  // Set up realtime subscription for instant updates
  useEffect(() => {
    if (!clientId) return;

    const channel = supabase
      .channel(`event-requests-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_requests',
          filter: `client_id=eq.${clientId}`,
        },
        () => {
          // Invalidate and refetch on any change
          void queryClient.invalidateQueries({
            queryKey: queryKeys.events.requests.all(clientId),
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [clientId, queryClient]);

  return useQuery({
    queryKey: queryKeys.events.requests.all(clientId ?? ''),
    queryFn: () => services.events.getRequests(clientId!),
    enabled: !!clientId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Create a new event request (from client)
 */
export function useCreateEventRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequestDTO) => services.events.createRequest(data),
    onSuccess: (newRequest) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.requests.all(newRequest.clientId),
      });
    },
  });
}

/**
 * Approve an event request (admin only)
 */
export function useApproveEventRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => services.events.approveRequest(id),
    onSuccess: (newEvent) => {
      // Invalidate events list (new event was created)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(newEvent.clientId),
      });
      // Invalidate requests list
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.requests.all(newEvent.clientId),
      });
    },
  });
}

/**
 * Reject an event request (admin only)
 */
export function useRejectEventRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => services.events.rejectRequest(id),
    onSuccess: (rejectedRequest) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.events.requests.all(rejectedRequest.clientId),
      });
    },
  });
}
