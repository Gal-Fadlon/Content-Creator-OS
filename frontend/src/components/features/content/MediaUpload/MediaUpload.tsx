import React, { useCallback, useState } from 'react';
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
  onFileDrop?: (file: File) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mediaPreview,
  existingMediaUrl,
  isAdmin,
  onFileClick,
  onFileDrop,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const displayUrl = mediaPreview || existingMediaUrl;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && onFileDrop) {
      const file = files[0];
      // Only accept images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        onFileDrop(file);
      }
    }
  }, [onFileDrop]);

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
      <StyledUploadArea
        onClick={onFileClick}
        hasPreview={!!mediaPreview}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
