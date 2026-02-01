/**
 * React Query hooks for content data
 * Shared across calendar, grid, modal components
 */

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
import type { ContentItem } from '@/types/content';
import type { CreateContentDTO, UpdateContentDTO } from '@/services/api/types';

// localStorage helpers for skeleton count
const GRID_COUNT_KEY_PREFIX = 'grid-count-';

export const getStoredGridCount = (clientId: string): number => {
  try {
    const stored = localStorage.getItem(`${GRID_COUNT_KEY_PREFIX}${clientId}`);
    return stored ? parseInt(stored, 10) : 6; // Default to 6 skeletons
  } catch {
    return 6;
  }
};

const setStoredGridCount = (clientId: string, count: number): void => {
  try {
    localStorage.setItem(`${GRID_COUNT_KEY_PREFIX}${clientId}`, String(count));
  } catch {
    // Ignore localStorage errors
  }
};

/**
 * Fetch all content items for a client
 */
export function useContentItems(clientId: string | null) {
  const query = useQuery({
    queryKey: queryKeys.content.all(clientId ?? ''),
    queryFn: () => services.content.getAll(clientId!),
    enabled: !!clientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData, // Keep showing old data during refetch
  });

  // Save count to localStorage when data loads (for skeleton count on hard refresh)
  useEffect(() => {
    if (clientId && query.data) {
      const approvedCount = query.data.filter(item => item.status === 'approved').length;
      setStoredGridCount(clientId, approvedCount);
    }
  }, [clientId, query.data]);

  return query;
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
      void queryClient.invalidateQueries({
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
    mutationFn: ({ id, data }: { id: string; data: UpdateContentDTO; clientId?: string }) =>
      services.content.update(id, data),
    // Optimistic update for both detail and list caches
    onMutate: async ({ id, data, clientId }) => {
      // Cancel any in-flight queries
      await queryClient.cancelQueries({ queryKey: queryKeys.content.detail(id) });
      if (clientId) {
        await queryClient.cancelQueries({ queryKey: queryKeys.content.all(clientId) });
      }

      // Snapshot previous values
      const previousItem = queryClient.getQueryData<ContentItem>(
        queryKeys.content.detail(id)
      );
      const previousList = clientId
        ? queryClient.getQueryData<ContentItem[]>(queryKeys.content.all(clientId))
        : undefined;

      // Optimistically update detail cache
      if (previousItem) {
        queryClient.setQueryData(queryKeys.content.detail(id), {
          ...previousItem,
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }

      // Optimistically update list cache (used by grid)
      if (previousList) {
        queryClient.setQueryData(
          queryKeys.content.all(clientId!),
          previousList.map(item =>
            item.id === id
              ? { ...item, ...data, updatedAt: new Date().toISOString() }
              : item
          )
        );
      }

      return { previousItem, previousList, clientId };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousItem) {
        queryClient.setQueryData(queryKeys.content.detail(id), context.previousItem);
      }
      if (context?.previousList && context.clientId) {
        queryClient.setQueryData(queryKeys.content.all(context.clientId), context.previousList);
      }
    },
    onSettled: (updatedItem) => {
      if (updatedItem) {
        // Invalidate to refetch fresh data
        void queryClient.invalidateQueries({
          queryKey: queryKeys.content.all(updatedItem.clientId),
        });
        void queryClient.invalidateQueries({
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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.content.all(clientId),
      });
    },
  });
}

