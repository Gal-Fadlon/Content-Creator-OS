import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { CircularProgress, Tooltip } from '@mui/material';
import { useContentComments, useCreateComment, useDeleteComment } from '@/hooks/queries/useComments';
import CommentItem from '../CommentItem/CommentItem';
import { COMMENTS } from '@/constants/strings.constants';
import {
  StyledContainer,
  StyledHeader,
  StyledTitle,
  StyledCommentCount,
  StyledCommentsList,
  StyledEmptyMessage,
  StyledInputContainer,
  StyledTextField,
  StyledSendButton,
  StyledLoadingContainer,
} from './CommentsSection.style';

interface CommentsSectionProps {
  contentId: string;
  currentUserId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  contentId,
  currentUserId,
}) => {
  const [message, setMessage] = useState('');
  const commentsListRef = useRef<HTMLDivElement>(null);

  // Check if this is a valid content ID (not pending upload)
  const isValidContentId = contentId && !contentId.startsWith('pending-');

  const { data: comments, isLoading, isError } = useContentComments(isValidContentId ? contentId : '');
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    if (commentsListRef.current && comments?.length) {
      commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
    }
  }, [comments?.length]);

  const handleSubmit = useCallback(() => {
    if (!message.trim() || !isValidContentId) return;

    createComment.mutate(
      { contentId, message: message.trim() },
      {
        onSuccess: () => {
          setMessage('');
        },
      }
    );
  }, [message, contentId, isValidContentId, createComment]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteComment.mutate({ id, contentId });
    },
    [contentId, deleteComment]
  );

  // Don't render comments section for pending uploads or invalid IDs
  if (!isValidContentId) {
    return null;
  }

  const isSubmitting = createComment.isPending;

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>{COMMENTS.title}</StyledTitle>
        {comments && comments.length > 0 && (
          <StyledCommentCount>{comments.length}</StyledCommentCount>
        )}
      </StyledHeader>

      {isLoading ? (
        <StyledLoadingContainer>
          <CircularProgress size={24} />
        </StyledLoadingContainer>
      ) : isError ? (
        <StyledEmptyMessage>{COMMENTS.empty}</StyledEmptyMessage>
      ) : comments && comments.length > 0 ? (
        <StyledCommentsList ref={commentsListRef}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />
          ))}
        </StyledCommentsList>
      ) : (
        <StyledEmptyMessage>{COMMENTS.empty}</StyledEmptyMessage>
      )}

      <StyledInputContainer>
        <StyledTextField
          placeholder={COMMENTS.placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={3}
          disabled={isSubmitting}
        />
        <Tooltip title={COMMENTS.send} arrow>
          <span>
            <StyledSendButton
              onClick={handleSubmit}
              disabled={!message.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Send size={18} />
              )}
            </StyledSendButton>
          </span>
        </Tooltip>
      </StyledInputContainer>
    </StyledContainer>
  );
};

export default React.memo(CommentsSection);
