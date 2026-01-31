/**
 * Auth Service Interface
 * Defines the contract for authentication operations
 * Now uses Supabase Auth
 */

import type { User } from '@/types/content';
import type { LoginCredentials, AuthResponse } from '@/services/api/types';
import { supabase } from '@/services/supabase/supabaseClient';

export interface AuthService {
  getCurrentUser: () => Promise<User>;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export const authService: AuthService = {
  async getCurrentUser() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return {
      id: profile.id,
      name: profile.full_name || profile.email,
      role: profile.role as UserRole,
      clientId: profile.client_id || undefined,
    };
  },

  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        name: profile?.full_name || data.user.email || '',
        role: (profile?.role as UserRole) || 'client',
        clientId: profile?.client_id || undefined,
      },
      token: data.session?.access_token || '',
      refreshToken: data.session?.refresh_token || '',
    };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
