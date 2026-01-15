import React from 'react';
import { Upload, Download, FileImage } from 'lucide-react';
import { MEDIA_UPLOAD } from '@/constants/strings.constants';
import {
  StyledMediaContainer,
  StyledMediaImage,
  StyledDownloadButton,
  StyledEditButton,
  StyledUploadArea,
  StyledUploadIcon,
  StyledUploadText,
  StyledPreviewContainer,
  StyledPreviewImage,
  StyledReplaceText,
} from './MediaUpload.style';

interface MediaUploadProps {
  mediaPreview: string | null;
  existingMediaUrl?: string;
  isAdmin: boolean;
  onFileClick: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mediaPreview,
  existingMediaUrl,
  isAdmin,
  onFileClick,
}) => {
  const displayUrl = mediaPreview || existingMediaUrl;

  // Show existing media with edit option
  if (displayUrl && existingMediaUrl) {
    return (
      <StyledMediaContainer>
        <StyledMediaImage src={displayUrl} alt="" />
        {!isAdmin && (
          <StyledDownloadButton size="small">
            <Download size={16} />
          </StyledDownloadButton>
        )}
        {isAdmin && (
          <StyledEditButton size="small" onClick={onFileClick}>
            <FileImage size={16} />
          </StyledEditButton>
        )}
      </StyledMediaContainer>
    );
  }

  // Upload area for new content (admin only)
  if (isAdmin) {
    return (
      <StyledUploadArea onClick={onFileClick} hasPreview={!!mediaPreview}>
        {mediaPreview ? (
          <StyledPreviewContainer>
            <StyledPreviewImage src={mediaPreview} alt="" />
            <StyledReplaceText>{MEDIA_UPLOAD.replaceFile}</StyledReplaceText>
          </StyledPreviewContainer>
        ) : (
          <>
            <StyledUploadIcon>
              <Upload size={32} />
            </StyledUploadIcon>
            <StyledUploadText>{MEDIA_UPLOAD.uploadPrompt}</StyledUploadText>
          </>
        )}
      </StyledUploadArea>
    );
  }

  return null;
};

export default React.memo(MediaUpload);
