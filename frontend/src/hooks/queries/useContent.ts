/**
 * React Query hooks for content data
 * Shared across calendar, grid, modal components
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
import type { ContentItem } from '@/types/content';
import type { CreateContentDTO, UpdateContentDTO } from '@/services/api/types';

/**
 * Fetch all content items for a client
 */
export function useContentItems(clientId: string | null) {
  return useQuery({
    queryKey: queryKeys.content.all(clientId ?? ''),
    queryFn: () => services.content.getAll(clientId!),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch a single content item by ID
 */
export function useContentItem(id: string | null) {
  return useQuery({
    queryKey: queryKeys.content.detail(id ?? ''),
    queryFn: () => services.content.getById(id!),
    enabled: !!id,
  });
}

/**
 * Create a new content item
 */
export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContentDTO) => services.content.create(data),
    onSuccess: (newItem) => {
      // Invalidate the content list for this client
      queryClient.invalidateQueries({
        queryKey: queryKeys.content.all(newItem.clientId),
      });
    },
  });
}

/**
 * Update an existing content item
 */
export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContentDTO }) =>
      services.content.update(id, data),
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.content.detail(id) });

      const previousItem = queryClient.getQueryData<ContentItem>(
        queryKeys.content.detail(id)
      );

      if (previousItem) {
        queryClient.setQueryData(queryKeys.content.detail(id), {
          ...previousItem,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousItem };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousItem) {
        queryClient.setQueryData(queryKeys.content.detail(id), context.previousItem);
      }
    },
    onSettled: (updatedItem) => {
      if (updatedItem) {
        // Invalidate to refetch fresh data
        queryClient.invalidateQueries({
          queryKey: queryKeys.content.all(updatedItem.clientId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.content.detail(updatedItem.id),
        });
      }
    },
  });
}

/**
 * Delete a content item
 */
export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId: string }) =>
      services.content.delete(id).then(() => clientId),
    onSuccess: (clientId) => {
      // Invalidate the content list
      queryClient.invalidateQueries({
        queryKey: queryKeys.content.all(clientId),
      });
    },
  });
}

/**
 * Batch update content items (for reordering)
 */
export function useBatchUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; data: UpdateContentDTO }>) => {
      // Run updates in parallel
      const results = await Promise.all(
        updates.map(({ id, data }) => services.content.update(id, data))
      );
      return results;
    },
    onSuccess: (results) => {
      if (results.length > 0) {
        // Invalidate content list for the client
        queryClient.invalidateQueries({
          queryKey: queryKeys.content.all(results[0].clientId),
        });
      }
    },
  });
}
