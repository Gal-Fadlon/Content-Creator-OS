/**
 * useTaskModal - Form state management for task create/edit modal
 */

import { useState, useCallback, useEffect } from 'react';
import type { AdminTask, AdminTaskStatus, AdminTaskPriority } from '@/types/adminTask';

interface TaskFormState {
  title: string;
  description: string;
  status: AdminTaskStatus;
  priority: AdminTaskPriority;
  dueDate: string;
  colorLabel: string;
}

const INITIAL_STATE: TaskFormState = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  colorLabel: '',
};

export function useTaskModal(editingTask: AdminTask | null, defaultStatus: AdminTaskStatus, open: boolean) {
  const [form, setForm] = useState<TaskFormState>(INITIAL_STATE);

  useEffect(() => {
    if (!open) return;
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate || '',
        colorLabel: editingTask.colorLabel || '',
      });
    } else {
      setForm({ ...INITIAL_STATE, status: defaultStatus });
    }
  }, [editingTask, defaultStatus, open]);

  const updateField = useCallback(<K extends keyof TaskFormState>(
    field: K,
    value: TaskFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setForm(INITIAL_STATE);
  }, []);

  const isValid = form.title.trim().length > 0;

  return { form, updateField, reset, isValid };
}
