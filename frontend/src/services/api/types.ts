/**
 * API Types
 * Common types for API requests and responses
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Error response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: 'admin' | 'client';
    clientId?: string;
  };
}

// DTOs (Data Transfer Objects)
export interface CreateContentDTO {
  clientId: string;
  type: 'post' | 'story' | 'reel' | 'carousel';
  source?: 'calendar' | 'grid';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  platform: 'instagram' | 'tiktok' | 'facebook';
  date: string | null; // null for grid-only items without scheduled date
  time?: string;
  caption: string;
  creativeDescription?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  coverImageUrl?: string;
  notes?: string;
  technicalInstructions?: string;
  rejectionReason?: string;
  // Grid properties for grid-only items
  gridOrder?: number;
  gridZoom?: number;
  gridOffsetX?: number;
  gridOffsetY?: number;
}

export interface UpdateContentDTO extends Partial<CreateContentDTO> {
  gridOrder?: number;
  gridZoom?: number;
  gridOffsetX?: number;
  gridOffsetY?: number;
}

export interface CreateEventDTO {
  clientId: string;
  title: string;
  description?: string;
  date: string;
  color: 'red' | 'blue' | 'beige' | 'brown' | 'black';
}

export type UpdateEventDTO = Partial<CreateEventDTO>;

export interface CreateEventRequestDTO {
  clientId: string;
  title: string;
  date: string;
  description?: string;
}

export interface UpdateClientThemeDTO {
  monthlyTheme: string;
}
