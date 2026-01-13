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
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
  notes?: string;
  technicalInstructions?: string;
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
  type: 'content_pending' | 'publish_reminder' | 'content_approved' | 'new_request';
  title: string;
  message: string;
  contentId?: string;
  clientId?: string;
  read: boolean;
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
