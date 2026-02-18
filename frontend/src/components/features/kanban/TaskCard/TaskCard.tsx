/**
 * TaskCard - Draggable card in the Kanban board
 * Shows title, priority badge, due date, and description preview
 */

import { type MouseEvent, useRef, useState, useCallback } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Tooltip } from '@mui/material';
import { Calendar as CalendarIcon } from 'lucide-react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { AdminTask } from '@/types/adminTask';
import { TASK_PRIORITY } from '@/constants/strings.constants';
import {
  StyledTaskCardRoot,
  StyledDeleteButton,
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
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, index, onClick, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date(new Date().toDateString()) && task.status !== 'done'
    : false;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  const descriptionRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDescriptionHover = useCallback(() => {
    const el = descriptionRef.current;
    if (el) {
      setShowTooltip(el.scrollHeight > el.clientHeight);
    }
  }, []);

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
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
            <StyledDeleteButton className="task-card-delete" onClick={handleDelete}>
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </StyledDeleteButton>
            <StyledTaskTitle>{task.title}</StyledTaskTitle>
            {task.description && (
              <Tooltip
                title={showTooltip ? task.description : ''}
                placement="top"
                enterDelay={300}
              >
                <StyledTaskDescription
                  ref={descriptionRef}
                  onMouseEnter={handleDescriptionHover}
                >
                  {task.description}
                </StyledTaskDescription>
              </Tooltip>
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
