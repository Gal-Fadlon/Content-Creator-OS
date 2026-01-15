/**
 * Auth Service Mock Implementation
 * Uses local mock data for development/demo purposes
 */

import type { User, UserRole } from '@/types/content';
import type { LoginCredentials, AuthResponse } from '@/services/api/types';
import type { AuthService } from './authService';
import { mockUsers } from '@/data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state for demo
let currentRole: UserRole = 'admin';

export const authServiceMock: AuthService = {
  async getCurrentUser() {
    await delay(100);
    return currentRole === 'admin' ? mockUsers[0] : mockUsers[1];
  },

  async login(_credentials: LoginCredentials) {
    await delay(300);
    // For demo, always succeed
    const user = mockUsers[0];
    const response: AuthResponse = {
      token: 'mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        clientId: user.clientId,
      },
    };
    return response;
  },

  async logout() {
    await delay(100);
    currentRole = 'admin';
  },

  async switchRole(role: UserRole) {
    await delay(100);
    currentRole = role;
    return currentRole === 'admin' ? mockUsers[0] : mockUsers[1];
  },
};
