import React, { useState, useCallback, useMemo } from 'react';
import { Check, X, ClipboardList } from 'lucide-react';
import { Badge, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { he } from 'date-fns/locale';
import { useEventRequests, useApproveEventRequest, useRejectEventRequest } from '@/hooks/queries/useEvents';
import { useClients } from '@/hooks/queries/useClients';
import { useToast } from '@/context/SnackbarContext';
import {
  StyledDrawer,
  StyledHeader,
  StyledTitle,
  StyledBadge,
  StyledEmptyMessage,
  StyledRequestCard,
  StyledCardContent,
  StyledRequestHeader,
  StyledRequestTitle,
  StyledRequestDate,
  StyledRequestDescription,
  StyledClientName,
  StyledActionsContainer,
  StyledApproveButton,
  StyledRejectButton,
  StyledTriggerButton,
} from './EventRequestsPanel.style';

const EVENT_REQUESTS = {
  title: 'בקשות אירועים',
  empty: 'אין בקשות ממתינות',
  approveTooltip: 'אשר בקשה',
  rejectTooltip: 'דחה בקשה',
  triggerTooltip: 'בקשות אירועים',
  approved: 'הבקשה אושרה והאירוע נוסף ללוח',
  rejected: 'הבקשה נדחתה',
  from: 'מאת:',
} as const;

interface EventRequestsPanelProps {
  clientId: string | null;
}

const EventRequestsPanel: React.FC<EventRequestsPanelProps> = ({ clientId }) => {
  const [open, setOpen] = useState(false);
  const { data: requests = [] } = useEventRequests(clientId);
  const { data: clients = [] } = useClients();
  const approveRequest = useApproveEventRequest();
  const rejectRequest = useRejectEventRequest();
  const { toast } = useToast();

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'pending'),
    [requests]
  );

  const getClientName = useCallback(
    (reqClientId: string) => {
      const client = clients.find((c) => c.id === reqClientId);
      return client?.name || '';
    },
    [clients]
  );

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleApprove = useCallback(
    (id: string) => {
      approveRequest.mutate(id, {
        onSuccess: () => {
          toast({ title: 'אושר!', description: EVENT_REQUESTS.approved, variant: 'success' });
        },
      });
    },
    [approveRequest, toast]
  );

  const handleReject = useCallback(
    (id: string) => {
      rejectRequest.mutate(id, {
        onSuccess: () => {
          toast({ title: 'נדחה', description: EVENT_REQUESTS.rejected });
        },
      });
    },
    [rejectRequest, toast]
  );

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd בMMMM yyyy', { locale: he });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Tooltip title={EVENT_REQUESTS.triggerTooltip} arrow>
        <StyledTriggerButton onClick={handleOpen}>
          <Badge badgeContent={pendingRequests.length} color="warning">
            <ClipboardList size={20} />
          </Badge>
        </StyledTriggerButton>
      </Tooltip>

      <StyledDrawer anchor="right" open={open} onClose={handleClose} slotProps={{ transition: { direction: 'left' } }}>
        <StyledHeader>
          <StyledTitle variant="h6">{EVENT_REQUESTS.title}</StyledTitle>
          {pendingRequests.length > 0 && (
            <StyledBadge label={pendingRequests.length} size="small" />
          )}
        </StyledHeader>

        {pendingRequests.length === 0 ? (
          <StyledEmptyMessage variant="body1">{EVENT_REQUESTS.empty}</StyledEmptyMessage>
        ) : (
          pendingRequests.map((request) => (
            <StyledRequestCard key={request.id}>
              <StyledCardContent>
                <StyledClientName>
                  {EVENT_REQUESTS.from} {getClientName(request.clientId)}
                </StyledClientName>
                <StyledRequestHeader>
                  <StyledRequestTitle>{request.title}</StyledRequestTitle>
                  <StyledRequestDate>{formatDate(request.date)}</StyledRequestDate>
                </StyledRequestHeader>
                {request.description && (
                  <StyledRequestDescription>{request.description}</StyledRequestDescription>
                )}
                <StyledActionsContainer>
                  <Tooltip title={EVENT_REQUESTS.approveTooltip} arrow>
                    <StyledApproveButton
                      onClick={() => handleApprove(request.id)}
                      disabled={approveRequest.isPending}
                    >
                      <Check size={18} />
                    </StyledApproveButton>
                  </Tooltip>
                  <Tooltip title={EVENT_REQUESTS.rejectTooltip} arrow>
                    <StyledRejectButton
                      onClick={() => handleReject(request.id)}
                      disabled={rejectRequest.isPending}
                    >
                      <X size={18} />
                    </StyledRejectButton>
                  </Tooltip>
                </StyledActionsContainer>
              </StyledCardContent>
            </StyledRequestCard>
          ))
        )}
      </StyledDrawer>
    </>
  );
};

export default React.memo(EventRequestsPanel);
