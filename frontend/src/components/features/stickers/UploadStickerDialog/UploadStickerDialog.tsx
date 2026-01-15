import React from 'react';
import { Upload, X, Crop } from 'lucide-react';
import { UPLOAD_STICKER } from '@/constants/strings.constants';
import {
  StyledTriggerButton,
  StyledDialog,
  StyledDialogTitle,
  StyledDialogContent,
  StyledUploadArea,
  StyledUploadIcon,
  StyledUploadText,
  StyledUploadSubtext,
  StyledPreviewContainer,
  StyledPreviewImage,
  StyledClearButton,
  StyledHiddenInput,
  StyledLabelContainer,
  StyledLabel,
  StyledTextField,
  StyledActionsRow,
  StyledSaveButton,
} from './UploadStickerDialog.style';

interface UploadStickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadPreview: string | null;
  stickerLabel: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLabelChange: (label: string) => void;
  onClearPreview: () => void;
  onSave: () => void;
}

const UploadStickerDialog: React.FC<UploadStickerDialogProps> = ({
  open,
  onOpenChange,
  uploadPreview,
  stickerLabel,
  fileInputRef,
  onFileUpload,
  onLabelChange,
  onClearPreview,
  onSave,
}) => {
  return (
    <>
      <StyledTriggerButton
        variant="outlined"
        size="small"
        onClick={() => onOpenChange(true)}
        startIcon={<Upload size={12} />}
      >
        {UPLOAD_STICKER.triggerButton}
      </StyledTriggerButton>

      <StyledDialog open={open} onClose={() => onOpenChange(false)}>
        <StyledDialogTitle>{UPLOAD_STICKER.dialogTitle}</StyledDialogTitle>

        <StyledDialogContent>
          {!uploadPreview ? (
            <StyledUploadArea onClick={() => fileInputRef.current?.click()}>
              <StyledUploadIcon>
                <Upload size={32} />
              </StyledUploadIcon>
              <StyledUploadText>{UPLOAD_STICKER.uploadPrompt}</StyledUploadText>
              <StyledUploadSubtext>{UPLOAD_STICKER.uploadSubtext}</StyledUploadSubtext>
            </StyledUploadArea>
          ) : (
            <StyledPreviewContainer>
              <StyledPreviewImage src={uploadPreview} alt="Preview" />
              <StyledClearButton onClick={onClearPreview} size="small">
                <X size={16} />
              </StyledClearButton>
            </StyledPreviewContainer>
          )}

          <StyledHiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileUpload}
          />

          {uploadPreview && (
            <>
              <StyledLabelContainer>
                <StyledLabel>{UPLOAD_STICKER.nameLabel}</StyledLabel>
                <StyledTextField
                  value={stickerLabel}
                  onChange={(e) => onLabelChange(e.target.value)}
                  placeholder={UPLOAD_STICKER.namePlaceholder}
                  size="small"
                  fullWidth
                />
              </StyledLabelContainer>

              <StyledActionsRow>
                <StyledSaveButton
                  variant="contained"
                  onClick={onSave}
                  disabled={!stickerLabel.trim()}
                  startIcon={<Crop size={16} />}
                >
                  {UPLOAD_STICKER.saveButton}
                </StyledSaveButton>
              </StyledActionsRow>
            </>
          )}
        </StyledDialogContent>
      </StyledDialog>
    </>
  );
};

export default React.memo(UploadStickerDialog);
