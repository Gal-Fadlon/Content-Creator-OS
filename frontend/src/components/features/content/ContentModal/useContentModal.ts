import { useState, useRef, useEffect, useMemo } from 'react';
import { useContentModal as useContentModalContext } from '@/context/providers/ModalProvider';
import { useAuth } from '@/context/providers/AuthProvider';
import { useSelectedClientId } from '@/context/providers/SelectedClientProvider';
import { useContentItems, useCreateContent, useUpdateContent, useDeleteContent } from '@/hooks/queries/useContent';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/queries/useEvents';
import { useToast } from '@/context/SnackbarContext';
import { isContentItem, isEventItem } from './ContentModal.helper';
import type { ContentType, ContentStatus, MarkerColor, ModalMode } from '@/types/content';

export interface ContentFormState {
  mode: ModalMode;
  contentType: ContentType;
  status: ContentStatus;
  caption: string;
  creativeDescription: string;
  mediaFile: File | null;
  mediaPreview: string | null;
}

export interface EventFormState {
  eventTitle: string;
  eventDescription: string;
  eventColor: MarkerColor;
}

export function useContentModal() {
  const { isOpen, selectedDate, editItemId, close } = useContentModalContext();
  const { isAdmin } = useAuth();
  const [selectedClientId] = useSelectedClientId();
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
    close();
    resetForm();
  };
  
  const handleDelete = () => {
    if (!item || !selectedClientId) return;
    
    if (isContentItem(item)) {
      deleteContent.mutate(
        { id: item.id, clientId: selectedClientId },
        {
          onSuccess: () => {
            toast({ title: 'נמחק!', description: 'התוכן נמחק בהצלחה' });
            handleClose();
          },
        }
      );
    } else if (isEventItem(item)) {
      deleteEvent.mutate(
        { id: item.id, clientId: selectedClientId },
        {
          onSuccess: () => {
            toast({ title: 'נמחק!', description: 'האירוע נמחק בהצלחה' });
            handleClose();
          },
        }
      );
    }
  };
  
  const handleCopyCaption = () => {
    const textToCopy = isContentItem(item!) ? item.caption : '';
    navigator.clipboard.writeText(textToCopy);
    toast({ title: 'הועתק!', description: 'הקופי הועתק ללוח' });
  };
  
  const handleApprove = () => {
    if (item && isContentItem(item)) {
      updateContent.mutate(
        { id: item.id, data: { status: 'approved' } },
        {
          onSuccess: () => {
            toast({ title: 'אושר!', description: 'התוכן אושר לפרסום' });
            handleClose();
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
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    
    toast({ 
      title: 'קובץ נבחר', 
      description: file.name 
    });
  };
  
  const handleSave = () => {
    if (!selectedClientId) return;
    
    if (mode === 'media') {
      const dateStr = selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      
      if (isEditing && isContentItem(item!)) {
        updateContent.mutate(
          {
            id: item.id,
            data: {
              status,
              caption,
              creativeDescription,
              mediaUrl: mediaPreview || item.mediaUrl,
            },
          },
          {
            onSuccess: () => {
              toast({ title: 'נשמר!', description: 'התוכן נשמר בהצלחה' });
              handleClose();
            },
          }
        );
      } else {
        createContent.mutate(
          {
            clientId: selectedClientId,
            type: contentType,
            status,
            platform: 'instagram',
            date: dateStr,
            caption,
            creativeDescription,
            mediaUrl: mediaPreview || undefined,
            mediaType: mediaFile?.type.startsWith('video') ? 'video' : 'image',
          },
          {
            onSuccess: () => {
              toast({ title: 'נשמר!', description: 'התוכן נשמר בהצלחה' });
              handleClose();
            },
          }
        );
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
              toast({ title: 'נשמר!', description: 'האירוע נשמר בהצלחה' });
              handleClose();
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
              toast({ title: 'נשמר!', description: 'האירוע נשמר בהצלחה' });
              handleClose();
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
    handleFileClick,
    handleFileChange,
    handleSave,
    formatDate,
  };
}
