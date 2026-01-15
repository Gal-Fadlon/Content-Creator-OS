import React from 'react';
import type { MarkerColor } from '@/types/content';
import { COLOR_PICKER } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabel,
  StyledColorsRow,
  StyledColorButton,
} from './ColorPicker.style';

interface ColorPickerProps {
  value: MarkerColor;
  onChange: (color: MarkerColor) => void;
}

const COLORS: MarkerColor[] = ['red', 'blue', 'beige', 'brown', 'black'];

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <StyledFieldContainer>
      <StyledLabel>{COLOR_PICKER.label}</StyledLabel>
      <StyledColorsRow>
        {COLORS.map((color) => (
          <StyledColorButton
            key={color}
            colorValue={color}
            isSelected={value === color}
            onClick={() => onChange(color)}
          />
        ))}
      </StyledColorsRow>
    </StyledFieldContainer>
  );
};

export default React.memo(ColorPicker);
