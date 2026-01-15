/**
 * Auth Provider
 * Manages user authentication state and role switching
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, UserRole } from '@/types/content';
import { queryKeys } from '@/services/queryKeys';
import { services } from '@/services/services';

interface AuthContextValue {
  /** Current authenticated user */
  user: User | null;
  /** Current user role */
  role: UserRole;
  /** Whether authentication is loading */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether current user is admin */
  isAdmin: boolean;
  /** Switch between admin and client roles (for demo) */
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  /** Initial role for demo purposes */
  defaultRole?: UserRole;
}

export function AuthProvider({ children, defaultRole = 'admin' }: AuthProviderProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => services.auth.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Role switch mutation
  const switchRoleMutation = useMutation({
    mutationFn: (newRole: UserRole) => services.auth.switchRole(newRole),
    onSuccess: (newUser) => {
      queryClient.setQueryData(queryKeys.auth.user, newUser);
    },
  });

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
    switchRoleMutation.mutate(newRole);
  }, [switchRoleMutation]);

  const value = useMemo<AuthContextValue>(() => ({
    user: user ?? null,
    role,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    switchRole,
  }), [user, role, isLoading, switchRole]);

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

/**
 * Hook to get just the user role (minimizes re-renders)
 */
export function useUserRole(): UserRole {
  const { role } = useAuth();
  return role;
}

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin(): boolean {
  const { isAdmin } = useAuth();
  return isAdmin;
}
