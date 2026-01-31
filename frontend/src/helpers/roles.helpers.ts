/**
 * Role helper functions
 */

import type { UserRole } from '@/types/content';
import { USER_ROLES } from '@/types/content';

/** Check if role is admin */
export const isAdminRole = (role: UserRole): boolean => role === USER_ROLES.ADMIN;
