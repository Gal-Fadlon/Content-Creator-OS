/**
 * React Query hooks for client data
 * Shared across ClientSelector, filters, etc.
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
import { useAuth } from '@/context/providers/AuthProvider';

/**
 * Fetch all clients
 * Only runs when user is authenticated to ensure RLS policies work correctly
 */
export function useClients() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: () => services.clients.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
  });
}
