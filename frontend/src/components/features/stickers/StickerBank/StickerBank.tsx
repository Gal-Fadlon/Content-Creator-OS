import React, { useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { ClickAwayListener } from '@mui/material';
import StickerGrid from '../StickerGrid/StickerGrid';
import CustomStickerGrid from '../CustomStickerGrid/CustomStickerGrid';
import UploadStickerDialog from '../UploadStickerDialog/UploadStickerDialog';
import { useStickerBank } from './useStickerBank';
import type { PlacedSticker } from '@/types/content';
import { STICKER_BANK } from '@/constants/strings.constants';
import {
  StyledBankContainer,
  StyledToggleButton,
  StyledDrawer,
  StyledDrawerTitle,
  StyledPlacedCount,
} from './StickerBank.style';

interface StickerBankProps {
  onStickerPlace?: (sticker: PlacedSticker) => void;
}

const StickerBank: React.FC<StickerBankProps> = ({ onStickerPlace }) => {
  const {
    isAdmin,
    isExpanded,
    setIsExpanded,
    showUploadDialog,
    setShowUploadDialog,
    uploadPreview,
    setUploadPreview,
    stickerLabel,
    setStickerLabel,
    fileInputRef,
    placedStickers,
    customStickerBank,
    addSticker,
    addCustomStickerToCalendar,
    handleFileUpload,
    handleSaveCustomSticker,
    handleRemoveCustomSticker,
  } = useStickerBank();

  // All hooks must be called before any early returns
  const handleClickAway = useCallback(() => {
    if (!showUploadDialog) {
      setIsExpanded(false);
    }
  }, [showUploadDialog, setIsExpanded]);

  const handleStickerClick = useCallback((sticker: Parameters<typeof addSticker>[0]) => {
    const placed = addSticker(sticker);
    onStickerPlace?.(placed);
  }, [addSticker, onStickerPlace]);

  const handleCustomStickerClick = useCallback((sticker: { id: string; imageUrl: string; label: string }) => {
    const placed = addCustomStickerToCalendar(sticker);
    onStickerPlace?.(placed);
  }, [addCustomStickerToCalendar, onStickerPlace]);

  if (!isAdmin) return null;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <StyledBankContainer>
        {/* Toggle Button */}
        <StyledToggleButton
          isExpanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Sparkles size={20} />
        </StyledToggleButton>

        {/* Sticker Drawer */}
        {isExpanded && (
          <StyledDrawer elevation={3}>
            <StyledDrawerTitle>{STICKER_BANK.drawerTitle}</StyledDrawerTitle>

            <StickerGrid onStickerClick={handleStickerClick} />

            <CustomStickerGrid
              stickers={customStickerBank}
              onStickerClick={handleCustomStickerClick}
              onRemove={handleRemoveCustomSticker}
            />

            <UploadStickerDialog
              open={showUploadDialog}
              onOpenChange={setShowUploadDialog}
              uploadPreview={uploadPreview}
              stickerLabel={stickerLabel}
              fileInputRef={fileInputRef}
              onFileUpload={handleFileUpload}
              onLabelChange={setStickerLabel}
              onClearPreview={() => setUploadPreview(null)}
              onSave={handleSaveCustomSticker}
            />
          </StyledDrawer>
        )}

        {/* Placed stickers count */}
        {placedStickers.length > 0 && (
          <StyledPlacedCount label={STICKER_BANK.stickersCount(placedStickers.length)} size="small" />
        )}
      </StyledBankContainer>
    </ClickAwayListener>
  );
};

export default React.memo(StickerBank);
