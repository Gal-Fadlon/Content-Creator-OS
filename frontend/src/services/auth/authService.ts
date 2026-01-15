/**
 * Auth Service Interface
 * Defines the contract for authentication operations
 */

import type { User, UserRole } from '@/types/content';
import type { LoginCredentials, AuthResponse } from '@/services/api/types';
import { apiClient } from '@/services/api/client';

export interface AuthService {
  getCurrentUser: () => Promise<User>;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<User>;
}

export const authService: AuthService = {
  async getCurrentUser() {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    return response.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },

  async switchRole(role: UserRole) {
    const response = await apiClient.post<User>('/auth/switch-role', { role });
    return response.data;
  },
};
