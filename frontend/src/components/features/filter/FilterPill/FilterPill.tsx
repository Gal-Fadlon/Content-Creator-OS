import React from 'react';
import { StyledFilterPill } from './FilterPill.style';

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'warning';
}

const FilterPill: React.FC<FilterPillProps> = ({ 
  label, 
  active, 
  onClick, 
  variant = 'default' 
}) => {
  return (
    <StyledFilterPill
      label={label}
      onClick={onClick}
      isActive={active}
      pillVariant={variant}
    />
  );
};

export default React.memo(FilterPill);
