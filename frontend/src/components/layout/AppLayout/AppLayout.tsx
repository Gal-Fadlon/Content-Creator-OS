/**
 * AppLayout - Main layout wrapper with side menu and content area
 * RTL: SideMenu renders first in DOM → appears on the right in RTL flow
 */

import { Outlet } from 'react-router-dom';
import SideMenu from '@/components/layout/SideMenu/SideMenu';
import { StyledAppLayoutRoot, StyledMainContent } from './AppLayout.style';

export default function AppLayout() {
  return (
    <StyledAppLayoutRoot>
      <SideMenu />
      <StyledMainContent>
        <Outlet />
      </StyledMainContent>
    </StyledAppLayoutRoot>
  );
}
