import React from 'react';
import ColorPicker from '../ColorPicker/ColorPicker';
import type { MarkerColor } from '@/types/content';
import { EVENT_FORM } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabel,
  StyledTextField,
} from './EventForm.style';

interface EventFormProps {
  eventTitle: string;
  eventDescription: string;
  eventColor: MarkerColor;
  isAdmin: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onColorChange: (color: MarkerColor) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  eventTitle,
  eventDescription,
  eventColor,
  isAdmin,
  onTitleChange,
  onDescriptionChange,
  onColorChange,
}) => {
  return (
    <>
      <StyledFieldContainer>
        <StyledLabel>{EVENT_FORM.titleLabel}</StyledLabel>
        <StyledTextField
          value={eventTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={EVENT_FORM.titlePlaceholder}
          disabled={!isAdmin}
          size="small"
          fullWidth
        />
      </StyledFieldContainer>

      <StyledFieldContainer>
        <StyledLabel>{EVENT_FORM.descriptionLabel}</StyledLabel>
        <StyledTextField
          value={eventDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={EVENT_FORM.descriptionPlaceholder}
          disabled={!isAdmin}
          multiline
          minRows={3}
          size="small"
          fullWidth
        />
      </StyledFieldContainer>

      {isAdmin && (
        <ColorPicker value={eventColor} onChange={onColorChange} />
      )}
    </>
  );
};

export default React.memo(EventForm);
