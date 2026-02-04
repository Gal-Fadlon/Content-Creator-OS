import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import ColorPicker from '../ColorPicker/ColorPicker';
import type { MarkerColor } from '@/types/content';
import { TASK_FORM } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabel,
  StyledTextField,
  StyledCheckboxLabel,
} from './TaskForm.style';

interface TaskFormProps {
  taskTitle: string;
  taskDescription: string;
  taskColor: MarkerColor;
  isCompleted: boolean;
  isAdmin: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onColorChange: (color: MarkerColor) => void;
  onCompletedChange: (completed: boolean) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  taskTitle,
  taskDescription,
  taskColor,
  isCompleted,
  isAdmin,
  onTitleChange,
  onDescriptionChange,
  onColorChange,
  onCompletedChange,
}) => {
  return (
    <>
      <StyledFieldContainer>
        <StyledLabel>{TASK_FORM.titleLabel}</StyledLabel>
        <StyledTextField
          value={taskTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={TASK_FORM.titlePlaceholder}
          disabled={!isAdmin}
          size="small"
          fullWidth
        />
      </StyledFieldContainer>

      <StyledFieldContainer>
        <StyledLabel>{TASK_FORM.descriptionLabel}</StyledLabel>
        <StyledTextField
          value={taskDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={TASK_FORM.descriptionPlaceholder}
          disabled={!isAdmin}
          multiline
          minRows={3}
          size="small"
          fullWidth
        />
      </StyledFieldContainer>

      {isAdmin && (
        <>
          <ColorPicker value={taskColor} onChange={onColorChange} />
          <StyledCheckboxLabel
            control={
              <Checkbox
                checked={isCompleted}
                onChange={(e) => onCompletedChange(e.target.checked)}
              />
            }
            label={TASK_FORM.completedLabel}
          />
        </>
      )}
    </>
  );
};

export default React.memo(TaskForm);
