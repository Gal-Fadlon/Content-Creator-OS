/**
 * React Query hooks for content comments
 * Used by CommentsSection component in ContentModal
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';
import type { CreateCommentDTO } from '@/services/comments/commentsService';

/**
 * Fetch all comments for a content item
 */
export function useContentComments(contentId: string | null) {
  return useQuery({
    queryKey: queryKeys.comments.byContent(contentId ?? ''),
    queryFn: () => services.comments.getByContentId(contentId!),
    enabled: !!contentId && !contentId.startsWith('pending-'), // Don't fetch for pending uploads
    staleTime: 30 * 1000, // 30 seconds - comments should be relatively fresh
    retry: 1, // Only retry once to avoid long loading states
    retryDelay: 1000, // 1-second delay before retry
  });
}

/**
 * Create a new comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDTO) => services.comments.create(data),
    onSuccess: (newComment) => {
      // Invalidate the comments list for this content
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byContent(newComment.contentId),
      });
      // Also invalidate notifications (new comment triggers notification)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    },
  });
}

/**
 * Delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contentId }: { id: string; contentId: string }) =>
      services.comments.delete(id).then(() => contentId),
    onSuccess: (contentId) => {
      // Invalidate the comments list
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byContent(contentId),
      });
    },
  });
}
