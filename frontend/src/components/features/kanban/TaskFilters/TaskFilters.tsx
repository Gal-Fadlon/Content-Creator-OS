/**
 * TaskFilters - Search input and priority filter pills
 */

import type { AdminTaskPriority } from '@/types/adminTask';
import { TASK_MANAGER, TASK_PRIORITY } from '@/constants/strings.constants';
import { StyledFiltersRoot, StyledSearchInput, StyledFilterPill } from './TaskFilters.style';

const PRIORITIES: AdminTaskPriority[] = ['urgent', 'high', 'medium', 'low'];

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: AdminTaskPriority | null;
  onPriorityChange: (priority: AdminTaskPriority | null) => void;
}

export default function TaskFilters({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <StyledFiltersRoot>
      <StyledSearchInput
        type="text"
        placeholder={TASK_MANAGER.searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {PRIORITIES.map((p) => (
        <StyledFilterPill
          key={p}
          active={priorityFilter === p}
          onClick={() => onPriorityChange(priorityFilter === p ? null : p)}
        >
          {TASK_PRIORITY[p]}
        </StyledFilterPill>
      ))}
    </StyledFiltersRoot>
  );
}
