import { memo, useCallback, type MouseEvent } from 'react';
import { Popover } from '@mui/material';
import type { EventItem } from '@/types/content';
import {
  StyledPopoverContent,
  StyledEventItem,
  StyledEventTitle,
} from './HiddenEventsPopover.style';

interface HiddenEventsPopoverProps {
  anchorEl: HTMLElement | null;
  events: EventItem[];
  onClose: () => void;
  onEventClick: (eventId: string, e: MouseEvent) => void;
}

function HiddenEventsPopover({
  anchorEl,
  events,
  onClose,
  onEventClick,
}: HiddenEventsPopoverProps) {
  const handleEventClick = useCallback(
    (eventId: string) => (e: MouseEvent) => {
      e.stopPropagation();
      onEventClick(eventId, e);
    },
    [onEventClick]
  );

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <StyledPopoverContent>
        {events.map((event) => (
          <StyledEventItem key={event.id} onClick={handleEventClick(event.id)}>
            <StyledEventTitle>{event.title}</StyledEventTitle>
          </StyledEventItem>
        ))}
      </StyledPopoverContent>
    </Popover>
  );
}

export default memo(HiddenEventsPopover);
