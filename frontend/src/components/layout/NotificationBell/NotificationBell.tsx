import React, { useState, useCallback } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Clock, CalendarClock, CheckCircle, Inbox, CalendarPlus, MessageCircle } from 'lucide-react';
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/queries/useNotifications';
import { useContentModal } from '@/context/providers/ModalProvider';
import { NOTIFICATIONS } from '@/constants/strings.constants';
import type { Notification, NotificationType } from '@/types/content';
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
  StyledNotificationTextWrapper,
  StyledNotificationTitle,
  StyledNotificationMessage,
  StyledNotificationThumbnail,
  StyledNotificationIcon,
} from './NotificationBell.style';

// Icon and color mapping for notification types
const notificationIconConfig: Record<NotificationType, { icon: typeof Clock; color: string }> = {
  content_pending: { icon: Clock, color: '#f59e0b' }, // amber
  publish_reminder: { icon: CalendarClock, color: '#3b82f6' }, // blue
  content_approved: { icon: CheckCircle, color: '#22c55e' }, // green
  new_request: { icon: Inbox, color: '#8b5cf6' }, // purple
  event_request: { icon: CalendarPlus, color: '#ec4899' }, // pink
  new_comment: { icon: MessageCircle, color: '#06b6d4' }, // cyan
};

const getNotificationIcon = (type: NotificationType) => {
  const config = notificationIconConfig[type];
  const IconComponent = config.icon;
  return <IconComponent size={16} color={config.color} />;
};

const NotificationBell: React.FC = () => {
  const { data: notifications = [] } = useNotifications();
  const unreadCount = useUnreadCount();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const { openForEdit } = useContentModal();
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
    (notification: Notification) => {
      markReadMutation.mutate(notification.id);
      
      // If notification has a contentId, open the content modal
      if (notification.contentId) {
        handleClose();
        openForEdit(notification.contentId);
      }
    },
    [markReadMutation, openForEdit, handleClose]
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
                onClick={() => handleNotificationClick(notif)}
              >
                <StyledNotificationContent>
                  <StyledNotificationIcon isUnread={!notif.read}>
                    {getNotificationIcon(notif.type)}
                  </StyledNotificationIcon>
                  <StyledNotificationTextWrapper>
                    <StyledNotificationTitle>{notif.title}</StyledNotificationTitle>
                    <StyledNotificationMessage>{notif.message}</StyledNotificationMessage>
                  </StyledNotificationTextWrapper>
                  {notif.contentMediaUrl && (
                    <StyledNotificationThumbnail 
                      src={notif.contentMediaUrl} 
                      alt="" 
                    />
                  )}
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
