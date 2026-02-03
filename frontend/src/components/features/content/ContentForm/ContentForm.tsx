import React, { useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@mui/material';
import ContentTypeSelector from '../ContentTypeSelector/ContentTypeSelector';
import StatusSelector from '../StatusSelector/StatusSelector';
import MultiMediaUpload, { type PendingMedia } from '../MultiMediaUpload/MultiMediaUpload';
import CaptionField from '../CaptionField/CaptionField';
import CreativeDescriptionField from '../CreativeDescriptionField/CreativeDescriptionField';
import {
  StyledButtonsContainer,
  StyledApproveButton,
  StyledRejectButton,
  StyledRejectDialog,
  StyledRejectDialogTitle,
  StyledRejectDialogContent,
  StyledRejectTextField,
  StyledRejectDialogActions,
} from './ContentForm.style';
import { isContentItem } from '../ContentModal/contentModal.helper.ts';
import type { ContentItem, ContentType, ContentStatus, ContentMedia } from '@/types/content';
import { CONTENT_FORM } from '@/constants/strings.constants';

interface ContentFormProps {
  item: ContentItem | null;
  isAdmin: boolean;
  isEditing: boolean;
  contentType: ContentType;
  status: ContentStatus;
  caption: string;
  creativeDescription: string;
  existingMedia?: ContentMedia[];
  pendingMedia?: PendingMedia[];
  onContentTypeChange: (type: ContentType) => void;
  onStatusChange: (status: ContentStatus) => void;
  onCaptionChange: (caption: string) => void;
  onCreativeDescriptionChange: (description: string) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveExisting?: (mediaId: string) => void;
  onRemovePending?: (pendingId: string) => void;
  onReorderExisting?: (mediaIds: string[]) => void;
  onReorderPending?: (pendingIds: string[]) => void;
  onApprove: () => void;
  onReject: (reason?: string) => void;
}

const ContentForm: React.FC<ContentFormProps> = ({
  item,
  isAdmin,
  isEditing,
  contentType,
  status,
  caption,
  creativeDescription,
  existingMedia = [],
  pendingMedia = [],
  onContentTypeChange,
  onStatusChange,
  onCaptionChange,
  onCreativeDescriptionChange,
  onAddFiles,
  onRemoveExisting,
  onRemovePending,
  onReorderExisting,
  onReorderPending,
  onApprove,
  onReject,
}) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const contentItem = item && isContentItem(item) ? item : null;
  const showClientActions = !isAdmin && isEditing && contentItem?.status === 'pending';

  const handleOpenRejectDialog = useCallback(() => {
    setRejectDialogOpen(true);
  }, []);

  const handleCloseRejectDialog = useCallback(() => {
    setRejectDialogOpen(false);
    setRejectionReason('');
  }, []);

  const handleSubmitRejection = useCallback(() => {
    onReject(rejectionReason || undefined);
    handleCloseRejectDialog();
  }, [onReject, rejectionReason, handleCloseRejectDialog]);

  return (
    <>
      {/* Type selector (admin only) */}
      {isAdmin && (
        <ContentTypeSelector
          selectedType={contentType}
          onTypeChange={onContentTypeChange}
        />
      )}

      {/* Status selector (admin only) */}
      {isAdmin && (
        <StatusSelector
          value={status}
          onChange={onStatusChange}
        />
      )}

      {/* Media upload (supports multiple images) */}
      <MultiMediaUpload
        existingMedia={existingMedia}
        pendingMedia={pendingMedia}
        isAdmin={isAdmin}
        maxImages={10}
        onAddFiles={onAddFiles}
        onRemoveExisting={onRemoveExisting}
        onRemovePending={onRemovePending}
        onReorderExisting={onReorderExisting}
        onReorderPending={onReorderPending}
      />

      {/* Creative Description */}
      <CreativeDescriptionField
        value={isEditing && contentItem ? (isAdmin ? creativeDescription : contentItem.creativeDescription || '') : creativeDescription}
        onChange={onCreativeDescriptionChange}
        isAdmin={isAdmin}
        isEditing={isEditing}
      />

      {/* Caption */}
      <CaptionField
        value={isEditing && contentItem ? (isAdmin ? caption : contentItem.caption || '') : caption}
        onChange={onCaptionChange}
        isAdmin={isAdmin}
        isEditing={isEditing}
      />

      {/* Client approve/reject buttons */}
      {showClientActions && (
        <StyledButtonsContainer>
          <StyledApproveButton
            onClick={onApprove}
            variant="contained"
            size="large"
            startIcon={<Check size={16} />}
          >
            {CONTENT_FORM.approveButton}
          </StyledApproveButton>
          <StyledRejectButton
            onClick={handleOpenRejectDialog}
            variant="outlined"
            size="large"
            startIcon={<X size={16} />}
          >
            {CONTENT_FORM.rejectButton}
          </StyledRejectButton>
        </StyledButtonsContainer>
      )}

      {/* Rejection dialog */}
      <StyledRejectDialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
        <StyledRejectDialogTitle>{CONTENT_FORM.rejectionDialogTitle}</StyledRejectDialogTitle>
        <StyledRejectDialogContent>
          <StyledRejectTextField
            label={CONTENT_FORM.rejectionReasonLabel}
            placeholder={CONTENT_FORM.rejectionReasonPlaceholder}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </StyledRejectDialogContent>
        <StyledRejectDialogActions>
          <Button onClick={handleCloseRejectDialog} color="inherit">
            {CONTENT_FORM.rejectionDialogCancel}
          </Button>
          <Button onClick={handleSubmitRejection} color="error" variant="contained">
            {CONTENT_FORM.rejectionDialogSubmit}
          </Button>
        </StyledRejectDialogActions>
      </StyledRejectDialog>
    </>
  );
};

export default React.memo(ContentForm);
