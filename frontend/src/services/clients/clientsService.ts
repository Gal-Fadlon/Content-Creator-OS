/**
 * Clients Service Interface
 * Defines the contract for client operations
 * Now uses Supabase
 */

import type { Client } from '@/types/content';
import { supabase } from '@/services/supabase/supabaseClient';
import type { ClientRow } from '@/services/supabase/supabaseTypes';

export interface ClientsService {
  getAll: () => Promise<Client[]>;
  getById: (id: string) => Promise<Client>;
  updateTheme: (clientId: string, theme: string) => Promise<Client>;
}

// Transform database row to frontend type
const toClient = (row: ClientRow, pendingCount: number = 0, totalContent: number = 0): Client => ({
  id: row.id,
  name: row.name,
  avatarUrl: row.avatar_url || undefined,
  description: row.description || undefined,
  pendingApprovals: pendingCount,
  totalContent: totalContent,
});

export const clientsService: ClientsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    // Get pending counts for each client
    const clientsWithCounts = await Promise.all(
      (data || []).map(async (client) => {
        // Get pending content count
        const { count: pendingCount } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id)
          .eq('status', 'pending');

        // Get total content count
        const { count: totalCount } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', client.id);

        return toClient(client, pendingCount || 0, totalCount || 0);
      })
    );

    return clientsWithCounts;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Get counts
    const { count: pendingCount } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', id)
      .eq('status', 'pending');

    const { count: totalCount } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', id);

    return toClient(data, pendingCount || 0, totalCount || 0);
  },

  async updateTheme(clientId: string, theme: string) {
    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Upsert monthly theme
    const { error: themeError } = await supabase
      .from('monthly_themes')
      .upsert({
        client_id: clientId,
        month,
        year,
        theme_text: theme,
      }, {
        onConflict: 'client_id,month,year',
      });

    if (themeError) throw themeError;

    // Return updated client
    return this.getById(clientId);
  },
};
