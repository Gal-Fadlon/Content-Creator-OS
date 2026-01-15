import React, { useCallback, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { Typography, Box, Button } from '@mui/material';
import InlineImageEditor from '../InlineImageEditor/InlineImageEditor';
import type { ContentType } from '@/types/content';
import { ADD_IMAGE, CONTENT_TYPE_LABELS_HE, COMMON } from '@/constants/strings.constants';
import {
  StyledDialog,
  StyledDialogContent,
  StyledPreviewContainer,
  StyledDialogActions,
  StyledCancelButton,
} from './AddImageDialog.style';

interface AddImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imagePreview: string | null;
  onConfirm: (type: ContentType, zoom: number, offsetX: number, offsetY: number) => void;
  onCancel: () => void;
}

const CONTENT_TYPE_CONFIG: { type: ContentType; icon: React.ReactNode }[] = [
  { type: 'post', icon: <ImageIcon size={20} /> },
  { type: 'reel', icon: <Typography variant="h6">▶</Typography> },
  { type: 'carousel', icon: <Typography variant="h6">⊞</Typography> },
];

const AddImageDialog: React.FC<AddImageDialogProps> = ({
  open,
  onOpenChange,
  imagePreview,
  onConfirm,
  onCancel,
}) => {
  // Store crop values
  const cropValues = useRef({ zoom: 1, offsetX: 0, offsetY: 0 });

  const handleCropChange = useCallback((zoom: number, offsetX: number, offsetY: number) => {
    cropValues.current = { zoom, offsetX, offsetY };
  }, []);

  const handleConfirm = useCallback((type: ContentType) => {
    const { zoom, offsetX, offsetY } = cropValues.current;
    onConfirm(type, zoom, offsetX, offsetY);
    // Reset for next use
    cropValues.current = { zoom: 1, offsetX: 0, offsetY: 0 };
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    cropValues.current = { zoom: 1, offsetX: 0, offsetY: 0 };
    onCancel();
  }, [onCancel]);

  return (
    <StyledDialog open={open} onClose={() => onOpenChange(false)}>
      <StyledDialogContent>
        {imagePreview && (
          <StyledPreviewContainer>
            <InlineImageEditor
              imageUrl={imagePreview}
              initialZoom={1}
              initialOffsetX={0}
              initialOffsetY={0}
              onSave={handleCropChange}
              showDoneButton={false}
              autoSaveOnChange={true}
            />
          </StyledPreviewContainer>
        )}

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={1}
          >
            {ADD_IMAGE.selectType}
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
            {CONTENT_TYPE_CONFIG.map(({ type, icon }) => (
              <Button
                key={type}
                variant="outlined"
                onClick={() => handleConfirm(type)}
                sx={{
                  flexDirection: 'column',
                  height: 'auto',
                  py: 1.5,
                  gap: 0.5,
                }}
              >
                {icon}
                <Typography variant="caption">{CONTENT_TYPE_LABELS_HE[type]}</Typography>
              </Button>
            ))}
          </Box>
        </Box>

        <StyledDialogActions>
          <StyledCancelButton
            variant="outlined"
            onClick={handleCancel}
            fullWidth
          >
            {COMMON.cancel}
          </StyledCancelButton>
        </StyledDialogActions>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default React.memo(AddImageDialog);
