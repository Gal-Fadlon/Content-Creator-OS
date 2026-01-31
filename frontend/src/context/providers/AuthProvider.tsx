/**
 * Auth Provider
 * Manages user authentication state with Supabase Auth
 */

import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/supabaseClient';
import { queryClient } from '@/context/queryClient';
import type { UserRole } from '@/types/content';
import { USER_ROLES } from '@/types/content';

interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  clientId: string | null;
  avatarUrl: string | null;
}

interface AuthContextValue {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Effective role (actual role or admin viewing as client) */
  role: UserRole;
  /** Actual database role (never changes) */
  actualRole: UserRole;
  /** Supabase session */
  session: Session | null;
  /** Whether authentication is loading */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether viewing as admin (considers viewAs mode) */
  isAdmin: boolean;
  /** Whether actual user is admin (ignores viewAs mode) */
  isActualAdmin: boolean;
  /** Switch view role (admin only - for previewing client view) */
  switchRole: (role: UserRole) => void;
  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Auth error message */
  error: string | null;
  /** Clear error */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewAsRole, setViewAsRole] = useState<UserRole | null>(null);

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<AuthUser | null> => {
    const defaultUser: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      fullName: supabaseUser.user_metadata?.full_name || null,
      role: USER_ROLES.CLIENT,
      clientId: null,
      avatarUrl: null,
    };

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, client_id, avatar_url')
        .eq('id', supabaseUser.id)
        .single();

      if (fetchError || !data) {
        console.error('Error fetching profile:', fetchError);
        return defaultUser;
      }

      const profile = data as { id: string; email: string; full_name: string | null; role: string; client_id: string | null; avatar_url: string | null };
      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role as UserRole,
        clientId: profile.client_id,
        avatarUrl: profile.avatar_url,
      };
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          const userProfile = await fetchUserProfile(initialSession.user);
          if (isMounted) {
            setUser(userProfile);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Error initializing auth:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          setSession(newSession);
          const userProfile = await fetchUserProfile(newSession.user);
          if (isMounted) {
            setUser(userProfile);
            setViewAsRole(null); // Reset view mode on login
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setViewAsRole(null);
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          setSession(newSession);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.session?.user) {
        setSession(data.session);
        const userProfile = await fetchUserProfile(data.session.user);
        setUser(userProfile);
        setViewAsRole(null);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'שגיאה בהתחברות. אנא נסה שנית.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Sign out
  const signOut = useCallback(async () => {
    setError(null);
    
    try {
      // Cancel all queries immediately to prevent 403 errors
      queryClient.cancelQueries();
      // Clear the cache
      queryClient.clear();
      
      // Clear state first for instant UI update
      setSession(null);
      setUser(null);
      setViewAsRole(null);
      
      // Then sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'שגיאה בהתנתקות');
    }
  }, []);

  // Switch role (admin only - for previewing client view)
  const switchRole = useCallback((role: UserRole) => {
    // Only admins can switch roles
    if (user?.role !== USER_ROLES.ADMIN) return;
    
    // If switching to actual role, clear viewAs
    if (role === user.role) {
      setViewAsRole(null);
    } else {
      setViewAsRole(role);
    }
  }, [user?.role]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Computed values
  const actualRole = user?.role || USER_ROLES.CLIENT;
  const effectiveRole = viewAsRole || actualRole;
  const isActualAdmin = actualRole === USER_ROLES.ADMIN;
  const isAdmin = effectiveRole === USER_ROLES.ADMIN;

  const value = useMemo<AuthContextValue>(() => ({
    user,
    role: effectiveRole,
    actualRole,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    isAdmin,
    isActualAdmin,
    switchRole,
    signIn,
    signOut,
    error,
    clearError,
  }), [user, effectiveRole, actualRole, session, isLoading, isAdmin, isActualAdmin, switchRole, signIn, signOut, error, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
