/**
 * Selected Client Provider
 * Manages the currently selected client ID
 */

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useClients } from '@/hooks/queries/useClients';
import type { Client } from '@/types/content';

interface SelectedClientContextValue {
  /** Currently selected client ID */
  selectedClientId: string | null;
  /** Set the selected client ID */
  setSelectedClientId: (id: string | null) => void;
}

const SelectedClientContext = createContext<SelectedClientContextValue | undefined>(undefined);

interface SelectedClientProviderProps {
  children: ReactNode;
  /** Initial selected client ID */
  defaultClientId?: string | null;
}

export function SelectedClientProvider({
  children,
  defaultClientId = 'c1',
}: SelectedClientProviderProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(defaultClientId);

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
