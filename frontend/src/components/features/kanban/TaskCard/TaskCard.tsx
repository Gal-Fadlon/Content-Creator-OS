/**
 * TaskCard - Draggable card in the Kanban board
 * Shows title, priority badge, due date, and description preview
 */

import { Draggable } from '@hello-pangea/dnd';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { AdminTask } from '@/types/adminTask';
import { TASK_PRIORITY } from '@/constants/strings.constants';
import {
  StyledTaskCardRoot,
  StyledTaskTitle,
  StyledTaskDescription,
  StyledTaskMeta,
  StyledPriorityChip,
  StyledDueDate,
} from './TaskCard.style';

interface TaskCardProps {
  task: AdminTask;
  index: number;
  onClick: (task: AdminTask) => void;
}

export default function TaskCard({ task, index, onClick }: TaskCardProps) {
  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date(new Date().toDateString()) && task.status !== 'done'
    : false;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <StyledTaskCardRoot
            colorLabel={task.colorLabel}
            isDragging={snapshot.isDragging}
            onClick={() => onClick(task)}
          >
            <StyledTaskTitle>{task.title}</StyledTaskTitle>
            {task.description && (
              <StyledTaskDescription>{task.description}</StyledTaskDescription>
            )}
            <StyledTaskMeta>
              <StyledPriorityChip
                label={TASK_PRIORITY[task.priority]}
                priority={task.priority}
                size="small"
              />
              {task.dueDate && (
                <StyledDueDate overdue={isOverdue}>
                  <CalendarIcon size={12} />
                  {formatDate(task.dueDate)}
                </StyledDueDate>
              )}
            </StyledTaskMeta>
          </StyledTaskCardRoot>
        </div>
      )}
    </Draggable>
  );
}
