import React, { useState, useRef } from 'react';
import { useMonthlyState } from '@/context/providers/MonthlyStateProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import type { PlacedSticker } from '@/types/content';
import type { StickerDefinition } from '@/constants/stickers.constants';

export function useStickerBank() {
  const { currentMonthState, setStickers, addCustomSticker, removeCustomSticker } = useMonthlyState();
  const { isAdmin } = useAuth();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [stickerLabel, setStickerLabel] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const placedStickers = currentMonthState.stickers;
  const customStickerBank = currentMonthState.customStickerBank;

  const addSticker = (sticker: StickerDefinition) => {
    const newPlaced: PlacedSticker = {
      id: sticker.id,
      iconType: 'lucide',
      lucideIcon: sticker.id,
      color: sticker.color,
      label: sticker.label,
      visibleId: `${sticker.id}-${Date.now()}`,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      rotation: -15 + Math.random() * 30,
      scale: 0.8 + Math.random() * 0.4,
    };
    setStickers([...placedStickers, newPlaced]);
    return newPlaced;
  };
  
  const addCustomStickerToCalendar = (customSticker: { id: string; imageUrl: string; label: string }) => {
    const newPlaced: PlacedSticker = {
      id: customSticker.id,
      icon: customSticker.imageUrl,
      iconType: 'custom',
      color: '',
      label: customSticker.label,
      visibleId: `custom-${Date.now()}`,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 100,
      rotation: -15 + Math.random() * 30,
      scale: 0.8 + Math.random() * 0.4,
    };
    setStickers([...placedStickers, newPlaced]);
    return newPlaced;
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = window.URL.createObjectURL(file);
      setUploadPreview(url);
    }
  };
  
  const handleSaveCustomSticker = () => {
    if (uploadPreview && stickerLabel.trim()) {
      addCustomSticker({
        imageUrl: uploadPreview,
        label: stickerLabel.trim(),
      });
      setUploadPreview(null);
      setStickerLabel('');
      setShowUploadDialog(false);
    }
  };
  
  const handleRemoveCustomSticker = (stickerId: string) => {
    removeCustomSticker(stickerId);
  };

  return {
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
  };
}
