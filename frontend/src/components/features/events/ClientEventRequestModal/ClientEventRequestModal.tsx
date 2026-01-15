import React, { useState, useCallback } from 'react';
import { Popover } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useCreateEventRequest } from '@/hooks/queries/useEvents';
import { useToast } from '@/context/SnackbarContext';
import DatePicker from '@/components/common/DatePicker/DatePicker';
import { CLIENT_EVENT_REQUEST, COMMON } from '@/constants/strings.constants';
import {
  StyledDialog,
  StyledDialogTitle,
  StyledDialogContent,
  StyledFieldContainer,
  StyledLabel,
  StyledTextField,
  StyledDateButton,
  StyledSubmitButton,
} from './ClientEventRequestModal.style';

interface ClientEventRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date | null;
}

const ClientEventRequestModal: React.FC<ClientEventRequestModalProps> = ({
  open,
  onOpenChange,
  initialDate,
}) => {
  const [selectedClientId] = useSelectedClientId();
  const createEventRequest = useCreateEventRequest();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate ?? undefined);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLButtonElement | null>(null);
  
  // Update date when initialDate changes
  React.useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  const handleDateClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setDateAnchorEl(event.currentTarget);
  }, []);

  const handleDateClose = useCallback(() => {
    setDateAnchorEl(null);
  }, []);

  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setDateAnchorEl(null);
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !date || !selectedClientId) {
      toast({
        title: CLIENT_EVENT_REQUEST.validation.error,
        description: CLIENT_EVENT_REQUEST.validation.requiredFields,
        variant: 'destructive',
      });
      return;
    }

    createEventRequest.mutate(
      {
        clientId: selectedClientId,
        title: title.trim(),
        date: date.toISOString().split('T')[0],
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: CLIENT_EVENT_REQUEST.success.title,
            description: CLIENT_EVENT_REQUEST.success.description,
            variant: 'success',
          });

          // Reset form
          setTitle('');
          setDescription('');
          setDate(undefined);
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: CLIENT_EVENT_REQUEST.validation.error,
            description: 'אירעה שגיאה בשליחת הבקשה',
            variant: 'destructive',
          });
        },
      }
    );
  }, [title, date, description, selectedClientId, createEventRequest, toast, onOpenChange]);

  const isDatePopoverOpen = Boolean(dateAnchorEl);

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <StyledDialogTitle>{CLIENT_EVENT_REQUEST.dialogTitle}</StyledDialogTitle>

      <StyledDialogContent>
        <StyledFieldContainer>
          <StyledLabel required>{CLIENT_EVENT_REQUEST.eventNameLabel}</StyledLabel>
          <StyledTextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={CLIENT_EVENT_REQUEST.eventNamePlaceholder}
            size="small"
            fullWidth
          />
        </StyledFieldContainer>

        <StyledFieldContainer>
          <StyledLabel required>{CLIENT_EVENT_REQUEST.dateLabel}</StyledLabel>
          <StyledDateButton
            variant="outlined"
            onClick={handleDateClick}
            startIcon={<CalendarMonthIcon />}
            fullWidth
          >
            {date ? format(date, CLIENT_EVENT_REQUEST.dateFormat, { locale: he }) : COMMON.selectDate}
          </StyledDateButton>
          <Popover
            open={isDatePopoverOpen}
            anchorEl={dateAnchorEl}
            onClose={handleDateClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <DatePicker
              selected={date}
              onSelect={handleDateSelect}
            />
          </Popover>
        </StyledFieldContainer>

        <StyledFieldContainer>
          <StyledLabel>{CLIENT_EVENT_REQUEST.descriptionLabel}</StyledLabel>
          <StyledTextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={CLIENT_EVENT_REQUEST.descriptionPlaceholder}
            multiline
            rows={3}
            size="small"
            fullWidth
          />
        </StyledFieldContainer>

        <StyledSubmitButton
          variant="contained"
          onClick={handleSubmit}
          size="large"
          fullWidth
          disabled={createEventRequest.isPending}
        >
          <SendIcon fontSize="small" />
          {CLIENT_EVENT_REQUEST.submitButton}
        </StyledSubmitButton>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default React.memo(ClientEventRequestModal);
