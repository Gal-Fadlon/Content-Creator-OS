/**
 * React Query hooks for client data
 * Shared across ClientSelector, filters, etc.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';

/**
 * Fetch all clients
 */
export function useClients() {
  return useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: () => services.clients.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single client by ID
 */
export function useClient(id: string | null) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id ?? ''),
    queryFn: () => services.clients.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Update client's monthly theme
 */
export function useUpdateClientTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, theme }: { clientId: string; theme: string }) =>
      services.clients.updateTheme(clientId, theme),
    onSuccess: (updatedClient) => {
      // Update the client detail cache
      queryClient.setQueryData(
        queryKeys.clients.detail(updatedClient.id),
        updatedClient
      );
      // Invalidate the clients list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}
