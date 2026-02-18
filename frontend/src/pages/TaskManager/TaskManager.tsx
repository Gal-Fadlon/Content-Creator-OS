/**
 * TaskManager - Admin-only Kanban task board page
 */

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/providers/AuthProvider';
import { useCreateAdminTask, useUpdateAdminTask, useDeleteAdminTask } from '@/hooks/queries/useAdminTasks';
import { useToast } from '@/context/SnackbarContext';
import type { AdminTask, AdminTaskStatus, AdminTaskPriority } from '@/types/adminTask';
import { TASK_MANAGER } from '@/constants/strings.constants';
import KanbanBoard from '@/components/features/kanban/KanbanBoard/KanbanBoard';
import TaskFilters from '@/components/features/kanban/TaskFilters/TaskFilters';
import TaskModal from '@/components/features/kanban/TaskModal/TaskModal';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useTaskBoard } from './useTaskBoard';
import {
  StyledTaskManagerRoot,
  StyledTaskManagerHeader,
  StyledHeaderTitle,
  StyledFilterSection,
  StyledBoardSection,
  StyledAddTaskButton,
} from './TaskManager.style';

export default function TaskManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const ownerId = user?.id ?? null;

  const {
    tasksByStatus,
    isLoading,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    handleDragEnd,
  } = useTaskBoard(ownerId);

  const createTask = useCreateAdminTask();
  const updateTask = useUpdateAdminTask();
  const deleteTask = useDeleteAdminTask();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<AdminTaskStatus>('todo');

  const handleAddTask = useCallback((status: AdminTaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: AdminTask) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSave = useCallback(
    (data: {
      title: string;
      description: string;
      status: AdminTaskStatus;
      priority: AdminTaskPriority;
      dueDate: string;
      colorLabel: string;
    }) => {
      if (!ownerId) return;

      if (editingTask) {
        updateTask.mutate(
          {
            id: editingTask.id,
            data: {
              title: data.title,
              description: data.description || null,
              status: data.status,
              priority: data.priority,
              dueDate: data.dueDate || null,
              colorLabel: data.colorLabel || null,
            },
            ownerId,
          },
          {
            onSuccess: () => toast({ title: TASK_MANAGER.success.updated, variant: 'success' }),
            onError: () => toast({ title: TASK_MANAGER.error.updateFailed, variant: 'destructive' }),
          }
        );
      } else {
        createTask.mutate(
          {
            ownerId,
            title: data.title,
            description: data.description || undefined,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate || undefined,
            colorLabel: data.colorLabel || undefined,
          },
          {
            onSuccess: () => toast({ title: TASK_MANAGER.success.created, variant: 'success' }),
            onError: () => toast({ title: TASK_MANAGER.error.createFailed, variant: 'destructive' }),
          }
        );
      }
    },
    [ownerId, editingTask, createTask, updateTask, toast]
  );

  const handleDelete = useCallback(
    (taskId: string) => {
      if (!ownerId) return;
      deleteTask.mutate(
        { id: taskId, ownerId },
        {
          onSuccess: () => toast({ title: TASK_MANAGER.success.deleted, variant: 'success' }),
          onError: () => toast({ title: TASK_MANAGER.error.deleteFailed, variant: 'destructive' }),
        }
      );
    },
    [ownerId, deleteTask, toast]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <StyledTaskManagerRoot>
      <StyledTaskManagerHeader>
        <StyledHeaderTitle>{TASK_MANAGER.title}</StyledHeaderTitle>
        <StyledAddTaskButton onClick={() => handleAddTask('todo')}>
          <Plus size={18} />
          {TASK_MANAGER.addTask}
        </StyledAddTaskButton>
      </StyledTaskManagerHeader>

      <StyledFilterSection>
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
        />
      </StyledFilterSection>

      <StyledBoardSection>
        <KanbanBoard
          tasksByStatus={tasksByStatus}
          onDragEnd={handleDragEnd}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDelete}
        />
      </StyledBoardSection>

      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        editingTask={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </StyledTaskManagerRoot>
  );
}
