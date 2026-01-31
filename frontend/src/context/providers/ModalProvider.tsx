/**
 * Modal Provider
 * Manages modal open/close state for content and event request modals
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface ContentModalState {
  isOpen: boolean;
  selectedDate: Date | null;
  editItemId: string | null;
}

interface UploadingState {
  uploadingDates: string[];
}

interface EventRequestModalState {
  isOpen: boolean;
  initialDate: Date | null;
}

interface ModalState {
  contentModal: ContentModalState;
  eventRequestModal: EventRequestModalState;
  uploading: UploadingState;
}

interface ModalActions {
  // Content modal
  openContentModalForDate: (date: Date) => void;
  openContentModalForEdit: (itemId: string) => void;
  closeContentModal: () => void;
  // Event request modal
  openEventRequestModal: (date?: Date) => void;
  closeEventRequestModal: () => void;
  // Uploading state
  addUploadingDate: (dateStr: string) => void;
  removeUploadingDate: (dateStr: string) => void;
}

type ModalContextValue = ModalState & ModalActions;

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

const initialContentModal: ContentModalState = {
  isOpen: false,
  selectedDate: null,
  editItemId: null,
};

const initialEventRequestModal: EventRequestModalState = {
  isOpen: false,
  initialDate: null,
};

const initialUploading: UploadingState = {
  uploadingDates: [],
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [contentModal, setContentModal] = useState<ContentModalState>(initialContentModal);
  const [eventRequestModal, setEventRequestModal] = useState<EventRequestModalState>(initialEventRequestModal);
  const [uploading, setUploading] = useState<UploadingState>(initialUploading);

  // Content modal actions
  const openContentModalForDate = useCallback((date: Date) => {
    setContentModal({
      isOpen: true,
      selectedDate: date,
      editItemId: null,
    });
  }, []);

  const openContentModalForEdit = useCallback((itemId: string) => {
    setContentModal({
      isOpen: true,
      selectedDate: null,
      editItemId: itemId,
    });
  }, []);

  const closeContentModal = useCallback(() => {
    setContentModal(initialContentModal);
  }, []);

  // Event request modal actions
  const openEventRequestModal = useCallback((date?: Date) => {
    setEventRequestModal({
      isOpen: true,
      initialDate: date ?? null,
    });
  }, []);

  const closeEventRequestModal = useCallback(() => {
    setEventRequestModal(initialEventRequestModal);
  }, []);

  // Uploading state actions
  const addUploadingDate = useCallback((dateStr: string) => {
    setUploading(prev => ({
      uploadingDates: [...prev.uploadingDates, dateStr],
    }));
  }, []);

  const removeUploadingDate = useCallback((dateStr: string) => {
    setUploading(prev => ({
      uploadingDates: prev.uploadingDates.filter(d => d !== dateStr),
    }));
  }, []);

  const value = useMemo<ModalContextValue>(() => ({
    contentModal,
    eventRequestModal,
    uploading,
    openContentModalForDate,
    openContentModalForEdit,
    closeContentModal,
    openEventRequestModal,
    closeEventRequestModal,
    addUploadingDate,
    removeUploadingDate,
  }), [
    contentModal,
    eventRequestModal,
    uploading,
    openContentModalForDate,
    openContentModalForEdit,
    closeContentModal,
    openEventRequestModal,
    closeEventRequestModal,
    addUploadingDate,
    removeUploadingDate,
  ]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Hook to access full modal context
 */
export function useModals() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModals must be used within ModalProvider');
  }
  return context;
}

/**
 * Hook for content modal only
 */
export function useContentModal() {
  const {
    contentModal,
    openContentModalForDate,
    openContentModalForEdit,
    closeContentModal,
  } = useModals();

  return {
    ...contentModal,
    openForDate: openContentModalForDate,
    openForEdit: openContentModalForEdit,
    close: closeContentModal,
  };
}

/**
 * Hook for event request modal only
 */
export function useEventRequestModal() {
  const {
    eventRequestModal,
    openEventRequestModal,
    closeEventRequestModal,
  } = useModals();

  return {
    ...eventRequestModal,
    open: openEventRequestModal,
    close: closeEventRequestModal,
  };
}

/**
 * Hook for uploading state
 */
export function useUploadingState() {
  const {
    uploading,
    addUploadingDate,
    removeUploadingDate,
  } = useModals();

  return {
    ...uploading,
    addUploadingDate,
    removeUploadingDate,
    isDateUploading: (dateStr: string) => uploading.uploadingDates.includes(dateStr),
  };
}
