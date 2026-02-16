/**
 * Admin Tasks Service
 * CRUD operations for personal admin task management (Kanban board)
 */

import type { AdminTask } from '@/types/adminTask';
import type { CreateAdminTaskDTO, UpdateAdminTaskDTO } from '@/services/api/types';
import { supabase } from '@/services/supabase/supabaseClient';
import type { AdminTaskRow } from '@/services/supabase/supabaseTypes';
import { withTimeout } from '@/helpers/timeout.helper';

const QUERY_TIMEOUT = 15000;

export interface AdminTasksService {
  getAll: (ownerId: string) => Promise<AdminTask[]>;
  getById: (id: string) => Promise<AdminTask>;
  create: (data: CreateAdminTaskDTO) => Promise<AdminTask>;
  update: (id: string, data: UpdateAdminTaskDTO) => Promise<AdminTask>;
  delete: (id: string) => Promise<void>;
}

const toAdminTask = (row: AdminTaskRow): AdminTask => ({
  id: row.id,
  ownerId: row.owner_id,
  title: row.title,
  description: row.description || undefined,
  status: row.status,
  priority: row.priority,
  dueDate: row.due_date || undefined,
  colorLabel: row.color_label || undefined,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const adminTasksService: AdminTasksService = {
  async getAll(ownerId: string) {
    const queryPromise = supabase
      .from('admin_tasks')
      .select('*')
      .eq('owner_id', ownerId)
      .order('sort_order', { ascending: true });

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading tasks timed out. Please try again.'
    );

    if (error) throw error;

    return ((data || []) as AdminTaskRow[]).map(toAdminTask);
  },

  async getById(id: string) {
    const queryPromise = supabase
      .from('admin_tasks')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading task timed out.'
    );

    if (error) throw error;

    return toAdminTask(data as AdminTaskRow);
  },

  async create(data: CreateAdminTaskDTO) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: created, error } = await (supabase.from('admin_tasks') as any)
      .insert({
        owner_id: data.ownerId,
        title: data.title,
        description: data.description || null,
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        due_date: data.dueDate || null,
        color_label: data.colorLabel || null,
        sort_order: data.sortOrder ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return toAdminTask(created as AdminTaskRow);
  },

  async update(id: string, data: UpdateAdminTaskDTO) {
    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.status !== undefined) update.status = data.status;
    if (data.priority !== undefined) update.priority = data.priority;
    if (data.dueDate !== undefined) update.due_date = data.dueDate;
    if (data.colorLabel !== undefined) update.color_label = data.colorLabel;
    if (data.sortOrder !== undefined) update.sort_order = data.sortOrder;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabase.from('admin_tasks') as any)
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return toAdminTask(updated as AdminTaskRow);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('admin_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
