/**
 * KanbanColumn - Droppable column in the Kanban board
 */

import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import type { AdminTask, AdminTaskStatus } from '@/types/adminTask';
import { TASK_MANAGER, KANBAN_COLUMNS } from '@/constants/strings.constants';
import TaskCard from '../TaskCard/TaskCard';
import {
  StyledColumnRoot,
  StyledColumnHeader,
  StyledColumnTitle,
  StyledTaskCount,
  StyledDropZone,
  StyledEmptyState,
  StyledAddButton,
  StyledAddTaskButton,
} from './KanbanColumn.style';

const COLUMN_COLORS: Record<AdminTaskStatus, string> = {
  todo: '#c8ad7f',
  in_progress: '#823d22',
  on_hold: '#ff9800',
  done: '#4caf50',
};

interface KanbanColumnProps {
  status: AdminTaskStatus;
  tasks: AdminTask[];
  onAddTask: (status: AdminTaskStatus) => void;
  onEditTask: (task: AdminTask) => void;
}

export default function KanbanColumn({ status, tasks, onAddTask, onEditTask }: KanbanColumnProps) {
  return (
    <StyledColumnRoot columnColor={COLUMN_COLORS[status]}>
      <StyledColumnHeader>
        <StyledColumnTitle>
          {KANBAN_COLUMNS[status]}
          <StyledTaskCount>{tasks.length}</StyledTaskCount>
        </StyledColumnTitle>
      </StyledColumnHeader>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <StyledDropZone
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <StyledEmptyState>{TASK_MANAGER.emptyColumn}</StyledEmptyState>
            )}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onClick={onEditTask} />
            ))}
            {provided.placeholder}
          </StyledDropZone>
        )}
      </Droppable>

      <StyledAddButton>
        <StyledAddTaskButton onClick={() => onAddTask(status)}>
          <Plus size={16} />
          {TASK_MANAGER.addTask}
        </StyledAddTaskButton>
      </StyledAddButton>
    </StyledColumnRoot>
  );
}
