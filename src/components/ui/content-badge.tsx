import { cn } from '@/lib/utils';
import { ContentType, ContentStatus } from '@/types/content';

interface ContentBadgeProps {
  type: ContentType;
  label?: string;
  className?: string;
}

const typeStyles: Record<ContentType, string> = {
  reel: 'bg-luxury-purple text-white',
  story: 'bg-sand text-foreground',
  post: 'bg-earth text-white',
};

const typeLabels: Record<ContentType, string> = {
  reel: 'reel',
  story: 'story',
  post: 'post',
};

export function ContentBadge({ type, label, className }: ContentBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full',
        typeStyles[type],
        className
      )}
    >
      {label || typeLabels[type]}
    </span>
  );
}

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const statusStyles: Record<ContentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-sand text-foreground font-semibold',
  approved: 'bg-luxury-purple text-white',
  published: 'bg-status-published text-white',
};

const statusLabels: Record<ContentStatus, string> = {
  draft: 'טיוטה',
  pending: 'ממתין לאישור',
  approved: 'אושר',
  published: 'פורסם',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full',
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
