/**
 * Content domain types
 * All type definitions for content, events, clients, and related entities
 */

// Content item types
export type ContentType = 'post' | 'story' | 'reel' | 'carousel';
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
export type Platform = 'instagram' | 'tiktok' | 'facebook';
export type MarkerColor = 'red' | 'blue' | 'beige' | 'brown' | 'black';
export type ContentSource = 'calendar' | 'grid';

// Media item for multi-image support
export interface ContentMedia {
  id: string;
  contentId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  storageKey?: string; // R2 storage key for deletion
  sortOrder: number;
  width?: number;
  height?: number;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentItem {
  id: string;
  clientId: string;
  type: ContentType;
  status: ContentStatus;
  platform: Platform;
  source?: ContentSource; // 'calendar' or 'grid' - determines where content appears
  date: string | null; // ISO date string, null for grid-only items
  time?: string; // HH:mm format
  caption: string;
  creativeDescription?: string; // תיאור הקריאייטיב - internal description for client
  media?: ContentMedia[]; // Array of media items, sorted by sortOrder
  coverImageUrl?: string; // Separate cover image for grid preview
  thumbnailUrl?: string;
  notes?: string;
  technicalInstructions?: string;
  rejectionReason?: string; // Client feedback when rejecting content
  gridOrder?: number; // For drag & drop ordering in grid view
  // Grid frame controls
  gridZoom?: number; // 0.5 to 2, default 1
  gridOffsetX?: number; // percentage offset
  gridOffsetY?: number; // percentage offset
  createdAt?: string;
  updatedAt?: string;
  // UI state for optimistic updates
  isUploading?: boolean; // True when image is being uploaded in background
}

export interface EventItem {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  date: string;
  color: MarkerColor;
  createdAt: string;
  updatedAt: string;
}

export type CalendarItem = ContentItem | EventItem;

// Client types
export interface Client {
  id: string;
  name: string;
  avatarUrl?: string;
  monthlyTheme?: string;
  monthlyThemeEditable?: boolean;
  description?: string;
  pendingApprovals: number;
  totalContent: number;
}

// User/Role types
export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: string;
  name: string;
  role: UserRole;
  clientId?: string; // Only for client role
}

// Notification types
export type NotificationType = 
  | 'content_pending' 
  | 'publish_reminder' 
  | 'content_approved' 
  | 'new_request' 
  | 'event_request'
  | 'new_comment';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  contentId?: string;
  eventRequestId?: string;
  clientId?: string;
  read: boolean;
  createdAt: string;
  // Joined from content table
  contentDate?: string;
  contentMediaUrl?: string;
}

// Content comment types
export interface ContentComment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// Event request from client
export type EventRequestStatus = 'pending' | 'approved' | 'rejected';

export interface EventRequest {
  id: string;
  clientId: string;
  title: string;
  date: string;
  description?: string;
  status: EventRequestStatus;
  createdAt: string;
}

// Filter types
export interface ContentFilters {
  type?: ContentType[];
  status?: ContentStatus[];
  platform?: Platform[];
  pendingApprovalOnly?: boolean;
}

// View types
export type CalendarView = 'calendar' | 'grid';
export type ModalMode = 'media' | 'event';

// Calendar day data for calendar grid rendering
export interface CalendarDayData {
  date: Date;
  isCurrentMonth: boolean;
  content: ContentItem[];
  events: EventItem[];
}

// Monthly state for per-month backdrop, stickers and theme
export type StickerIconType = 'lucide' | 'custom';

export interface PlacedSticker {
  id: string;
  icon?: string; // For custom stickers this is the image URL
  iconType?: StickerIconType;
  lucideIcon?: string; // Name of lucide icon
  color: string;
  label: string;
  visibleId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface MonthlyState {
  monthKey: string; // Format: "YYYY-MM"
  backdrop: string;
  stickers: PlacedSticker[];
  customStickerBank: CustomSticker[];
  theme: string; // Monthly theme text - saved per month
}

export interface CustomSticker {
  id: string;
  imageUrl: string;
  label: string;
  createdAt: string;
}
