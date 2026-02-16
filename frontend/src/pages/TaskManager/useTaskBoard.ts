/**
 * useTaskBoard - Kanban board logic hook
 * Handles drag-end, filtering, and grouping tasks by column
 */

import { useState, useMemo, useCallback } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import type { AdminTask, AdminTaskStatus, AdminTaskPriority } from '@/types/adminTask';
import { useAdminTasks, useUpdateAdminTask } from '@/hooks/queries/useAdminTasks';

const EMPTY_COLUMNS: Record<AdminTaskStatus, AdminTask[]> = {
  todo: [],
  in_progress: [],
  on_hold: [],
  done: [],
};

export function useTaskBoard(ownerId: string | null) {
  const { data: tasks = [], isLoading } = useAdminTasks(ownerId);
  const updateTask = useUpdateAdminTask();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<AdminTaskPriority | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description || '').toLowerCase().includes(query)
      );
    }

    if (priorityFilter) {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    return result;
  }, [tasks, search, priorityFilter]);

  // Group by status, sorted by sortOrder
  const tasksByStatus = useMemo(() => {
    const groups = { ...EMPTY_COLUMNS };
    for (const task of filteredTasks) {
      groups[task.status] = [...groups[task.status], task];
    }
    // Sort each column by sortOrder
    for (const key of Object.keys(groups) as AdminTaskStatus[]) {
      groups[key].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return groups;
  }, [filteredTasks]);

  // Calculate a sort order between two neighbors, with a minimum gap of 1
  const getSortOrderBetween = (before: number | undefined, after: number | undefined): number => {
    const STEP = 1000;
    if (before === undefined && after === undefined) return 0;
    if (before === undefined) return (after ?? 0) - STEP;
    if (after === undefined) return before + STEP;
    // If there's room between them, pick the midpoint
    if (after - before >= 2) return Math.floor((before + after) / 2);
    // Gap too small — place just after `before`; eventual re-numbering will fix collisions
    return before + 1;
  };

  // Drag-and-drop handler
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination || !ownerId) return;

      // Same position — no-op
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const newStatus = destination.droppableId as AdminTaskStatus;

      if (source.droppableId !== destination.droppableId) {
        // Moving between columns
        const destTasks = tasksByStatus[newStatus];
        const beforeTask = destination.index > 0 ? destTasks[destination.index - 1] : undefined;
        const afterTask = destination.index < destTasks.length ? destTasks[destination.index] : undefined;

        updateTask.mutate({
          id: draggableId,
          data: {
            status: newStatus,
            sortOrder: getSortOrderBetween(beforeTask?.sortOrder, afterTask?.sortOrder),
          },
          ownerId,
        });
      } else {
        // Reorder within same column — build new array with the item moved
        const columnTasks = [...tasksByStatus[newStatus]];
        const movedTask = columnTasks.splice(source.index, 1)[0];
        columnTasks.splice(destination.index, 0, movedTask);

        const beforeTask = destination.index > 0 ? columnTasks[destination.index - 1] : undefined;
        const afterTask = destination.index < columnTasks.length - 1 ? columnTasks[destination.index + 1] : undefined;

        updateTask.mutate({
          id: draggableId,
          data: {
            sortOrder: getSortOrderBetween(beforeTask?.sortOrder, afterTask?.sortOrder),
          },
          ownerId,
        });
      }
    },
    [tasksByStatus, ownerId, updateTask]
  );

  return {
    tasksByStatus,
    isLoading,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    handleDragEnd,
  };
}
