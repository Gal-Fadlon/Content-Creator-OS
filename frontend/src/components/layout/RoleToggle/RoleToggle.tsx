import React, { useCallback } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '@/context/providers/AuthProvider';
import { USER_ROLES } from '@/types/content';
import { ROLE_TOGGLE } from '@/constants/strings.constants';
import {
  StyledRoleToggleContainer,
  StyledRoleIconButton,
} from './RoleToggle.style';

const RoleToggle: React.FC = () => {
  const { isAdmin, switchRole } = useAuth();

  const handleAdminClick = useCallback(() => {
    switchRole(USER_ROLES.ADMIN);
  }, [switchRole]);

  const handleClientClick = useCallback(() => {
    switchRole(USER_ROLES.CLIENT);
  }, [switchRole]);

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
          isActive={!isAdmin}
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
