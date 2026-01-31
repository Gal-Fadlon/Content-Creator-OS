import { useMemo, useRef, useState, useCallback } from 'react';
import { useContentItems, useCreateContent, useUpdateContent, useDeleteContent, getStoredGridCount } from '@/hooks/queries/useContent';
import { useSelectedClientId, getLastSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import { uploadFile } from '@/services/storage/uploadService';
import { useToast } from '@/context/SnackbarContext';
import type { ContentType, ContentItem } from '@/types/content';

// Pending upload item shown optimistically in the grid
interface PendingUpload {
  id: string;
  localPreviewUrl: string;
  type: ContentType;
  gridZoom: number;
  gridOffsetX: number;
  gridOffsetY: number;
}

export function useGridContent() {
  const [selectedClientId] = useSelectedClientId();
  const { data: contentItems = [], isLoading: isContentLoading, isPlaceholderData } = useContentItems(selectedClientId);
  const { isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Optimistic UI: pending uploads shown immediately in the grid
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);

  // Track which item is being deleted
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  
  // Get grid content for this client (only source='grid'), sorted by gridOrder
  const realContent = useMemo(() => {
    return contentItems
      .filter(item => item.clientId === selectedClientId && item.source === 'grid')
      .sort((a, b) => {
        if (a.gridOrder !== undefined && b.gridOrder !== undefined) {
          return a.gridOrder - b.gridOrder;
        }
        return 0;
      });
  }, [contentItems, selectedClientId]);

  // Combine real content with pending uploads for optimistic UI
  const clientContent = useMemo(() => {
    // Convert pending uploads to ContentItem-like objects for display
    const pendingItems = pendingUploads.map((pending): ContentItem => ({
      id: pending.id,
      clientId: selectedClientId || '',
      type: pending.type,
      status: 'approved',
      platform: 'instagram',
      date: null,
      caption: '',
      mediaUrl: pending.localPreviewUrl,
      gridOrder: realContent.length + pendingUploads.indexOf(pending),
      gridZoom: pending.gridZoom,
      gridOffsetX: pending.gridOffsetX,
      gridOffsetY: pending.gridOffsetY,
      isUploading: true, // Flag for showing loading overlay
    }));

    return [...realContent, ...pendingItems];
  }, [realContent, pendingUploads, selectedClientId]);
  
  const handleCoverUploadClick = (itemId: string) => {
    if (!isAdmin) return;
    setUploadingFor(itemId);
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor || !selectedClientId) return;
    
    try {
      setIsUploading(true);
      toast({ title: 'מעלה תמונה...', description: 'אנא המתן' });
      const result = await uploadFile(file, {
        clientId: selectedClientId,
        folder: 'content',
      });
      updateContent.mutate({ id: uploadingFor, data: { coverImageUrl: result.url }, clientId: selectedClientId });
      toast({ title: 'הצלחה', description: 'התמונה הועלתה בהצלחה' });
    } catch (error) {
      console.error('Failed to upload cover image:', error);
      toast({ title: 'שגיאה', description: 'העלאת התמונה נכשלה', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    setUploadingFor(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      }
    }
  };
  
  const handleZoomChange = (itemId: string, zoom: number) => {
    updateContent.mutate({ id: itemId, data: { gridZoom: zoom }, clientId: selectedClientId || undefined });
  };

  const handleOffsetChange = (itemId: string, offsetX: number, offsetY: number) => {
    updateContent.mutate({ id: itemId, data: { gridOffsetX: offsetX, gridOffsetY: offsetY }, clientId: selectedClientId || undefined });
  };
  
  const handleAddNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClientId) return;
    
    const url = URL.createObjectURL(file);
    setNewImagePreview(url);
    setNewImageFile(file);
    setShowAddDialog(true);
    
    if (addFileInputRef.current) {
      addFileInputRef.current.value = '';
    }
  };
  
  // Background upload function
  const uploadInBackground = useCallback(async (
    tempId: string,
    file: File,
    clientId: string,
    type: ContentType,
    zoom: number,
    offsetX: number,
    offsetY: number
  ) => {
    try {
      const result = await uploadFile(file, { clientId, folder: 'content' });

      // Remove from pending uploads
      setPendingUploads(prev => prev.filter(p => p.id !== tempId));

      // Create the real content item
      createContent.mutate({
        clientId,
        type,
        source: 'grid',
        status: 'approved',
        platform: 'instagram',
        date: null,
        caption: '',
        mediaUrl: result.url,
        gridOrder: realContent.length,
        gridZoom: zoom,
        gridOffsetX: offsetX,
        gridOffsetY: offsetY,
      }, {
        onSuccess: () => {
          toast({ title: 'הצלחה', description: 'התמונה הועלתה בהצלחה' });
        },
        onError: (error) => {
          console.error('Failed to create content:', error);
          toast({ title: 'שגיאה', description: 'יצירת התוכן נכשלה', variant: 'destructive' });
        },
      });
    } catch (error) {
      // Remove from pending uploads on error
      setPendingUploads(prev => prev.filter(p => p.id !== tempId));
      console.error('Failed to upload image:', error);
      toast({ title: 'שגיאה', description: 'העלאת התמונה נכשלה', variant: 'destructive' });
    }
  }, [createContent, realContent.length, toast]);

  const handleConfirmAddImage = (type: ContentType, zoom = 1, offsetX = 0, offsetY = 0) => {
    if (!newImageFile || !selectedClientId || !newImagePreview) return;

    // Check if auth is ready before attempting upload
    if (isAuthLoading || !isAuthenticated) {
      toast({ title: 'שגיאה', description: 'יש להמתין לטעינת המערכת', variant: 'destructive' });
      return;
    }

    // Generate a temporary ID for the pending upload
    const tempId = `pending-${Date.now()}`;
    const localPreviewUrl = newImagePreview;
    const file = newImageFile;
    const clientId = selectedClientId;

    // Optimistic UI: Add to pending uploads immediately
    setPendingUploads(prev => [...prev, {
      id: tempId,
      localPreviewUrl,
      type,
      gridZoom: zoom,
      gridOffsetX: offsetX,
      gridOffsetY: offsetY,
    }]);

    // Close dialog immediately - user sees the image in grid right away
    setNewImagePreview(null);
    setNewImageFile(null);
    setShowAddDialog(false);

    // Fire upload in background (don't await - intentional fire-and-forget)
    uploadInBackground(tempId, file, clientId, type, zoom, offsetX, offsetY);
  };
  
  const handleCancelAdd = () => {
    setNewImagePreview(null);
    setNewImageFile(null);
    setShowAddDialog(false);
  };
  
  const handleAddButtonClick = () => {
    addFileInputRef.current?.click();
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedClientId) return;

    // Show loading state on the item
    setDeletingItemId(itemId);

    deleteContent.mutate(
      { id: itemId, clientId: selectedClientId },
      {
        onSuccess: () => {
          setDeletingItemId(null);
          toast({ title: 'נמחק!', description: 'התוכן הוסר מהגריד' });
        },
        onError: (error) => {
          setDeletingItemId(null);
          console.error('Failed to delete content:', error);
          toast({ title: 'שגיאה', description: 'המחיקה נכשלה', variant: 'destructive' });
        },
      }
    );
  };

  // Skeleton count for loading state (from localStorage on hard refresh)
  const skeletonCount = useMemo(() => {
    // Use current client ID, or fall back to last selected (for hard refresh)
    const clientIdForCount = selectedClientId || getLastSelectedClientId();
    if (!clientIdForCount) return 6; // Default if no client history
    return getStoredGridCount(clientIdForCount);
  }, [selectedClientId]);

  // Show skeletons when:
  // 1. Auth is still loading (hard refresh)
  // 2. No client selected yet (waiting for clients list to load)
  // 3. Client selected but content is loading without cached data
  const showSkeletons =
    isAuthLoading ||
    !selectedClientId ||
    (isContentLoading && !isPlaceholderData && clientContent.length === 0);

  return {
    isAdmin,
    isAuthLoading,
    isUploading,
    isContentLoading,
    showSkeletons,
    skeletonCount,
    clientContent,
    fileInputRef,
    addFileInputRef,
    showAddDialog,
    setShowAddDialog,
    newImagePreview,
    deletingItemId,
    handleCoverUploadClick,
    handleFileChange,
    handleZoomChange,
    handleOffsetChange,
    handleAddNewImage,
    handleConfirmAddImage,
    handleCancelAdd,
    handleAddButtonClick,
    handleDeleteItem,
  };
}
