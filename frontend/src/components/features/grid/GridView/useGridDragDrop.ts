import { useState, useCallback } from 'react';
import { useUpdateContent } from '@/hooks/queries/useContent';
import { useAuth } from '@/context/providers/AuthProvider';
import type { ContentItem } from '@/types/content';

export function useGridDragDrop(clientContent: ContentItem[]) {
  const updateContent = useUpdateContent();
  const { isAdmin } = useAuth();
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  
  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    if (!isAdmin) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  }, [isAdmin]);
  
  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (!isAdmin || itemId === draggedItem) return;
    setDragOverItem(itemId);
  }, [isAdmin, draggedItem]);
  
  const handleDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!isAdmin || !draggedItem || draggedItem === targetId) return;
    
    const draggedIndex = clientContent.findIndex(item => item.id === draggedItem);
    const targetIndex = clientContent.findIndex(item => item.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newOrder = [...clientContent];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    
    newOrder.forEach((item, index) => {
      updateContent.mutate({ id: item.id, data: { gridOrder: index } });
    });
    
    setDraggedItem(null);
    setDragOverItem(null);
  }, [isAdmin, draggedItem, clientContent, updateContent]);
  
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  return {
    isAdmin,
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
}
