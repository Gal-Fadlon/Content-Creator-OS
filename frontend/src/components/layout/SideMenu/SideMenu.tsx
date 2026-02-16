/**
 * SideMenu - Collapsible right-side navigation
 * RTL layout: side menu is on the right (start side)
 */

import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import {
  LayoutDashboard as DashboardIcon,
  ListTodo as TasksIcon,
  ChevronLeft as ExpandIcon,
  ChevronRight as CollapseIcon,
} from 'lucide-react';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSideMenu } from '@/context/providers/SideMenuProvider';
import { SIDE_MENU } from '@/constants/strings.constants';
import {
  StyledSideMenuRoot,
  StyledMenuList,
  StyledMenuItem,
  StyledMenuLabel,
  StyledCollapseButton,
} from './SideMenu.style';

interface MenuItemConfig {
  path: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const MENU_ITEMS: MenuItemConfig[] = [
  {
    path: '/',
    label: SIDE_MENU.dashboard,
    icon: <DashboardIcon size={20} />,
  },
  {
    path: '/tasks',
    label: SIDE_MENU.taskManager,
    icon: <TasksIcon size={20} />,
    adminOnly: true,
  },
];

export default function SideMenu() {
  const { isActualAdmin } = useAuth();
  const { collapsed, toggleCollapse } = useSideMenu();
  const location = useLocation();

  const visibleItems = MENU_ITEMS.filter(
    (item) => !item.adminOnly || isActualAdmin
  );

  return (
    <StyledSideMenuRoot collapsed={collapsed}>
      <StyledMenuList>
        {visibleItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          const menuItem = (
            <StyledMenuItem
              key={item.path}
              to={item.path}
              active={isActive}
              collapsed={collapsed}
            >
              {item.icon}
              {!collapsed && <StyledMenuLabel>{item.label}</StyledMenuLabel>}
            </StyledMenuItem>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} title={item.label} placement="left">
                {menuItem}
              </Tooltip>
            );
          }

          return menuItem;
        })}
      </StyledMenuList>

      <StyledCollapseButton>
        <Tooltip title={collapsed ? SIDE_MENU.expand : SIDE_MENU.collapse} placement="left">
          <IconButton onClick={toggleCollapse} size="small">
            {collapsed ? <ExpandIcon size={18} /> : <CollapseIcon size={18} />}
          </IconButton>
        </Tooltip>
      </StyledCollapseButton>
    </StyledSideMenuRoot>
  );
}
