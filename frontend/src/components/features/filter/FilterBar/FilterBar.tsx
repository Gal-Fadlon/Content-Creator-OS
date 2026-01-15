import React, { useCallback, useMemo } from 'react';
import { useFilters } from '@/context/providers/FilterProvider';
import { ContentType } from '@/types/content';
import { FILTER_BAR } from '@/constants/strings.constants';
import FilterPill from '../FilterPill/FilterPill';
import { StyledFilterBarContainer } from './FilterBar.style';

const FilterBar: React.FC = () => {
  const { filters, setFilters } = useFilters();

  const isAllActive = useMemo(
    () => !filters.type?.length && !filters.pendingApprovalOnly,
    [filters.type, filters.pendingApprovalOnly]
  );

  const isReelsActive = useMemo(
    () => filters.type?.includes('reel') && filters.type.length === 1,
    [filters.type]
  );

  const isStoriesActive = useMemo(
    () => filters.type?.includes('story') && filters.type.length === 1,
    [filters.type]
  );

  const isPostsActive = useMemo(
    () => filters.type?.includes('post') && filters.type.length === 1,
    [filters.type]
  );

  const isPendingActive = useMemo(
    () => filters.pendingApprovalOnly,
    [filters.pendingApprovalOnly]
  );

  const handleAllClick = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const handleTypeFilter = useCallback(
    (type: ContentType) => {
      if (filters.type?.includes(type) && filters.type.length === 1) {
        setFilters({ ...filters, type: undefined });
      } else {
        setFilters({ ...filters, type: [type], pendingApprovalOnly: false });
      }
    },
    [filters, setFilters]
  );

  const handlePendingClick = useCallback(() => {
    setFilters({
      ...filters,
      pendingApprovalOnly: !filters.pendingApprovalOnly,
      type: undefined,
    });
  }, [filters, setFilters]);

  return (
    <StyledFilterBarContainer>
      {/* All filter - rightmost in RTL */}
      <FilterPill
        label={FILTER_BAR.all}
        active={isAllActive}
        onClick={handleAllClick}
      />

      {/* Pending approval filter */}
      <FilterPill
        label={FILTER_BAR.pendingApproval}
        active={isPendingActive}
        onClick={handlePendingClick}
        variant="warning"
      />

      {/* Content type filters */}
      <FilterPill
        label={FILTER_BAR.reels}
        active={isReelsActive}
        onClick={() => handleTypeFilter('reel')}
      />
      <FilterPill
        label={FILTER_BAR.stories}
        active={isStoriesActive}
        onClick={() => handleTypeFilter('story')}
      />
      <FilterPill
        label={FILTER_BAR.posts}
        active={isPostsActive}
        onClick={() => handleTypeFilter('post')}
      />
    </StyledFilterBarContainer>
  );
};

export default React.memo(FilterBar);
