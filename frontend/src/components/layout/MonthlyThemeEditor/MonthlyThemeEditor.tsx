import React, { useState, useRef, useEffect, useCallback } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/context/providers/AuthProvider';
import { useCalendarNav } from '@/context/providers/CalendarNavProvider';
import { useMonthlyState } from '@/context/providers/MonthlyStateProvider';
import { MONTHS_HE } from '@/constants/calendar.constants';
import { MONTHLY_THEME, COMMON } from '@/constants/strings.constants';
import {
  StyledContainer,
  StyledLabel,
  StyledDivider,
  StyledThemeText,
  StyledEditContainer,
  StyledThemeInput,
  StyledSaveButton,
  StyledCancelButton,
  StyledDisplayContainer,
  StyledEditButton,
} from './MonthlyThemeEditor.style';

const MonthlyThemeEditor: React.FC = () => {
  const { isAdmin } = useAuth();
  const { currentMonth } = useCalendarNav();
  const { currentMonthState, setTheme: setMonthlyTheme } = useMonthlyState();

  const savedTheme = currentMonthState.theme;

  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState(savedTheme);
  const inputRef = useRef<HTMLInputElement>(null);

  const monthName = MONTHS_HE[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  // Update local state when month changes
  useEffect(() => {
    setTheme(savedTheme);
  }, [savedTheme]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    setMonthlyTheme(theme.trim());
    setIsEditing(false);
  }, [theme, setMonthlyTheme]);

  const handleCancel = useCallback(() => {
    setTheme(savedTheme);
    setIsEditing(false);
  }, [savedTheme]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <StyledContainer>
      <StyledLabel>
        {MONTHLY_THEME.label(monthName, year)}
      </StyledLabel>
      <StyledDivider>|</StyledDivider>

      {isEditing ? (
        <StyledEditContainer>
          <StyledThemeInput
            inputRef={inputRef}
            variant="standard"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={MONTHLY_THEME.placeholder}
          />
          <StyledSaveButton onClick={handleSave} size="small">
            <CheckIcon fontSize="small" />
          </StyledSaveButton>
          <StyledCancelButton onClick={handleCancel} size="small">
            <CloseIcon fontSize="small" />
          </StyledCancelButton>
        </StyledEditContainer>
      ) : (
        <StyledDisplayContainer>
          <StyledThemeText isPlaceholder={!savedTheme}>{savedTheme || COMMON.notDefined}</StyledThemeText>
          {isAdmin && (
            <StyledEditButton
              onClick={handleStartEdit}
              size="small"
              title={MONTHLY_THEME.editTooltip}
            >
              <EditIcon fontSize="inherit" />
            </StyledEditButton>
          )}
        </StyledDisplayContainer>
      )}
    </StyledContainer>
  );
};

export default React.memo(MonthlyThemeEditor);
