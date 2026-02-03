import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useContentModal as useContentModalContext, useUploadingState } from '@/context/providers/ModalProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useContentItems, useCreateContent, useUpdateContent, useDeleteContent } from '@/hooks/queries/useContent';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/queries/useEvents';
import { useToast } from '@/context/SnackbarContext';
import { isContentItem, isEventItem } from './contentModal.helper.ts';
import { CONTENT_MODAL, COMMON } from '@/constants/strings.constants';
import { uploadFile } from '@/services/storage/uploadService';
import { services } from '@/services/services';
import { queryKeys } from '@/services/queryKeys';
import type { ContentType, ContentStatus, MarkerColor, ModalMode, ContentMedia } from '@/types/content';
import type { PendingMedia } from '../MultiMediaUpload/MultiMediaUpload';

export function useContentModal() {
  const queryClient = useQueryClient();
  const { isOpen, selectedDate, editItemId, close } = useContentModalContext();
  const { isAdmin, isLoading: isAuthLoading, isAuthenticated, session } = useAuth();
  const [selectedClientId] = useSelectedClientId();
  const { addUploadingDate, removeUploadingDate, addDeletingDate, removeDeletingDate } = useUploadingState();
  const { data: contentItems = [] } = useContentItems(selectedClientId);
  const { data: events = [] } = useEvents(selectedClientId);

  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const deleteContent = useDeleteContent();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  
  // Get item by ID
  const item = useMemo(() => {
    if (!editItemId) return null;
    const content = contentItems.find(i => i.id === editItemId);
    if (content) return content;
    return events.find(e => e.id === editItemId) || null;
  }, [contentItems, events, editItemId]);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Content form state
  const [mode, setMode] = useState<ModalMode>('media');
  const [contentType, setContentType] = useState<ContentType>('reel');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [caption, setCaption] = useState('');
  const [creativeDescription, setCreativeDescription] = useState('');

  // Multi-media state
  const [existingMedia, setExistingMedia] = useState<ContentMedia[]>([]);
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]); // IDs of existing media to delete

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventColor, setEventColor] = useState<MarkerColor>('black');

  // Upload state
  const [isUploading] = useState(false);
  
  const isEditing = !!item;
  
  // Initialize form state when editing an existing item
  useEffect(() => {
    if (item) {
      if (isContentItem(item)) {
        setMode('media');
        setContentType(item.type);
        setStatus(item.status);
        setCaption(item.caption || '');
        setCreativeDescription(item.creativeDescription || '');
        // Load existing media
        setExistingMedia(item.media || []);
        setPendingMedia([]);
        setMediaToRemove([]);
      } else if (isEventItem(item)) {
        setMode('event');
        setEventTitle(item.title);
        setEventDescription(item.description || '');
        setEventColor(item.color);
      }
    }
  }, [item]);

  const resetForm = () => {
    setCaption('');
    setCreativeDescription('');
    setEventTitle('');
    setEventDescription('');
    setExistingMedia([]);
    setPendingMedia([]);
    setMediaToRemove([]);
    setMode('media');
    setContentType('reel');
    setStatus('draft');
    setEventColor('black');
  };
  
  const handleClose = () => {
    // Blur active element to prevent aria-hidden warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    close();
    resetForm();
  };
  
  const handleDelete = () => {
    if (!item || !selectedClientId) return;

    // Get the date for the skeleton overlay
    const isContent = isContentItem(item);
    const itemId = item.id;
    const itemDate = isContent ? item.date : (item as { date: string }).date;

    // Add deleting state for the calendar day
    if (itemDate) {
      addDeletingDate(itemDate);
    }

    // Close modal immediately
    handleClose();

    // Helper to cleanup deleting state
    const cleanup = () => {
      if (itemDate) {
        removeDeletingDate(itemDate);
      }
    };

    // Run deletion in background
    if (isContent) {
      deleteContent.mutate(
        { id: itemId, clientId: selectedClientId, accessToken: session?.access_token },
        {
          onSuccess: () => {
            cleanup();
            toast({ title: CONTENT_MODAL.delete.success, description: CONTENT_MODAL.delete.contentDeleted });
          },
          onError: (error) => {
            cleanup();
            console.error('Failed to delete content:', error);
            toast({ title: COMMON.error, description: 'המחיקה נכשלה', variant: 'destructive' });
          },
        }
      );
    } else {
      deleteEvent.mutate(
        { id: itemId, clientId: selectedClientId },
        {
          onSuccess: () => {
            cleanup();
            toast({ title: CONTENT_MODAL.delete.success, description: CONTENT_MODAL.delete.eventDeleted });
          },
          onError: (error) => {
            cleanup();
            console.error('Failed to delete event:', error);
            toast({ title: COMMON.error, description: 'המחיקה נכשלה', variant: 'destructive' });
          },
        }
      );
    }
  };
  
  const handleCopyCaption = () => {
    const textToCopy = isContentItem(item!) ? item.caption : '';
    void window.navigator.clipboard.writeText(textToCopy);
    toast({ title: CONTENT_MODAL.copy.success, description: CONTENT_MODAL.copy.captionCopied });
  };
  
  const handleApprove = () => {
    if (item && isContentItem(item)) {
      updateContent.mutate(
        { id: item.id, data: { status: 'approved' } },
        {
          onSuccess: () => {
            toast({ title: CONTENT_MODAL.approve.success, description: CONTENT_MODAL.approve.contentApproved });
            // Don't close modal - user might want to add a comment
          },
        }
      );
    }
  };

  const handleReject = (reason?: string) => {
    if (item && isContentItem(item)) {
      updateContent.mutate(
        { id: item.id, data: { status: 'rejected', rejectionReason: reason } },
        {
          onSuccess: () => {
            toast({ title: CONTENT_MODAL.reject.success, description: CONTENT_MODAL.reject.contentRejected });
            // Don't close modal - user might want to add a comment
          },
        }
      );
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleAddFiles(Array.from(files));
  };

  // Multi-media handlers
  const handleAddFiles = useCallback((files: File[]) => {
    const newPending: PendingMedia[] = files.map(file => ({
      id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      file,
      previewUrl: window.URL.createObjectURL(file),
      isUploading: false,
    }));

    setPendingMedia(prev => [...prev, ...newPending]);

    toast({
      title: CONTENT_MODAL.file.selected,
      description: files.length === 1 ? files[0].name : `${files.length} קבצים נבחרו`
    });
  }, [toast]);

  const handleRemoveExisting = useCallback((mediaId: string) => {
    setMediaToRemove(prev => [...prev, mediaId]);
    setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
  }, []);

  const handleRemovePending = useCallback((pendingId: string) => {
    setPendingMedia(prev => {
      const item = prev.find(p => p.id === pendingId);
      if (item) {
        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter(p => p.id !== pendingId);
    });
  }, []);

  const handleReorderExisting = useCallback((mediaIds: string[]) => {
    setExistingMedia(prev => {
      const mediaMap = new Map(prev.map(m => [m.id, m]));
      return mediaIds.map(id => mediaMap.get(id)).filter((m): m is ContentMedia => !!m);
    });
  }, []);

  const handleReorderPending = useCallback((pendingIds: string[]) => {
    setPendingMedia(prev => {
      const mediaMap = new Map(prev.map(p => [p.id, p]));
      return pendingIds.map(id => mediaMap.get(id)).filter((p): p is PendingMedia => !!p);
    });
  }, []);

  const handleSave = () => {
    if (!selectedClientId) {
      toast({ title: COMMON.error, description: CONTENT_MODAL.save.noClientSelected, variant: 'destructive' });
      return;
    }

    // Check if auth is ready before attempting upload
    if (isAuthLoading || !isAuthenticated) {
      toast({ title: COMMON.error, description: 'יש להמתין לטעינת המערכת', variant: 'destructive' });
      return;
    }

    if (mode === 'media') {
      // Store values before closing (they'll be reset)
      const currentPendingMedia = [...pendingMedia];
      const currentExistingMedia = [...existingMedia]; // Store current order for reordering
      const currentMediaToRemove = [...mediaToRemove];
      const currentContentType = contentType;
      const currentStatus = status;
      const currentCaption = caption;
      const currentCreativeDescription = creativeDescription;
      const currentItem = item;
      const currentIsEditing = isEditing;

      // Use the item's date when editing, otherwise use selectedDate or today
      const itemDate = currentIsEditing && isContentItem(currentItem!) ? currentItem.date : null;
      const dateStr = itemDate || selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];

      // Close modal immediately for better UX
      handleClose();

      // If there are files to upload, show skeleton and run in background
      const hasFilesToUpload = currentPendingMedia.length > 0;

      if (hasFilesToUpload) {
        addUploadingDate(dateStr);

        // Failsafe: Remove uploading state after max 90 seconds no matter what
        const failsafeTimeout = setTimeout(() => {
          console.warn('Upload failsafe timeout reached - removing skeleton');
          removeUploadingDate(dateStr);
          toast({ title: COMMON.error, description: 'העלאה נכשלה - נסה שוב', variant: 'destructive' });
        }, 90000);

        // Helper to clear failsafe and remove uploading state
        const cleanupUpload = (success: boolean, message?: string) => {
          clearTimeout(failsafeTimeout);
          removeUploadingDate(dateStr);
          if (success) {
            toast({ title: CONTENT_MODAL.save.success, description: CONTENT_MODAL.save.contentSaved });
          } else if (message) {
            toast({ title: COMMON.error, description: message, variant: 'destructive' });
          }
        };

        // Run uploads in background
        const accessToken = session?.access_token;

        // Upload files SEQUENTIALLY to avoid connection issues
        // Concurrent uploads can hang due to browser connection limits or network issues
        const uploadFilesSequentially = async () => {
          const results: { url: string; key: string; mediaType: 'image' | 'video' }[] = [];

          for (const pending of currentPendingMedia) {
            console.log('[Upload] Uploading file:', pending.file.name);
            const result = await uploadFile(pending.file, {
              clientId: selectedClientId,
              folder: 'content',
              accessToken,
            });
            results.push({
              url: result.url,
              key: result.key,
              mediaType: pending.file.type.startsWith('video') ? 'video' as const : 'image' as const,
            });
            console.log('[Upload] File completed:', pending.file.name);
          }

          return results;
        };

        uploadFilesSequentially()
          .then(async (uploadedMedia) => {
            console.log('All uploads successful:', uploadedMedia.length, 'files');

            // Delete removed media from R2
            for (const mediaId of currentMediaToRemove) {
              try {
                await services.contentMedia.removeMedia(mediaId, accessToken);
              } catch (err) {
                console.warn('Failed to remove media:', mediaId, err);
              }
            }

            // Save content
            if (currentIsEditing && isContentItem(currentItem!)) {
              // Update existing content
              updateContent.mutate(
                {
                  id: currentItem.id,
                  data: {
                    type: currentContentType,
                    status: currentStatus,
                    caption: currentCaption,
                    creativeDescription: currentCreativeDescription,
                  },
                },
                {
                  onSuccess: async () => {
                    // Reorder existing media if order changed
                    if (currentExistingMedia.length > 0) {
                      try {
                        await services.contentMedia.reorderMedia(
                          currentItem.id,
                          currentExistingMedia.map(m => m.id)
                        );
                      } catch (err) {
                        console.error('Failed to reorder media:', err);
                      }
                    }

                    // Add new media to content_media table
                    for (const media of uploadedMedia) {
                      try {
                        await services.contentMedia.addMedia(
                          currentItem.id,
                          media.url,
                          media.mediaType,
                          media.key
                        );
                      } catch (err) {
                        console.error('Failed to add media to content:', err);
                      }
                    }
                    // Invalidate cache AFTER media is added so it includes the media
                    await queryClient.invalidateQueries({
                      queryKey: queryKeys.content.all(currentItem.clientId),
                    });
                    cleanupUpload(true);
                  },
                  onError: (error) => {
                    console.error('Failed to update content:', error);
                    cleanupUpload(false, CONTENT_MODAL.save.contentSaveFailed);
                  },
                }
              );
            } else {
              // Create new content
              createContent.mutate(
                {
                  clientId: selectedClientId,
                  type: currentContentType,
                  source: 'calendar',
                  status: currentStatus,
                  platform: 'instagram',
                  date: dateStr,
                  caption: currentCaption,
                  creativeDescription: currentCreativeDescription,
                },
                {
                  onSuccess: async (newContent) => {
                    // Add media to content_media table
                    for (const media of uploadedMedia) {
                      try {
                        await services.contentMedia.addMedia(
                          newContent.id,
                          media.url,
                          media.mediaType,
                          media.key
                        );
                      } catch (err) {
                        console.error('Failed to add media to content:', err);
                      }
                    }
                    // Invalidate cache AFTER media is added so it includes the media
                    await queryClient.invalidateQueries({
                      queryKey: queryKeys.content.all(newContent.clientId),
                    });
                    cleanupUpload(true);
                  },
                  onError: (error) => {
                    console.error('Failed to create content:', error);
                    cleanupUpload(false, CONTENT_MODAL.save.contentCreateFailed);
                  },
                }
              );
            }
          })
          .catch((error) => {
            console.error('Failed to upload files:', error);
            cleanupUpload(false, error?.message || 'העלאת הקבצים נכשלה');
          });
      } else {
        // No files to upload, just save the content (update metadata, remove media, or reorder)
        const accessToken = session?.access_token;

        // Delete removed media from R2
        const deleteRemovedMedia = async () => {
          for (const mediaId of currentMediaToRemove) {
            try {
              await services.contentMedia.removeMedia(mediaId, accessToken);
            } catch (err) {
              console.warn('Failed to remove media:', mediaId, err);
            }
          }
        };

        // Reorder existing media
        const reorderExistingMedia = async (contentId: string) => {
          if (currentExistingMedia.length > 0) {
            try {
              await services.contentMedia.reorderMedia(
                contentId,
                currentExistingMedia.map(m => m.id)
              );
            } catch (err) {
              console.warn('Failed to reorder media:', err);
            }
          }
        };

        if (currentIsEditing && isContentItem(currentItem!)) {
          updateContent.mutate(
            {
              id: currentItem.id,
              data: {
                type: currentContentType,
                status: currentStatus,
                caption: currentCaption,
                creativeDescription: currentCreativeDescription,
              },
            },
            {
              onSuccess: async () => {
                await deleteRemovedMedia();
                await reorderExistingMedia(currentItem.id);
                // Invalidate cache to reflect reordering
                await queryClient.invalidateQueries({
                  queryKey: queryKeys.content.all(currentItem.clientId),
                });
                toast({ title: CONTENT_MODAL.save.success, description: CONTENT_MODAL.save.contentSaved });
              },
              onError: (error) => {
                console.error('Failed to update content:', error);
                toast({ title: COMMON.error, description: CONTENT_MODAL.save.contentSaveFailed, variant: 'destructive' });
              },
            }
          );
        } else {
          createContent.mutate(
            {
              clientId: selectedClientId,
              type: currentContentType,
              source: 'calendar',
              status: currentStatus,
              platform: 'instagram',
              date: dateStr,
              caption: currentCaption,
              creativeDescription: currentCreativeDescription,
            },
            {
              onSuccess: () => {
                toast({ title: CONTENT_MODAL.save.success, description: CONTENT_MODAL.save.contentSaved });
              },
              onError: (error) => {
                console.error('Failed to create content:', error);
                toast({ title: COMMON.error, description: CONTENT_MODAL.save.contentCreateFailed, variant: 'destructive' });
              },
            }
          );
        }
      }
    } else {
      const dateStr = selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      
      if (isEditing && isEventItem(item!)) {
        updateEvent.mutate(
          {
            id: item.id,
            data: {
              title: eventTitle,
              description: eventDescription,
              color: eventColor,
            },
          },
          {
            onSuccess: () => {
              toast({ title: CONTENT_MODAL.save.success, description: CONTENT_MODAL.save.eventSaved });
              handleClose();
            },
            onError: (error) => {
              console.error('Failed to update event:', error);
              toast({ title: COMMON.error, description: CONTENT_MODAL.save.eventSaveFailed, variant: 'destructive' });
            },
          }
        );
      } else {
        createEvent.mutate(
          {
            clientId: selectedClientId,
            title: eventTitle,
            description: eventDescription,
            date: dateStr,
            color: eventColor,
          },
          {
            onSuccess: () => {
              toast({ title: CONTENT_MODAL.save.success, description: CONTENT_MODAL.save.eventSaved });
              handleClose();
            },
            onError: (error) => {
              console.error('Failed to create event:', error);
              toast({ title: COMMON.error, description: CONTENT_MODAL.save.eventCreateFailed, variant: 'destructive' });
            },
          }
        );
      }
    }
  };
  
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const displayDate = selectedDate || (item ? new Date(isContentItem(item) ? item.date : item.date) : new Date());
  
  return {
    // State
    isOpen,
    isEditing,
    isAdmin,
    isUploading,
    item,
    mode,
    displayDate,
    fileInputRef,

    // Content form state
    contentType,
    status,
    caption,
    creativeDescription,

    // Multi-media state
    existingMedia,
    pendingMedia,

    // Event form state
    eventTitle,
    eventDescription,
    eventColor,

    // Setters
    setMode,
    setContentType,
    setStatus,
    setCaption,
    setCreativeDescription,
    setEventTitle,
    setEventDescription,
    setEventColor,

    // Handlers
    handleClose,
    handleDelete,
    handleCopyCaption,
    handleApprove,
    handleReject,
    handleFileChange,
    handleAddFiles,
    handleRemoveExisting,
    handleRemovePending,
    handleReorderExisting,
    handleReorderPending,
    handleSave,
    formatDate,
  };
}
