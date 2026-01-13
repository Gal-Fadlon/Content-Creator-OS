// Content item types
export type ContentType = 'post' | 'story' | 'reel';
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'published';
export type Platform = 'instagram' | 'tiktok' | 'facebook';
export type MarkerColor = 'red' | 'blue' | 'beige' | 'brown' | 'black';

export interface ContentItem {
  id: string;
  clientId: string;
  type: ContentType;
  status: ContentStatus;
  platform: Platform;
  date: string; // ISO date string
  time?: string; // HH:mm format
  caption: string;
  creativeDescription?: string; // תיאור הקריאייטיב - internal description for client
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  coverImageUrl?: string; // Separate cover image for grid preview
  thumbnailUrl?: string;
  notes?: string;
  technicalInstructions?: string;
  gridOrder?: number; // For drag & drop ordering in grid view
  createdAt: string;
  updatedAt: string;
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

export function isContentItem(item: CalendarItem): item is ContentItem {
  return 'type' in item && 'status' in item;
}

export function isEventItem(item: CalendarItem): item is EventItem {
  return 'title' in item && 'color' in item;
}

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
export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  clientId?: string; // Only for client role
}

// Notification types
export interface Notification {
  id: string;
  type: 'content_pending' | 'publish_reminder' | 'content_approved' | 'new_request' | 'event_request';
  title: string;
  message: string;
  contentId?: string;
  eventRequestId?: string;
  clientId?: string;
  read: boolean;
  createdAt: string;
}

// Event request from client
export interface EventRequest {
  id: string;
  clientId: string;
  title: string;
  date: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
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
