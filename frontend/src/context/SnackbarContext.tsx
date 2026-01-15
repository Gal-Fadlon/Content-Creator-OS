import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import AppSnackbar, { type SnackbarMessage } from '@/components/common/Snackbar/Snackbar';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface SnackbarContextType {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = genId();
    const message: SnackbarMessage = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
    };

    setMessages((prev) => [...prev, message]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <AppSnackbar messages={messages} onClose={dismiss} />
    </SnackbarContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useToast must be used within a SnackbarProvider');
  }
  return context;
};
