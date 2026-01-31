/**
 * Notifications Service Interface
 * Defines the contract for notification operations
 * Now uses Supabase
 */

import type { Notification } from '@/types/content';
import { supabase } from '@/services/supabase/supabaseClient';
import type { NotificationRow } from '@/services/supabase/supabaseTypes';

export interface NotificationsService {
  getAll: () => Promise<Notification[]>;
  markRead: (id: string) => Promise<Notification>;
  markAllRead: () => Promise<void>;
  delete: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

// Extended row type with joined content data
interface NotificationWithContent extends NotificationRow {
  content?: {
    scheduled_date: string | null;
    media_url: string | null;
  } | null;
}

// Transform database row to frontend type
const toNotification = (row: NotificationWithContent): Notification => ({
  id: row.id,
  type: row.type,
  title: row.title,
  message: row.message || '',
  contentId: row.content_id || undefined,
  eventRequestId: row.event_request_id || undefined,
  clientId: row.client_id || undefined,
  read: row.is_read,
  createdAt: row.created_at,
  contentDate: row.content?.scheduled_date || undefined,
  contentMediaUrl: row.content?.media_url || undefined,
});

export const notificationsService: NotificationsService = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        content:content_id (
          scheduled_date,
          media_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => toNotification(row as NotificationWithContent));
  },

  async markRead(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return toNotification(data as NotificationRow);
  },

  async markAllRead() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async clearAll() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  },
};
