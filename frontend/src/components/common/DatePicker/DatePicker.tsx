import React from 'react';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StyledCalendarContainer } from './DatePicker.style';

// Use the single selection mode props
type DatePickerProps = Omit<DayPickerSingleProps, 'mode'> & {
  mode?: 'single';
};

const DatePicker: React.FC<DatePickerProps> = ({
  showOutsideDays = true,
  ...props
}) => {
  return (
    <StyledCalendarContainer>
      <DayPicker
        mode="single"
        showOutsideDays={showOutsideDays}
        components={{
          IconLeft: () => <ChevronLeft size={16} />,
          IconRight: () => <ChevronRight size={16} />,
        }}
        {...props}
      />
    </StyledCalendarContainer>
  );
};

export default React.memo(DatePicker);
