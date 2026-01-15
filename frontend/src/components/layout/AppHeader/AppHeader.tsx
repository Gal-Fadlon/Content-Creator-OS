import React from 'react';
import { Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClient } from '@/context/providers/SelectedClientProvider';
import ClientSelector from '@/components/layout/ClientSelector/ClientSelector';
import NotificationBell from '@/components/layout/NotificationBell/NotificationBell';
import RoleToggle from '@/components/layout/RoleToggle/RoleToggle';
import BackdropManager from '@/components/layout/BackdropManager/BackdropManager';
import ViewToggle, { ViewMode } from '@/components/layout/ViewToggle/ViewToggle';
import { APP_HEADER } from '@/constants/strings.constants';
import {
  StyledAppBar,
  StyledToolbar,
  StyledLogoSection,
  StyledLogoTitle,
  StyledClientName,
  StyledActionsSection,
  StyledEventRequestButton,
} from './AppHeader.style';

interface AppHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRequestEvent: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onRequestEvent,
}) => {
  const { role } = useAuth();
  const selectedClient = useSelectedClient();

  return (
    <StyledAppBar elevation={0}>
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          {/* Right side - Logo & Client */}
          <StyledLogoSection>
            <StyledLogoTitle variant="h2">
              {APP_HEADER.title}
            </StyledLogoTitle>
            {role === 'admin' && <ClientSelector />}
            {role === 'client' && selectedClient && (
              <StyledClientName>
                {selectedClient.name}
              </StyledClientName>
            )}
            <NotificationBell />
          </StyledLogoSection>

          {/* Left side - Actions */}
          <StyledActionsSection>
            {/* Client: Request new event button */}
            {role === 'client' && (
              <StyledEventRequestButton
                variant="contained"
                onClick={onRequestEvent}
                startIcon={<AddIcon />}
              >
                {APP_HEADER.requestNewEvent}
              </StyledEventRequestButton>
            )}

            {/* View Toggle */}
            <ViewToggle 
              viewMode={viewMode} 
              onViewModeChange={onViewModeChange} 
            />

            {/* Backdrop Manager (Admin only) */}
            {role === 'admin' && <BackdropManager />}

            <RoleToggle />
          </StyledActionsSection>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default React.memo(AppHeader);
