import React, { useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { MEDIA_UPLOAD } from '@/constants/strings.constants';
import {
  StyledMediaContainer,
  StyledMediaImage,
  StyledClickableImage,
  StyledDownloadButton,
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

  const handleDownload = useCallback(() => {
    if (!existingMediaUrl) return;
    
    // Open in new tab - user can right-click and save
    // This avoids CORS issues with fetch
    window.open(existingMediaUrl, '_blank');
  }, [existingMediaUrl]);

  // Show existing media with edit option
  if (displayUrl && existingMediaUrl) {
    return (
      <StyledMediaContainer>
        <StyledClickableImage clickable={isAdmin} onClick={isAdmin ? onFileClick : undefined}>
          <StyledMediaImage src={displayUrl} alt="" />
        </StyledClickableImage>
        {!isAdmin && (
          <StyledDownloadButton size="small" onClick={handleDownload}>
            <Download size={16} />
          </StyledDownloadButton>
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
