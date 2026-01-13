import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { ContentType, ContentStatus } from '@/types/content';

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: 'default' | 'warning';
}

function FilterPill({ label, active, onClick, variant = 'default' }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-5 py-2 rounded-full text-sm font-medium transition-all',
        'border border-border hover:border-foreground/30',
        active && variant === 'default' && 'bg-secondary text-secondary-foreground border-foreground/20',
        active && variant === 'warning' && 'bg-status-pending text-foreground border-status-pending',
        !active && 'bg-card text-muted-foreground'
      )}
    >
      {label}
    </button>
  );
}

export function FilterBar() {
  const { filters, setFilters, userRole } = useApp();
  
  const isAllActive = !filters.type?.length && !filters.pendingApprovalOnly;
  const isReelsActive = filters.type?.includes('reel') && filters.type.length === 1;
  const isStoriesActive = filters.type?.includes('story') && filters.type.length === 1;
  const isPostsActive = filters.type?.includes('post') && filters.type.length === 1;
  const isPendingActive = filters.pendingApprovalOnly;
  
  const handleAllClick = () => {
    setFilters({});
  };
  
  const handleTypeFilter = (type: ContentType) => {
    if (filters.type?.includes(type) && filters.type.length === 1) {
      setFilters({ ...filters, type: undefined });
    } else {
      setFilters({ ...filters, type: [type], pendingApprovalOnly: false });
    }
  };
  
  const handlePendingClick = () => {
    setFilters({
      ...filters,
      pendingApprovalOnly: !filters.pendingApprovalOnly,
      type: undefined,
    });
  };
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Pending approval filter - prominent for clients */}
      {userRole === 'client' && (
        <FilterPill
          label="ממתין לאישור"
          active={isPendingActive}
          onClick={handlePendingClick}
          variant="warning"
        />
      )}
      
      {/* Content type filters */}
      <FilterPill label="פוסטים" active={isPostsActive} onClick={() => handleTypeFilter('post')} />
      <FilterPill label="Stories" active={isStoriesActive} onClick={() => handleTypeFilter('story')} />
      <FilterPill label="Reels" active={isReelsActive} onClick={() => handleTypeFilter('reel')} />
      <FilterPill label="הכל" active={isAllActive} onClick={handleAllClick} />
      
      {/* Admin-only pending filter */}
      {userRole === 'admin' && (
        <FilterPill
          label="ממתין לאישור"
          active={isPendingActive}
          onClick={handlePendingClick}
          variant="warning"
        />
      )}
    </div>
  );
}
