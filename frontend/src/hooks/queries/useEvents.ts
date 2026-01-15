/**
 * React Query hooks for events and event requests
 * Shared across calendar, grid, modal components
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
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
 * Fetch a single event by ID
 */
export function useEvent(id: string | null) {
  return useQuery({
    queryKey: queryKeys.events.detail(id ?? ''),
    queryFn: () => services.events.getById(id!),
    enabled: !!id,
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
      queryClient.invalidateQueries({
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(updatedEvent.clientId),
      });
      queryClient.invalidateQueries({
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(clientId),
      });
    },
  });
}

// ============ EVENT REQUESTS ============

/**
 * Fetch all event requests for a client
 */
export function useEventRequests(clientId: string | null) {
  return useQuery({
    queryKey: queryKeys.events.requests.all(clientId ?? ''),
    queryFn: () => services.events.getRequests(clientId!),
    enabled: !!clientId,
    staleTime: 1 * 60 * 1000, // 1 minute (requests change more frequently)
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.requests.all(newRequest.clientId),
      });
      // Also invalidate notifications since a new one was likely created
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.all(newEvent.clientId),
      });
      // Invalidate requests list
      queryClient.invalidateQueries({
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.requests.all(rejectedRequest.clientId),
      });
    },
  });
}
