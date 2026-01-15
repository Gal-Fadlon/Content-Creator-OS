import React from 'react';
import { Check } from 'lucide-react';
import ContentTypeSelector from '../ContentTypeSelector/ContentTypeSelector';
import StatusSelector from '../StatusSelector/StatusSelector';
import MediaUpload from '../MediaUpload/MediaUpload';
import CaptionField from '../CaptionField/CaptionField';
import CreativeDescriptionField from '../CreativeDescriptionField/CreativeDescriptionField';
import { StyledApproveButton } from './ContentForm.style';
import { isContentItem } from '../ContentModal/ContentModal.helper';
import type { ContentItem, ContentType, ContentStatus } from '@/types/content';
import { CONTENT_FORM } from '@/constants/strings.constants';

interface ContentFormProps {
  item: ContentItem | null;
  isAdmin: boolean;
  isEditing: boolean;
  contentType: ContentType;
  status: ContentStatus;
  caption: string;
  creativeDescription: string;
  mediaPreview: string | null;
  onContentTypeChange: (type: ContentType) => void;
  onStatusChange: (status: ContentStatus) => void;
  onCaptionChange: (caption: string) => void;
  onCreativeDescriptionChange: (description: string) => void;
  onFileClick: () => void;
  onCopyCaption: () => void;
  onApprove: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({
  item,
  isAdmin,
  isEditing,
  contentType,
  status,
  caption,
  creativeDescription,
  mediaPreview,
  onContentTypeChange,
  onStatusChange,
  onCaptionChange,
  onCreativeDescriptionChange,
  onFileClick,
  onCopyCaption,
  onApprove,
}) => {
  const contentItem = item && isContentItem(item) ? item : null;
  const existingMediaUrl = contentItem?.mediaUrl;
  const showApproveButton = !isAdmin && isEditing && contentItem?.status === 'pending';

  return (
    <>
      {/* Type selector (admin only for new) */}
      {isAdmin && !isEditing && (
        <ContentTypeSelector
          selectedType={contentType}
          onTypeChange={onContentTypeChange}
        />
      )}

      {/* Status selector (admin only) */}
      {isAdmin && (
        <StatusSelector
          value={isEditing && contentItem ? contentItem.status : status}
          onChange={onStatusChange}
        />
      )}

      {/* Media preview or upload */}
      <MediaUpload
        mediaPreview={mediaPreview}
        existingMediaUrl={isEditing ? existingMediaUrl : undefined}
        isAdmin={isAdmin}
        onFileClick={onFileClick}
      />

      {/* Creative Description */}
      <CreativeDescriptionField
        value={isEditing && contentItem ? contentItem.creativeDescription || '' : creativeDescription}
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
        onCopy={onCopyCaption}
      />

      {/* Client approve button */}
      {showApproveButton && (
        <StyledApproveButton
          onClick={onApprove}
          variant="contained"
          size="large"
          startIcon={<Check size={16} />}
        >
          {CONTENT_FORM.approveButton}
        </StyledApproveButton>
      )}
    </>
  );
};

export default React.memo(ContentForm);
