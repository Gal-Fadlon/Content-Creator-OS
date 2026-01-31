import React from 'react';
import { Container, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClient, useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import ClientSelector from '@/components/layout/ClientSelector/ClientSelector';
import NotificationBell from '@/components/layout/NotificationBell/NotificationBell';
import RoleToggle from '@/components/layout/RoleToggle/RoleToggle';
import BackdropManager from '@/components/layout/BackdropManager/BackdropManager';
import ViewToggle, { ViewMode } from '@/components/layout/ViewToggle/ViewToggle';
import EventRequestsPanel from '@/components/features/events/EventRequestsPanel/EventRequestsPanel';
import { APP_HEADER } from '@/constants/strings.constants';
import {
  StyledAppBar,
  StyledToolbar,
  StyledLogoSection,
  StyledLogoTitle,
  StyledClientName,
  StyledActionsSection,
  StyledEventRequestButton,
  StyledLogoutButton,
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
  const { isAdmin, isActualAdmin, signOut } = useAuth();
  const selectedClient = useSelectedClient();
  const [selectedClientId] = useSelectedClientId();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <StyledAppBar elevation={0}>
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          {/* Right side - Logo & Client */}
          <StyledLogoSection>
            <StyledLogoTitle variant="h2">
              {APP_HEADER.title}
            </StyledLogoTitle>
            {isAdmin && <ClientSelector />}
            {!isAdmin && selectedClient && (
              <StyledClientName>
                {selectedClient.name}
              </StyledClientName>
            )}
            <NotificationBell />
            {isAdmin && <EventRequestsPanel clientId={selectedClientId} />}
          </StyledLogoSection>

          {/* Left side - Actions */}
          <StyledActionsSection>
            {/* Client: Request new event button */}
            {!isAdmin && (
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
            {isAdmin && <BackdropManager />}

            {/* Role Toggle (Actual admins only - for previewing client view) */}
            {isActualAdmin && <RoleToggle />}

            {/* Logout */}
            <Tooltip title={APP_HEADER.logout}>
              <StyledLogoutButton onClick={handleLogout} size="small">
                <LogoutIcon fontSize="small" />
              </StyledLogoutButton>
            </Tooltip>
          </StyledActionsSection>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default React.memo(AppHeader);
