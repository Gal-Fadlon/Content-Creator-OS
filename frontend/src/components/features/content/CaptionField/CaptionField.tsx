import React from 'react';
import { CAPTION_FIELD } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabel,
  StyledTextField,
  StyledReadOnlyBox,
  StyledReadOnlyText,
} from './CaptionField.style';

interface CaptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  isAdmin: boolean;
  isEditing: boolean;
}

const CaptionField: React.FC<CaptionFieldProps> = ({
  value,
  onChange,
  isAdmin,
  isEditing,
}) => {
  // Admin can edit caption
  if (isAdmin) {
    return (
      <StyledFieldContainer>
        <StyledLabel>{CAPTION_FIELD.label}</StyledLabel>
        <StyledTextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={CAPTION_FIELD.placeholder}
          multiline
          minRows={4}
          fullWidth
          inputProps={{ dir: 'rtl', style: { textAlign: 'right' } }}
        />
      </StyledFieldContainer>
    );
  }

  // Client view - read only (only when editing)
  if (isEditing && value) {
    return (
      <StyledFieldContainer>
        <StyledLabel>{CAPTION_FIELD.label}</StyledLabel>
        <StyledReadOnlyBox>
          <StyledReadOnlyText>{value}</StyledReadOnlyText>
        </StyledReadOnlyBox>
      </StyledFieldContainer>
    );
  }

  return null;
};

export default React.memo(CaptionField);
