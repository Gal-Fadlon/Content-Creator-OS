import { Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead } = useApp();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold">התראות</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-muted-foreground text-sm">
              אין התראות חדשות
            </p>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={cn(
                  'w-full p-3 text-right hover:bg-muted/50 transition-colors border-b border-border last:border-0',
                  !notif.read && 'bg-status-pending/10'
                )}
              >
                <div className="flex items-start gap-2">
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-status-pending mt-1.5 flex-shrink-0" />
                  )}
                  <div className={cn(!notif.read ? '' : 'mr-4')}>
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
