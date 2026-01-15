import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GridViewIcon from '@mui/icons-material/GridView';
import { VIEW_TOGGLE } from '@/constants/strings.constants';
import {
  StyledViewToggleContainer,
  StyledViewButton,
} from './ViewToggle.style';

export type ViewMode = 'calendar' | 'grid';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <StyledViewToggleContainer>
      <StyledViewButton
        isActive={viewMode === 'calendar'}
        onClick={() => onViewModeChange('calendar')}
        startIcon={<CalendarMonthIcon fontSize="small" />}
      >
        {VIEW_TOGGLE.calendar}
      </StyledViewButton>
      <StyledViewButton
        isActive={viewMode === 'grid'}
        onClick={() => onViewModeChange('grid')}
        startIcon={<GridViewIcon fontSize="small" />}
      >
        {VIEW_TOGGLE.grid}
      </StyledViewButton>
    </StyledViewToggleContainer>
  );
};

export default React.memo(ViewToggle);
