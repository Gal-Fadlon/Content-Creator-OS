import React from 'react';
import { Copy } from 'lucide-react';
import { CAPTION_FIELD } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabelRow,
  StyledLabel,
  StyledCopyButton,
  StyledTextField,
  StyledReadOnlyBox,
  StyledReadOnlyText,
} from './CaptionField.style';

interface CaptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  isAdmin: boolean;
  isEditing: boolean;
  onCopy?: () => void;
}

const CaptionField: React.FC<CaptionFieldProps> = ({
  value,
  onChange,
  isAdmin,
  isEditing,
  onCopy,
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

  // Client view - read only with copy button (only when editing)
  if (isEditing && value) {
    return (
      <StyledFieldContainer>
        <StyledLabelRow>
          <StyledCopyButton size="small" onClick={onCopy}>
            <Copy size={16} />
            {CAPTION_FIELD.copyButton}
          </StyledCopyButton>
          <StyledLabel>{CAPTION_FIELD.label}</StyledLabel>
        </StyledLabelRow>
        <StyledReadOnlyBox>
          <StyledReadOnlyText>{value}</StyledReadOnlyText>
        </StyledReadOnlyBox>
      </StyledFieldContainer>
    );
  }

  return null;
};

export default React.memo(CaptionField);
