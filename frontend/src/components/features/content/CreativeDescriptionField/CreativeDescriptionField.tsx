import React from 'react';
import { CREATIVE_DESCRIPTION_FIELD } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabel,
  StyledTextField,
  StyledReadOnlyBox,
  StyledReadOnlyText,
} from './CreativeDescriptionField.style';

interface CreativeDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  isAdmin: boolean;
  isEditing: boolean;
}

const CreativeDescriptionField: React.FC<CreativeDescriptionFieldProps> = ({
  value,
  onChange,
  isAdmin,
  isEditing,
}) => {
  // Admin can edit creative description
  if (isAdmin) {
    return (
      <StyledFieldContainer>
        <StyledLabel>{CREATIVE_DESCRIPTION_FIELD.label}</StyledLabel>
        <StyledTextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={CREATIVE_DESCRIPTION_FIELD.placeholder}
          multiline
          minRows={2}
          fullWidth
          inputProps={{ dir: 'rtl', style: { textAlign: 'right' } }}
        />
      </StyledFieldContainer>
    );
  }

  // Client view - read only (only when editing and has value)
  if (isEditing && value) {
    return (
      <StyledFieldContainer>
        <StyledLabel>{CREATIVE_DESCRIPTION_FIELD.label}</StyledLabel>
        <StyledReadOnlyBox>
          <StyledReadOnlyText>{value}</StyledReadOnlyText>
        </StyledReadOnlyBox>
      </StyledFieldContainer>
    );
  }

  return null;
};

export default React.memo(CreativeDescriptionField);
