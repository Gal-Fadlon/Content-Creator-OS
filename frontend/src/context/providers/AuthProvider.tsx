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
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeAuth = async () => {
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Auth initialization timed out'));
          }, 10000);
        });

        const { data: { session: initialSession } } = await Promise.race([sessionPromise, timeoutPromise]);

        if (timeoutId) clearTimeout(timeoutId);
        if (!isMounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          const userProfile = await fetchUserProfile(initialSession.user);
          if (isMounted) {
            setUser(userProfile);
          }
        }
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Error initializing auth:', err);
        // Don't block the app - just continue without auth
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted) return;

        // IMPORTANT: Do NOT use async/await inside onAuthStateChange!
        // It causes ALL other Supabase operations to hang.
        // See: https://supabase.com/docs/reference/javascript/auth-onauthstatechange

        if (event === 'SIGNED_IN' && newSession?.user) {
          setSession(newSession);
          // Defer async profile fetch to avoid blocking Supabase client
          setTimeout(() => {
            if (!isMounted) return;
            fetchUserProfile(newSession.user).then((userProfile) => {
              if (isMounted) {
                setUser(userProfile);
                setViewAsRole(null);
              }
            });
          }, 0);
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
        setError(signInError.message || 'שגיאה בהתחברות. אנא נסה שנית.');
        setIsLoading(false);
        return;
      }

      if (data.session?.user) {
        setSession(data.session);
        const userProfile = await fetchUserProfile(data.session.user);
        setUser(userProfile);
        setViewAsRole(null);
      }
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהתחברות. אנא נסה שנית.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  // Sign out
  const signOut = useCallback(async () => {
    setError(null);
    
    try {
      // Cancel all queries immediately to prevent 403 errors
      await queryClient.cancelQueries();
      // Clear the cache
      queryClient.clear();
      
      // Clear state first for instant UI update
      setSession(null);
      setUser(null);
      setViewAsRole(null);
      
      // Then sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Sign out error:', signOutError);
        setError(signOutError.message || 'שגיאה בהתנתקות');
      }
    } catch (err: unknown) {
      console.error('Sign out error:', err);
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בהתנתקות';
      setError(errorMessage);
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
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
