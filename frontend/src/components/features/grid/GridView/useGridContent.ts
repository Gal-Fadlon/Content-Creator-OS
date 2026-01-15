import { useMemo, useRef, useState } from 'react';
import { useContentItems, useCreateContent, useUpdateContent } from '@/hooks/queries/useContent';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import type { ContentType } from '@/types/content';

export function useGridContent() {
  const { data: contentItems = [] } = useContentItems(useSelectedClientId()[0]);
  const [selectedClientId] = useSelectedClientId();
  const { isAdmin } = useAuth();
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  
  // Get approved content for this client, sorted by gridOrder or date
  const clientContent = useMemo(() => {
    return contentItems
      .filter(item => item.clientId === selectedClientId && item.status === 'approved')
      .sort((a, b) => {
        if (a.gridOrder !== undefined && b.gridOrder !== undefined) {
          return a.gridOrder - b.gridOrder;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [contentItems, selectedClientId]);
  
  const handleCoverUploadClick = (itemId: string) => {
    if (!isAdmin) return;
    setUploadingFor(itemId);
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;
    
    const url = URL.createObjectURL(file);
    updateContent.mutate({ id: uploadingFor, data: { coverImageUrl: url } });
    
    setUploadingFor(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleZoomChange = (itemId: string, zoom: number) => {
    updateContent.mutate({ id: itemId, data: { gridZoom: zoom } });
  };
  
  const handleOffsetChange = (itemId: string, offsetX: number, offsetY: number) => {
    updateContent.mutate({ id: itemId, data: { gridOffsetX: offsetX, gridOffsetY: offsetY } });
  };
  
  const handleAddNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClientId) return;
    
    const url = URL.createObjectURL(file);
    setNewImagePreview(url);
    setShowAddDialog(true);
    
    if (addFileInputRef.current) {
      addFileInputRef.current.value = '';
    }
  };
  
  const handleConfirmAddImage = (type: ContentType, zoom = 1, offsetX = 0, offsetY = 0) => {
    if (!newImagePreview || !selectedClientId) return;
    
    const nextOrder = clientContent.length;
    
    createContent.mutate({
      clientId: selectedClientId,
      type,
      status: 'approved',
      platform: 'instagram',
      date: new Date().toISOString().split('T')[0],
      caption: '',
      mediaUrl: newImagePreview,
      gridOrder: nextOrder,
      gridZoom: zoom,
      gridOffsetX: offsetX,
      gridOffsetY: offsetY,
    });
    
    setNewImagePreview(null);
    setShowAddDialog(false);
  };
  
  const handleCancelAdd = () => {
    setNewImagePreview(null);
    setShowAddDialog(false);
  };
  
  const handleAddButtonClick = () => {
    addFileInputRef.current?.click();
  };

  return {
    isAdmin,
    clientContent,
    fileInputRef,
    addFileInputRef,
    showAddDialog,
    setShowAddDialog,
    newImagePreview,
    handleCoverUploadClick,
    handleFileChange,
    handleZoomChange,
    handleOffsetChange,
    handleAddNewImage,
    handleConfirmAddImage,
    handleCancelAdd,
    handleAddButtonClick,
  };
}
