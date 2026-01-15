import React from 'react';
import { SelectChangeEvent } from '@mui/material';
import type { ContentStatus } from '@/types/content';
import { STATUS_LABELS, STATUS_SELECTOR } from '@/constants/strings.constants';
import {
  StyledFieldContainer,
  StyledLabel,
  StyledFormControl,
  StyledSelect,
  StyledMenuItem,
} from './StatusSelector.style';

interface StatusSelectorProps {
  value: ContentStatus;
  onChange: (value: ContentStatus) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    onChange(event.target.value as ContentStatus);
  };

  return (
    <StyledFieldContainer>
      <StyledLabel>{STATUS_SELECTOR.label}</StyledLabel>
      <StyledFormControl>
        <StyledSelect value={value} onChange={handleChange} size="small" MenuProps={{ PaperProps: { sx: { direction: 'rtl' } } }}>
          {(Object.keys(STATUS_LABELS) as ContentStatus[]).map((status) => (
            <StyledMenuItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
    </StyledFieldContainer>
  );
};

export default React.memo(StatusSelector);
