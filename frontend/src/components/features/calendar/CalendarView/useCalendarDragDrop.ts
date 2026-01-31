import { useState, useCallback } from 'react';
import { useUpdateContent } from '@/hooks/queries/useContent';
import { useUpdateEvent } from '@/hooks/queries/useEvents';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';

type DragItemType = 'content' | 'event';

export interface CalendarDragDropState {
  draggedItemId: string | null;
  draggedItemType: DragItemType | null;
  dragOverDate: string | null;
  isDropDisabled: boolean;
}

export interface CalendarDragDropActions {
  handleDragStart: (e: React.DragEvent, itemId: string, itemType: DragItemType) => void;
  handleDragOver: (e: React.DragEvent, date: Date, hasEventOnDate: boolean) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, date: Date, hasEventOnDate: boolean) => void;
  handleDragEnd: () => void;
}

export function useCalendarDragDrop(): CalendarDragDropState & CalendarDragDropActions {
  const updateContent = useUpdateContent();
  const updateEvent = useUpdateEvent();
  const { isAdmin } = useAuth();
  const [selectedClientId] = useSelectedClientId();
  
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<DragItemType | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  
  const handleDragStart = useCallback((e: React.DragEvent, itemId: string, itemType: DragItemType) => {
    if (!isAdmin) return;
    e.stopPropagation();
    setDraggedItemId(itemId);
    setDraggedItemType(itemType);
    e.dataTransfer.effectAllowed = 'move';
  }, [isAdmin]);
  
  const handleDragOver = useCallback((e: React.DragEvent, date: Date, hasEventOnDate: boolean) => {
    if (!isAdmin || !draggedItemId) return;
    e.stopPropagation();
    
    const dateStr = date.toISOString().split('T')[0];
    
    // If dragging an event and target date already has an event, disable drop
    if (draggedItemType === 'event' && hasEventOnDate) {
      e.dataTransfer.dropEffect = 'none';
      setIsDropDisabled(true);
      setDragOverDate(dateStr);
      return;
    }
    
    e.preventDefault();
    setIsDropDisabled(false);
    setDragOverDate(dateStr);
  }, [isAdmin, draggedItemId, draggedItemType]);
  
  const handleDragLeave = useCallback(() => {
    setDragOverDate(null);
    setIsDropDisabled(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent, date: Date, hasEventOnDate: boolean) => {
    if (!isAdmin || !draggedItemId || !draggedItemType) return;
    
    // If dragging an event and target date already has an event, don't allow drop
    if (draggedItemType === 'event' && hasEventOnDate) {
      setDraggedItemId(null);
      setDraggedItemType(null);
      setDragOverDate(null);
      setIsDropDisabled(false);
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const newDate = date.toISOString().split('T')[0];
    
    if (draggedItemType === 'content') {
      updateContent.mutate({ id: draggedItemId, data: { date: newDate }, clientId: selectedClientId || undefined });
    } else {
      updateEvent.mutate({ id: draggedItemId, data: { date: newDate } });
    }

    setDraggedItemId(null);
    setDraggedItemType(null);
    setDragOverDate(null);
    setIsDropDisabled(false);
  }, [isAdmin, draggedItemId, draggedItemType, updateContent, updateEvent, selectedClientId]);
  
  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
    setDraggedItemType(null);
    setDragOverDate(null);
    setIsDropDisabled(false);
  }, []);
  
  return {
    draggedItemId,
    draggedItemType,
    dragOverDate,
    isDropDisabled,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
