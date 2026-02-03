import React, { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import type { ContentType } from '@/types/content';
import { CONTENT_TYPE_LABELS_HE } from '@/constants/strings.constants';
import { StyledContentTypeBadge, StyledMenuItem } from './ContentTypeBadge.style';

const CONTENT_TYPES: ContentType[] = ['post', 'reel', 'carousel'];

interface ContentTypeBadgeProps {
  type: ContentType;
  editable?: boolean;
  onTypeChange?: (newType: ContentType) => void;
}

const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({
  type,
  editable = false,
  onTypeChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable || !onTypeChange) return;
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, [editable, onTypeChange]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleTypeSelect = useCallback((newType: ContentType) => {
    if (newType !== type) {
      onTypeChange?.(newType);
    }
    setAnchorEl(null);
  }, [type, onTypeChange]);

  return (
    <>
      <StyledContentTypeBadge
        label={CONTENT_TYPE_LABELS_HE[type]}
        size="small"
        contentType={type}
        onClick={handleClick}
        clickable={editable}
      />
      {editable && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 100,
                direction: 'rtl',
              },
            },
          }}
        >
          {CONTENT_TYPES.map((contentType) => (
            <StyledMenuItem
              key={contentType}
              onClick={() => handleTypeSelect(contentType)}
              selected={contentType === type}
              contentType={contentType}
            >
              {CONTENT_TYPE_LABELS_HE[contentType]}
            </StyledMenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default React.memo(ContentTypeBadge);
