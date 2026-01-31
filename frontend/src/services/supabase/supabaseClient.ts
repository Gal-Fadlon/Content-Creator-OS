/**
 * Supabase Client
 * Configured client for connecting to Supabase backend
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabaseTypes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local'
  );
}

// Singleton pattern to prevent multiple client instances in StrictMode
let supabaseInstance: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage,
        // Custom lock that doesn't use navigator.locks (fixes StrictMode AbortError)
        lock: async <T>(_name: string, _acquireTimeout: number, callback: () => Promise<T>): Promise<T> => {
          return await callback();
        },
      },
    });
  }
  return supabaseInstance;
}

/**
 * Supabase client instance
 * Uses the anon key which respects Row Level Security
 */
export const supabase = getSupabaseClient();
