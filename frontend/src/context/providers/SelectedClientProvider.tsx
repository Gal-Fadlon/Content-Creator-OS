/**
 * Selected Client Provider
 * Manages the currently selected client ID
 */

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { useClients } from '@/hooks/queries/useClients';
import { useAuth } from '@/context/providers/AuthProvider';
import type { Client } from '@/types/content';

const LAST_SELECTED_CLIENT_KEY = 'last-selected-client';

// Get last selected client from localStorage (for skeleton count on hard refresh)
export const getLastSelectedClientId = (): string | null => {
  try {
    return localStorage.getItem(LAST_SELECTED_CLIENT_KEY);
  } catch {
    return null;
  }
};

const setLastSelectedClientId = (clientId: string | null): void => {
  try {
    if (clientId) {
      localStorage.setItem(LAST_SELECTED_CLIENT_KEY, clientId);
    }
  } catch {
    // Ignore localStorage errors
  }
};

interface SelectedClientContextValue {
  /** Currently selected client ID */
  selectedClientId: string | null;
  /** Set the selected client ID */
  setSelectedClientId: (id: string | null) => void;
}

const SelectedClientContext = createContext<SelectedClientContextValue | undefined>(undefined);

interface SelectedClientProviderProps {
  children: ReactNode;
}

export function SelectedClientProvider({ children }: SelectedClientProviderProps) {
  const { user, isAdmin } = useAuth();
  const { data: clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Auto-select client based on user role
  useEffect(() => {
    if (!user) {
      setSelectedClientId(null);
      return;
    }

    // Client users: use their assigned client_id
    if (!isAdmin && user.clientId) {
      setSelectedClientId(user.clientId);
      setLastSelectedClientId(user.clientId);
      return;
    }

    // Admin users: try to restore last selected, or use first client
    if (isAdmin && clients?.length && !selectedClientId) {
      const lastClientId = getLastSelectedClientId();
      const validLastClient = lastClientId && clients.some(c => c.id === lastClientId);
      const clientToSelect = validLastClient ? lastClientId : clients[0].id;
      setSelectedClientId(clientToSelect);
      setLastSelectedClientId(clientToSelect);
    }
  }, [user, isAdmin, clients, selectedClientId]);

  // Persist selection changes to localStorage
  useEffect(() => {
    if (selectedClientId) {
      setLastSelectedClientId(selectedClientId);
    }
  }, [selectedClientId]);

  const value = useMemo(() => ({
    selectedClientId,
    setSelectedClientId,
  }), [selectedClientId]);

  return (
    <SelectedClientContext.Provider value={value}>
      {children}
    </SelectedClientContext.Provider>
  );
}

/**
 * Hook to access selected client ID and setter
 */
export function useSelectedClientId(): [string | null, (id: string | null) => void] {
  const context = useContext(SelectedClientContext);
  if (context === undefined) {
    throw new Error('useSelectedClientId must be used within SelectedClientProvider');
  }
  return [context.selectedClientId, context.setSelectedClientId];
}

/**
 * Hook to get the selected client object
 * Combines selection state with client data from React Query
 */
export function useSelectedClient(): Client | undefined {
  const [selectedClientId] = useSelectedClientId();
  const { data: clients } = useClients();
  return clients?.find((c) => c.id === selectedClientId);
}
