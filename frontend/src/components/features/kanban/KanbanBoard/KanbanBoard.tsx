/**
 * KanbanBoard - Drag-and-drop context with columns
 */

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import type { AdminTask, AdminTaskStatus } from '@/types/adminTask';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import { StyledBoardRoot } from './KanbanBoard.style';

const COLUMN_ORDER: AdminTaskStatus[] = ['todo', 'in_progress', 'on_hold', 'done'];

interface KanbanBoardProps {
  tasksByStatus: Record<AdminTaskStatus, AdminTask[]>;
  onDragEnd: (result: DropResult) => void;
  onAddTask: (status: AdminTaskStatus) => void;
  onEditTask: (task: AdminTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function KanbanBoard({
  tasksByStatus,
  onDragEnd,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledBoardRoot>
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </StyledBoardRoot>
    </DragDropContext>
  );
}
