/**
 * Admin Task types for Kanban board
 */

export type AdminTaskStatus = 'todo' | 'in_progress' | 'on_hold' | 'done';
export type AdminTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdminTask {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  status: AdminTaskStatus;
  priority: AdminTaskPriority;
  dueDate?: string;
  colorLabel?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
