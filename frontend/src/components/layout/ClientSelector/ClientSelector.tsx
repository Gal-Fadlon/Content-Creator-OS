import React, { useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClientId, useSelectedClient } from '@/context/providers/SelectedClientProvider';
import { useClients } from '@/hooks/queries/useClients';
import { CLIENT_SELECTOR } from '@/constants/strings.constants';
import {
  StyledTriggerContainer,
  StyledTriggerButton,
  StyledDrawer,
  StyledDrawerTitle,
  StyledClientList,
  StyledClientItem,
  StyledClientAvatar,
  StyledTriggerLogo,
  StyledClientInfo,
  StyledClientName,
  StyledClientMeta,
  StyledPendingText,
} from './ClientSelector.style';

const ClientSelector: React.FC = () => {
  const { role } = useAuth();
  const { data: clients = [], isLoading } = useClients();
  const [selectedClientId, setSelectedClientId] = useSelectedClientId();
  const selectedClient = useSelectedClient();
  const [isOpen, setIsOpen] = useState(false);

  // Only show for admin
  if (role !== 'admin') return null;

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsOpen(false);
  };

  return (
    <>
      <StyledTriggerContainer>
        <StyledTriggerButton
          startIcon={!selectedClient?.avatarUrl ? <GroupIcon /> : undefined}
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
          sx={selectedClient?.avatarUrl ? { px: 1 } : undefined}
        >
          {selectedClient?.avatarUrl ? (
            <StyledTriggerLogo src={selectedClient.avatarUrl} alt={selectedClient.name} />
          ) : (
            selectedClient ? selectedClient.name : CLIENT_SELECTOR.selectClient
          )}
        </StyledTriggerButton>
      </StyledTriggerContainer>

      <StyledDrawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slotProps={{ transition: { direction: 'left' } }}
      >
        <StyledDrawerTitle>{CLIENT_SELECTOR.drawerTitle}</StyledDrawerTitle>

        <StyledClientList>
          {clients.map((client) => (
            <StyledClientItem
              key={client.id}
              isSelected={selectedClientId === client.id}
              onClick={() => handleClientSelect(client.id)}
            >
              <StyledClientAvatar src={client.avatarUrl} alt={client.name}>
                {client.name.charAt(0)}
              </StyledClientAvatar>

              <StyledClientInfo>
                <StyledClientName>{client.name}</StyledClientName>
                <StyledClientMeta>
                  {client.pendingApprovals > 0 ? (
                    <StyledPendingText>
                      {CLIENT_SELECTOR.pendingApprovals(client.pendingApprovals)}
                    </StyledPendingText>
                  ) : (
                    <>{CLIENT_SELECTOR.contentItems(client.totalContent)}</>
                  )}
                </StyledClientMeta>
              </StyledClientInfo>

              {selectedClientId === client.id && (
                <CheckIcon color="primary" fontSize="small" />
              )}
            </StyledClientItem>
          ))}
        </StyledClientList>
      </StyledDrawer>
    </>
  );
};

export default React.memo(ClientSelector);
