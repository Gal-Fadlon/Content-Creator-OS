import React from 'react';
import type { ContentType } from '@/types/content';
import { CONTENT_TYPE_LABELS_HE } from '@/constants/strings.constants';
import { StyledContentTypeBadge } from './ContentTypeBadge.style';

interface ContentTypeBadgeProps {
  type: ContentType;
}

const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ type }) => {
  return (
    <StyledContentTypeBadge
      label={CONTENT_TYPE_LABELS_HE[type]}
      size="small"
      contentType={type}
    />
  );
};

export default React.memo(ContentTypeBadge);
