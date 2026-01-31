import React, { useCallback, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { Tooltip } from '@mui/material';
import type { ContentComment } from '@/types/content';
import { COMMENTS, COMMON } from '@/constants/strings.constants';
import {
  StyledCommentContainer,
  StyledCommentHeader,
  StyledUserInfo,
  StyledUserName,
  StyledRoleBadge,
  StyledTimestamp,
  StyledMessage,
  StyledDeleteButton,
} from './CommentItem.style';

interface CommentItemProps {
  comment: ContentComment;
  currentUserId: string;
  onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onDelete,
}) => {
  const isOwnComment = comment.userId === currentUserId;

  const handleDelete = useCallback(() => {
    onDelete(comment.id);
  }, [comment.id, onDelete]);

  const formattedTime = useMemo(() => {
    const now = new Date();
    const commentDate = new Date(comment.createdAt);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return COMMENTS.justNow;
    if (diffMinutes < 60) return COMMENTS.minutesAgo(diffMinutes);
    if (diffHours < 24) return COMMENTS.hoursAgo(diffHours);
    return COMMENTS.daysAgo(diffDays);
  }, [comment.createdAt]);

  const roleLabel = comment.userRole === 'admin' ? COMMENTS.admin : COMMENTS.client;

  return (
    <StyledCommentContainer isOwnComment={isOwnComment}>
      <StyledCommentHeader>
        <StyledUserInfo>
          <StyledUserName>{comment.userName}</StyledUserName>
          <StyledRoleBadge role={comment.userRole}>{roleLabel}</StyledRoleBadge>
        </StyledUserInfo>
        <StyledUserInfo>
          <StyledTimestamp>{formattedTime}</StyledTimestamp>
          {isOwnComment && (
            <Tooltip title={COMMON.delete} arrow>
              <StyledDeleteButton onClick={handleDelete} size="small">
                <Trash2 size={14} />
              </StyledDeleteButton>
            </Tooltip>
          )}
        </StyledUserInfo>
      </StyledCommentHeader>
      <StyledMessage>{comment.message}</StyledMessage>
    </StyledCommentContainer>
  );
};

export default React.memo(CommentItem);
