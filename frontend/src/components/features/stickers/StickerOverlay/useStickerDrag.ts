import React, { useState, useCallback } from 'react';
import { useMonthlyState } from '@/context/providers/MonthlyStateProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import type { PlacedSticker } from '@/types/content';

interface DragOffset {
  x: number;
  y: number;
}

export function useStickerDrag() {
  const { currentMonthState, setStickers } = useMonthlyState();
  const { isAdmin } = useAuth();
  
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  
  const stickers = currentMonthState.stickers;
  
  const removeSticker = useCallback((visibleId: string) => {
    setStickers(stickers.filter(s => s.visibleId !== visibleId));
  }, [stickers, setStickers]);

  const handleMouseDown = useCallback((e: React.MouseEvent, sticker: PlacedSticker) => {
    if (!isAdmin) return;
    e.preventDefault();
    setDragging(sticker.visibleId);
    setDragOffset({
      x: e.clientX - sticker.x,
      y: e.clientY - sticker.y,
    });
  }, [isAdmin]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    
    const newStickers = stickers.map(s => 
      s.visibleId === dragging 
        ? { ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
        : s
    );
    setStickers(newStickers);
  }, [dragging, dragOffset, stickers, setStickers]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  return {
    dragging,
    isAdmin,
    stickers,
    removeSticker,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
