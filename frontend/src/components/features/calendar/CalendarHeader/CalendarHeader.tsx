import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MONTHS_EN } from '@/constants/calendar.constants';
import {
  StyledHeaderContainer,
  StyledNavigationRow,
  StyledNavButton,
  StyledMonthContainer,
  StyledMonthName,
  StyledYear,
} from './CalendarHeader.style';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <StyledHeaderContainer>
      <StyledNavigationRow>
        <StyledNavButton onClick={onNextMonth}>
          <ChevronRightIcon />
        </StyledNavButton>

        <StyledMonthContainer>
          <StyledMonthName variant="h1">
            {MONTHS_EN[currentMonth.getMonth()]}
          </StyledMonthName>
          <StyledYear>{currentMonth.getFullYear()}</StyledYear>
        </StyledMonthContainer>

        <StyledNavButton onClick={onPreviousMonth}>
          <ChevronLeftIcon />
        </StyledNavButton>
      </StyledNavigationRow>
    </StyledHeaderContainer>
  );
};

export default React.memo(CalendarHeader);
