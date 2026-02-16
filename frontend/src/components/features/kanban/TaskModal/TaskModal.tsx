/**
 * TaskModal - Create/edit dialog for admin tasks
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';
import type { AdminTask, AdminTaskStatus, AdminTaskPriority } from '@/types/adminTask';
import { TASK_MODAL, KANBAN_COLUMNS, TASK_PRIORITY } from '@/constants/strings.constants';
import { useTaskModal } from './useTaskModal';
import {
  StyledModalContent,
  StyledFieldContainer,
  StyledLabel,
  StyledTextField,
  StyledFieldRow,
  StyledColorPalette,
  StyledColorSwatch,
  StyledModalActions,
  StyledDialogTitle,
  StyledColorLabelText,
  StyledActionButtons,
  StyledClearColorSwatch,
} from './TaskModal.style';

const STATUS_OPTIONS: AdminTaskStatus[] = ['todo', 'in_progress', 'on_hold', 'done'];
const PRIORITY_OPTIONS: AdminTaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const COLOR_OPTIONS = ['#e57373', '#64b5f6', '#81c784', '#ffb74d', '#ba68c8', '#4db6ac', '#f06292', '#a1887f'];

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  editingTask: AdminTask | null;
  defaultStatus: AdminTaskStatus;
  onSave: (data: {
    title: string;
    description: string;
    status: AdminTaskStatus;
    priority: AdminTaskPriority;
    dueDate: string;
    colorLabel: string;
  }) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskModal({
  open,
  onClose,
  editingTask,
  defaultStatus,
  onSave,
  onDelete,
}: TaskModalProps) {
  const { form, updateField, isValid } = useTaskModal(editingTask, defaultStatus);

  const handleSave = () => {
    if (!isValid) return;
    onSave(form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <StyledDialogTitle>
          {editingTask ? TASK_MODAL.editTitle : TASK_MODAL.createTitle}
          <IconButton onClick={onClose} size="small">
            <CloseIcon size={18} />
          </IconButton>
        </StyledDialogTitle>
      </DialogTitle>

      <DialogContent>
        <StyledModalContent>
          <StyledFieldContainer>
            <StyledLabel>{TASK_MODAL.titleLabel}</StyledLabel>
            <StyledTextField
              placeholder={TASK_MODAL.titlePlaceholder}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              fullWidth
              autoFocus
              size="small"
            />
          </StyledFieldContainer>

          <StyledFieldContainer>
            <StyledLabel>{TASK_MODAL.descriptionLabel}</StyledLabel>
            <StyledTextField
              placeholder={TASK_MODAL.descriptionPlaceholder}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
            />
          </StyledFieldContainer>

          <StyledFieldRow>
            <StyledFieldContainer>
              <StyledLabel>{TASK_MODAL.statusLabel}</StyledLabel>
              <StyledTextField
                select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as AdminTaskStatus)}
                fullWidth
                size="small"
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{KANBAN_COLUMNS[s]}</MenuItem>
                ))}
              </StyledTextField>
            </StyledFieldContainer>

            <StyledFieldContainer>
              <StyledLabel>{TASK_MODAL.priorityLabel}</StyledLabel>
              <StyledTextField
                select
                value={form.priority}
                onChange={(e) => updateField('priority', e.target.value as AdminTaskPriority)}
                fullWidth
                size="small"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>{TASK_PRIORITY[p]}</MenuItem>
                ))}
              </StyledTextField>
            </StyledFieldContainer>
          </StyledFieldRow>

          <StyledFieldContainer>
            <StyledLabel>{TASK_MODAL.dueDateLabel}</StyledLabel>
            <StyledTextField
              type="date"
              value={form.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              fullWidth
              size="small"
            />
          </StyledFieldContainer>

          <div>
            <StyledColorLabelText>
              {TASK_MODAL.colorLabel}
            </StyledColorLabelText>
            <StyledColorPalette>
              <StyledClearColorSwatch
                onClick={() => updateField('colorLabel', '')}
              />
              {COLOR_OPTIONS.map((color) => (
                <StyledColorSwatch
                  key={color}
                  swatchColor={color}
                  selected={form.colorLabel === color}
                  onClick={() => updateField('colorLabel', color)}
                />
              ))}
            </StyledColorPalette>
          </div>

          <StyledModalActions>
            <div>
              {editingTask && onDelete && (
                <Button
                  color="error"
                  size="small"
                  onClick={() => {
                    onDelete(editingTask.id);
                    onClose();
                  }}
                >
                  {TASK_MODAL.deleteButton}
                </Button>
              )}
            </div>
            <StyledActionButtons>
              <Button onClick={onClose} size="small" color="inherit">
                {TASK_MODAL.cancelButton}
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                size="small"
                disabled={!isValid}
              >
                {TASK_MODAL.saveButton}
              </Button>
            </StyledActionButtons>
          </StyledModalActions>
        </StyledModalContent>
      </DialogContent>
    </Dialog>
  );
}
