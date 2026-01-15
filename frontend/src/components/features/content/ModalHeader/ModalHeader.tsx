import React from 'react';
import { X, Trash2 } from 'lucide-react';
import {
  StyledHeaderContainer,
  StyledDateText,
  StyledActionsContainer,
  StyledDeleteButton,
  StyledCloseButton,
} from './ModalHeader.style';

interface ModalHeaderProps {
  dateDisplay: string;
  isAdmin: boolean;
  isEditing: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  dateDisplay,
  isAdmin,
  isEditing,
  onClose,
  onDelete,
}) => {
  return (
    <StyledHeaderContainer>
      <StyledActionsContainer>
        <StyledCloseButton onClick={onClose} size="small">
          <X size={20} />
        </StyledCloseButton>
        {isAdmin && isEditing && (
          <StyledDeleteButton onClick={onDelete} size="small">
            <Trash2 size={20} />
          </StyledDeleteButton>
        )}
      </StyledActionsContainer>
      <StyledDateText>{dateDisplay}</StyledDateText>
    </StyledHeaderContainer>
  );
};

export default React.memo(ModalHeader);
