import React, { useState, useRef } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '@/context/providers/AuthProvider';
import { useCalendarNav } from '@/context/providers/CalendarNavProvider';
import { useMonthlyState } from '@/context/providers/MonthlyStateProvider';
import { MONTHS_HE } from '@/constants/calendar.constants';
import { BACKDROP, COMMON } from '@/constants/strings.constants';
import {
  StyledTriggerContainer,
  StyledTriggerButton,
  StyledDialog,
  StyledDialogTitle,
  StyledDialogSubtitle,
  StyledDialogContent,
  StyledBackdropGrid,
  StyledBackdropOption,
  StyledBackdropImage,
  StyledBackdropColor,
  StyledBackdropLabel,
  StyledBackdropLabelText,
  StyledSelectedIndicator,
  StyledUploadSection,
  StyledUploadTitle,
  StyledUploadButton,
  StyledHiddenInput,
  StyledApplyButton,
} from './BackdropManager.style';

const DEFAULT_BACKDROPS = [
  { id: 'minimal', name: BACKDROP.presets.minimal, url: '', color: 'default' },
  { id: 'cream', name: BACKDROP.presets.cream, url: '', color: 'cream' },
  { id: 'warm', name: BACKDROP.presets.warm, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80' },
  { id: 'botanical', name: BACKDROP.presets.botanical, url: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920&q=80' },
  { id: 'marble', name: BACKDROP.presets.marble, url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&q=80' },
  { id: 'linen', name: BACKDROP.presets.linen, url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1920&q=80' },
];

const BackdropManager: React.FC = () => {
  const { isAdmin } = useAuth();
  const { currentMonth } = useCalendarNav();
  const { currentMonthState, setBackdrop: setMonthlyBackdrop } = useMonthlyState();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedBackdrop, setSelectedBackdrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const currentBackdrop = currentMonthState.backdrop;

  if (!isAdmin) return null;

  const monthName = MONTHS_HE[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  const handleOpen = () => {
    setSelectedBackdrop(currentBackdrop);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedBackdrop(null);
  };

  const handleTransitionExited = () => {
    triggerButtonRef.current?.focus();
  };

  const handleBackdropSelect = (url: string) => {
    setSelectedBackdrop(url);
  };

  const handleApply = () => {
    if (selectedBackdrop !== null) {
      setMonthlyBackdrop(selectedBackdrop);
    }
    setIsOpen(false);
    setSelectedBackdrop(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedBackdrop(url);
    }
  };

  return (
    <>
      <StyledTriggerContainer>
        <StyledTriggerButton
          ref={triggerButtonRef}
          startIcon={<ImageIcon />}
          onClick={handleOpen}
        >
          {BACKDROP.triggerButton}
        </StyledTriggerButton>
      </StyledTriggerContainer>

      <StyledDialog
        open={isOpen}
        onClose={handleClose}
        disableRestoreFocus
        slotProps={{ transition: { onExited: handleTransitionExited } }}
      >
        <StyledDialogTitle>
          {BACKDROP.dialogTitle(monthName, year)}
        </StyledDialogTitle>
        <StyledDialogSubtitle>
          {BACKDROP.dialogSubtitle}
        </StyledDialogSubtitle>

        <StyledDialogContent>
          <StyledBackdropGrid>
            {DEFAULT_BACKDROPS.map((backdrop) => (
              <StyledBackdropOption
                key={backdrop.id}
                isSelected={selectedBackdrop === backdrop.url}
                onClick={() => handleBackdropSelect(backdrop.url)}
              >
                {backdrop.url ? (
                  <StyledBackdropImage src={backdrop.url} alt={backdrop.name} />
                ) : (
                  <StyledBackdropColor bgColor={backdrop.color} />
                )}
                <StyledBackdropLabel>
                  <StyledBackdropLabelText>{backdrop.name}</StyledBackdropLabelText>
                </StyledBackdropLabel>
                {selectedBackdrop === backdrop.url && (
                  <StyledSelectedIndicator>
                    <CheckIcon fontSize="inherit" />
                  </StyledSelectedIndicator>
                )}
              </StyledBackdropOption>
            ))}
          </StyledBackdropGrid>

          <StyledUploadSection>
            <StyledUploadTitle>{BACKDROP.uploadTitle}</StyledUploadTitle>

            <StyledUploadButton
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              {BACKDROP.selectFile}
            </StyledUploadButton>
            <StyledHiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />

            <StyledApplyButton
              variant="contained"
              onClick={handleApply}
              fullWidth
            >
              {COMMON.apply}
            </StyledApplyButton>
          </StyledUploadSection>
        </StyledDialogContent>
      </StyledDialog>
    </>
  );
};

export default React.memo(BackdropManager);
