/**
 * React Query hooks for admin tasks (Kanban board)
 * Includes optimistic updates for smooth drag-and-drop
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
import type { AdminTask } from '@/types/adminTask';
import type { CreateAdminTaskDTO, UpdateAdminTaskDTO } from '@/services/api/types';

/**
 * Fetch all tasks for an admin
 */
export function useAdminTasks(ownerId: string | null) {
  return useQuery({
    queryKey: queryKeys.adminTasks.all(ownerId ?? ''),
    queryFn: () => services.adminTasks.getAll(ownerId!),
    enabled: !!ownerId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Create a new admin task
 */
export function useCreateAdminTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminTaskDTO) => services.adminTasks.create(data),
    onSuccess: (newTask) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.adminTasks.all(newTask.ownerId),
      });
    },
  });
}

/**
 * Update an admin task with optimistic updates (critical for drag-and-drop)
 */
export function useUpdateAdminTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminTaskDTO; ownerId: string }) =>
      services.adminTasks.update(id, data),
    onMutate: async ({ id, data, ownerId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.adminTasks.all(ownerId),
      });

      const previousTasks = queryClient.getQueryData<AdminTask[]>(
        queryKeys.adminTasks.all(ownerId)
      );

      if (previousTasks) {
        queryClient.setQueryData<AdminTask[]>(
          queryKeys.adminTasks.all(ownerId),
          previousTasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
          )
        );
      }

      return { previousTasks };
    },
    onError: (_err, { ownerId }, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          queryKeys.adminTasks.all(ownerId),
          context.previousTasks
        );
      }
    },
    onSettled: (_data, _err, { ownerId }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.adminTasks.all(ownerId),
      });
    },
  });
}

/**
 * Delete an admin task
 */
export function useDeleteAdminTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ownerId }: { id: string; ownerId: string }) =>
      services.adminTasks.delete(id).then(() => ownerId),
    onSuccess: (ownerId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.adminTasks.all(ownerId),
      });
    },
  });
}
