import React, { useState, useCallback } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/queries/useNotifications';
import { NOTIFICATIONS } from '@/constants/strings.constants';
import {
  StyledIconButton,
  StyledBadge,
  StyledPopover,
  StyledPopoverHeader,
  StyledPopoverTitle,
  StyledNotificationList,
  StyledEmptyMessage,
  StyledNotificationItem,
  StyledNotificationContent,
  StyledUnreadDot,
  StyledNotificationTextWrapper,
  StyledNotificationTitle,
  StyledNotificationMessage,
} from './NotificationBell.style';

const NotificationBell: React.FC = () => {
  const { data: notifications = [] } = useNotifications();
  const unreadCount = useUnreadCount();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // Mark all notifications as read when opening
    markAllReadMutation.mutate();
  }, [markAllReadMutation]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationClick = useCallback(
    (notificationId: string) => {
      markReadMutation.mutate(notificationId);
    },
    [markReadMutation]
  );

  const isOpen = Boolean(anchorEl);

  return (
    <>
      <StyledIconButton onClick={handleOpen}>
        <StyledBadge badgeContent={unreadCount} max={99}>
          <NotificationsIcon />
        </StyledBadge>
      </StyledIconButton>

      <StyledPopover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <StyledPopoverHeader>
          <StyledPopoverTitle>{NOTIFICATIONS.title}</StyledPopoverTitle>
        </StyledPopoverHeader>

        <StyledNotificationList>
          {notifications.length === 0 ? (
            <StyledEmptyMessage>{NOTIFICATIONS.empty}</StyledEmptyMessage>
          ) : (
            notifications.map((notif) => (
              <StyledNotificationItem
                key={notif.id}
                isUnread={!notif.read}
                onClick={() => handleNotificationClick(notif.id)}
              >
                <StyledNotificationContent>
                  {!notif.read && <StyledUnreadDot />}
                  <StyledNotificationTextWrapper>
                    <StyledNotificationTitle>{notif.title}</StyledNotificationTitle>
                    <StyledNotificationMessage>{notif.message}</StyledNotificationMessage>
                  </StyledNotificationTextWrapper>
                </StyledNotificationContent>
              </StyledNotificationItem>
            ))
          )}
        </StyledNotificationList>
      </StyledPopover>
    </>
  );
};

export default React.memo(NotificationBell);
