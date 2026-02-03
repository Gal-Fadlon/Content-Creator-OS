import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useContentModal as useContentModalContext, useUploadingState } from '@/context/providers/ModalProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useContentItems, useCreateContent, useUpdateContent, useDeleteContent } from '@/hooks/queries/useContent';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/queries/useEvents';
import { useToast } from '@/context/SnackbarContext';
import { isContentItem, isEventItem } from './ContentModal.helper';
import { CONTENT_MODAL, COMMON } from '@/constants/strings.constants';
import { uploadFile, deleteFile } from '@/services/storage/uploadService';
import type { ContentType, ContentStatus, MarkerColor, ModalMode } from '@/types/content';

export function useContentModal() {
  const { isOpen, selectedDate, editItemId, close } = useContentModalContext();
  const { isAdmin, isLoading: isAuthLoading, isAuthenticated, session } = useAuth();
  const [selectedClientId] = useSelectedClientId();
  const { addUploadingDate, removeUploadingDate } = useUploadingState();
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
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
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
        setMediaPreview(item.mediaUrl || null);
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
    setMediaFile(null);
    setMediaPreview(null);
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
    
    // Optimistic UI: Close modal immediately
    const isContent = isContentItem(item);
    const itemId = item.id;
    
    handleClose();
    
    // Run deletion in background, show toast only when complete
    if (isContent) {
      deleteContent.mutate(
        { id: itemId, clientId: selectedClientId, accessToken: session?.access_token },
        {
          onSuccess: () => {
            toast({ title: CONTENT_MODAL.delete.success, description: CONTENT_MODAL.delete.contentDeleted });
          },
          onError: (error) => {
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
            toast({ title: CONTENT_MODAL.delete.success, description: CONTENT_MODAL.delete.eventDeleted });
          },
          onError: (error) => {
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
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    const url = window.URL.createObjectURL(file);
    setMediaPreview(url);

    toast({
      title: CONTENT_MODAL.file.selected,
      description: file.name
    });
  };

  const handleFileDrop = (file: File) => {
    setMediaFile(file);
    const url = window.URL.createObjectURL(file);
    setMediaPreview(url);

    toast({
      title: CONTENT_MODAL.file.selected,
      description: file.name
    });
  };
  
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
      const currentMediaFile = mediaFile;
      const currentContentType = contentType;
      const currentStatus = status;
      const currentCaption = caption;
      const currentCreativeDescription = creativeDescription;
      const currentItem = item;
      const currentIsEditing = isEditing;
      const oldMediaUrl = currentIsEditing && isContentItem(currentItem!) ? currentItem.mediaUrl : null;

      // Use the item's date when editing, otherwise use selectedDate or today
      const itemDate = currentIsEditing && isContentItem(currentItem!) ? currentItem.date : null;
      const dateStr = itemDate || selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      
      // Close modal immediately for better UX
      handleClose();
      
      // If there's a file to upload, show skeleton and run in background
      if (currentMediaFile) {
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

        // Run upload in background
        console.log('Starting upload for date:', dateStr);
        const accessToken = session?.access_token;
        uploadFile(currentMediaFile, {
          clientId: selectedClientId,
          folder: 'content',
          accessToken,
        })
          .then(async (result) => {
            console.log('Upload successful, URL:', result.url);
            const finalMediaUrl = result.url;

            // Validate we got a URL
            if (!finalMediaUrl) {
              throw new Error('No URL returned from upload');
            }

            // Delete old file from R2 only after successful upload
            if (oldMediaUrl && finalMediaUrl) {
              try {
                const urlParts = new URL(oldMediaUrl);
                const key = urlParts.pathname.startsWith('/')
                  ? urlParts.pathname.slice(1)
                  : urlParts.pathname;
                await deleteFile(key, accessToken);
                console.log('Successfully deleted old file from R2:', key);
              } catch (deleteError) {
                console.error('Failed to delete old file from R2:', deleteError);
              }
            }

            // Save content with uploaded URL
            if (currentIsEditing && isContentItem(currentItem!)) {
              updateContent.mutate(
                {
                  id: currentItem.id,
                  data: {
                    status: currentStatus,
                    caption: currentCaption,
                    creativeDescription: currentCreativeDescription,
                    mediaUrl: finalMediaUrl,
                  },
                },
                {
                  onSuccess: () => cleanupUpload(true),
                  onError: (error) => {
                    console.error('Failed to update content:', error);
                    cleanupUpload(false, CONTENT_MODAL.save.contentSaveFailed);
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
                  mediaUrl: finalMediaUrl,
                  mediaType: currentMediaFile.type.startsWith('video') ? 'video' : 'image',
                },
                {
                  onSuccess: () => cleanupUpload(true),
                  onError: (error) => {
                    console.error('Failed to create content:', error);
                    cleanupUpload(false, CONTENT_MODAL.save.contentCreateFailed);
                  },
                }
              );
            }
          })
          .catch((error) => {
            console.error('Failed to upload file:', error);
            cleanupUpload(false, error?.message || 'העלאת הקובץ נכשלה');
          });
      } else {
        // No file to upload, just save the content
        if (currentIsEditing && isContentItem(currentItem!)) {
          updateContent.mutate(
            {
              id: currentItem.id,
              data: {
                status: currentStatus,
                caption: currentCaption,
                creativeDescription: currentCreativeDescription,
                mediaUrl: currentItem.mediaUrl,
              },
            },
            {
              onSuccess: () => {
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
    mediaFile,
    mediaPreview,
    
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
    handleFileClick,
    handleFileChange,
    handleFileDrop,
    handleSave,
    formatDate,
  };
}
