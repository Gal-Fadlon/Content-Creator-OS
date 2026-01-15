import React, { useCallback } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '@/context/providers/AuthProvider';
import { ROLE_TOGGLE } from '@/constants/strings.constants';
import {
  StyledRoleToggleContainer,
  StyledRoleIconButton,
} from './RoleToggle.style';

const RoleToggle: React.FC = () => {
  const { role, switchRole } = useAuth();

  const handleAdminClick = useCallback(() => {
    switchRole('admin');
  }, [switchRole]);

  const handleClientClick = useCallback(() => {
    switchRole('client');
  }, [switchRole]);

  const isClient = role === 'client';
  const isAdmin = role === 'admin';

  return (
    <StyledRoleToggleContainer>
      <Tooltip title={ROLE_TOGGLE.admin} arrow>
        <StyledRoleIconButton
          isActive={isAdmin}
          onClick={handleAdminClick}
          aria-label={ROLE_TOGGLE.admin}
        >
          <AdminPanelSettingsIcon />
        </StyledRoleIconButton>
      </Tooltip>

      <Tooltip title={ROLE_TOGGLE.client} arrow>
        <StyledRoleIconButton
          isActive={isClient}
          onClick={handleClientClick}
          aria-label={ROLE_TOGGLE.client}
        >
          <PersonIcon />
        </StyledRoleIconButton>
      </Tooltip>
    </StyledRoleToggleContainer>
  );
};

export default React.memo(RoleToggle);
