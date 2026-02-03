/**
 * Comments Service
 * CRUD operations for content comments
 */

import type { ContentComment, UserRole } from '@/types/content';
import { supabase } from '@/services/supabase/supabaseClient';
import type { ContentCommentRow, ProfileRow } from '@/services/supabase/supabaseTypes';
import { withTimeout } from '@/helpers/timeout.helper';

const QUERY_TIMEOUT = 15000; // 15 seconds for database queries

export interface CreateCommentDTO {
  contentId: string;
  message: string;
}

export interface CommentsService {
  getByContentId: (contentId: string) => Promise<ContentComment[]>;
  create: (data: CreateCommentDTO) => Promise<ContentComment>;
  delete: (id: string) => Promise<void>;
}

// Transform database row to frontend type
const toContentComment = (row: ContentCommentRow): ContentComment => ({
  id: row.id,
  contentId: row.content_id,
  userId: row.user_id,
  userName: row.author_name || 'משתמש',
  userRole: (row.author_role as UserRole) || 'client',
  message: row.message,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const commentsService: CommentsService = {
  async getByContentId(contentId: string) {
    const queryPromise = supabase
      .from('content_comments')
      .select('*')
      .eq('content_id', contentId)
      .order('created_at', { ascending: true });

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading comments timed out. Please try again.'
    ) as { data: ContentCommentRow[] | null; error: Error | null };

    if (error) throw error;

    return (data || []).map((row) => toContentComment(row as ContentCommentRow));
  },

  async create(data: CreateCommentDTO) {
    // Get current user and their profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's profile to capture name and role
    const profilePromise = supabase
      .from('profiles')
      .select('full_name, email, role')
      .eq('id', user.id)
      .single();

    const { data: profile } = await withTimeout(
      profilePromise,
      QUERY_TIMEOUT,
      'Loading profile timed out.'
    ) as { data: ProfileRow | null; error: Error | null };
    const authorName = profile?.full_name || profile?.email || 'משתמש';
    const authorRole = profile?.role || 'client';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertPromise = (supabase.from('content_comments') as any).insert({
      content_id: data.contentId,
      user_id: user.id,
      message: data.message,
      author_name: authorName,
      author_role: authorRole,
    }).select('*').single();

    const { data: created, error } = await withTimeout(
      insertPromise,
      QUERY_TIMEOUT,
      'Creating comment timed out. Please try again.'
    ) as { data: ContentCommentRow | null; error: Error | null };

    if (error) throw error;

    return toContentComment(created as ContentCommentRow);
  },

  async delete(id: string) {
    // Note: To enable automatic notification deletion when comments are deleted,
    // run the migration: supabase/migrations/007_comment_notification_link.sql
    // This adds a comment_id column to notifications with ON DELETE CASCADE

    // Delete the comment itself (notifications will cascade if migration was run)
    const deleteCommentPromise = supabase
      .from('content_comments')
      .delete()
      .eq('id', id);

    const { error } = await withTimeout(
      deleteCommentPromise,
      QUERY_TIMEOUT,
      'Deleting comment timed out. Please try again.'
    ) as { data: null; error: Error | null };

    if (error) throw error;
  },
};
