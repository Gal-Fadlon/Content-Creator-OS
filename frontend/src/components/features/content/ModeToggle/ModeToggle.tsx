import React from 'react';
import type { ModalMode } from '@/types/content';
import { MODE_TOGGLE } from '@/constants/strings.constants';
import {
  StyledModeToggleContainer,
  StyledToggleGroup,
  StyledToggleButton,
} from './ModeToggle.style';

interface ModeToggleProps {
  mode: ModalMode;
  onModeChange: (mode: ModalMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ModalMode | null
  ) => {
    if (newMode !== null) {
      onModeChange(newMode);
    }
  };

  return (
    <StyledModeToggleContainer>
      <StyledToggleGroup value={mode} exclusive onChange={handleChange}>
        <StyledToggleButton value="media">{MODE_TOGGLE.media}</StyledToggleButton>
        <StyledToggleButton value="event">{MODE_TOGGLE.event}</StyledToggleButton>
      </StyledToggleGroup>
    </StyledModeToggleContainer>
  );
};

export default React.memo(ModeToggle);
