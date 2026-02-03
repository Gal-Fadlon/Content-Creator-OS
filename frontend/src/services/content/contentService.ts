/**
 * Content Service Interface
 * Defines the contract for content CRUD operations
 * Now uses Supabase
 */

import type { ContentItem, ContentMedia } from '@/types/content';
import type { CreateContentDTO, UpdateContentDTO } from '@/services/api/types';
import { supabase } from '@/services/supabase/supabaseClient';
import type { ContentRow, ContentMediaRow } from '@/services/supabase/supabaseTypes';
import { deleteFile } from '@/services/storage/uploadService';
import { withTimeout } from '@/helpers/timeout.helper';

const QUERY_TIMEOUT = 15000; // 15 seconds for database queries

// Transform content_media row to frontend type
const toContentMedia = (row: ContentMediaRow): ContentMedia => ({
  id: row.id,
  contentId: row.content_id,
  mediaUrl: row.media_url,
  mediaType: row.media_type,
  storageKey: row.storage_key || undefined,
  sortOrder: row.sort_order,
  width: row.width || undefined,
  height: row.height || undefined,
  fileSize: row.file_size || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export interface ContentService {
  getAll: (clientId: string) => Promise<ContentItem[]>;
  getById: (id: string) => Promise<ContentItem>;
  create: (data: CreateContentDTO) => Promise<ContentItem>;
  update: (id: string, data: UpdateContentDTO) => Promise<ContentItem>;
  delete: (id: string, accessToken?: string) => Promise<void>;
}

// Transform database row to frontend type
const toContentItem = (row: ContentRow): ContentItem => ({
  id: row.id,
  clientId: row.client_id,
  type: row.type,
  status: row.status,
  platform: row.platform || 'instagram',
  source: row.source || 'calendar',
  date: row.scheduled_date,  // Keep null for grid-only items
  time: row.scheduled_time || undefined,
  caption: row.caption || '',
  creativeDescription: row.creative_description || undefined,
  coverImageUrl: row.cover_image_url || undefined,
  thumbnailUrl: row.thumbnail_url || undefined,
  notes: row.notes || undefined,
  technicalInstructions: row.technical_instructions || undefined,
  rejectionReason: row.rejection_reason || undefined,
  gridOrder: row.grid_order,
  gridZoom: row.grid_zoom,
  gridOffsetX: row.grid_offset_x,
  gridOffsetY: row.grid_offset_y,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Transform row with nested media to ContentItem
const toContentItemWithMedia = (row: ContentRow & { content_media?: ContentMediaRow[] }): ContentItem => {
  const item = toContentItem(row);
  // Add media array, sorted by sort_order
  if (row.content_media && row.content_media.length > 0) {
    item.media = row.content_media
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(toContentMedia);
  }
  return item;
};

export const contentService: ContentService = {
  async getAll(clientId: string) {
    // Fetch content with related media using nested select
    const queryPromise = supabase
      .from('content')
      .select(`
        *,
        content_media (*)
      `)
      .eq('client_id', clientId)
      .order('scheduled_date', { ascending: true, nullsFirst: false })
      .order('grid_order', { ascending: true });

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading content timed out. Please try again.'
    );

    if (error) throw error;

    return ((data || []) as (ContentRow & { content_media?: ContentMediaRow[] })[]).map(toContentItemWithMedia);
  },

  async getById(id: string) {
    const queryPromise = supabase
      .from('content')
      .select(`
        *,
        content_media (*)
      `)
      .eq('id', id)
      .single();

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading content timed out.'
    );

    if (error) throw error;

    return toContentItemWithMedia(data as ContentRow & { content_media?: ContentMediaRow[] });
  },

  async create(data: CreateContentDTO) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: created, error } = await (supabase.from('content') as any)
      .insert({
        client_id: data.clientId,
        type: data.type,
        source: data.source || 'calendar',
        status: data.status || 'draft',
        platform: data.platform || 'instagram',
        scheduled_date: data.date || null,
        caption: data.caption || null,
        creative_description: data.creativeDescription || null,
        grid_order: data.gridOrder || 0,
      })
      .select()
      .single();

    if (error) throw error;

    return toContentItem(created as ContentRow);
  },

  async update(id: string, data: UpdateContentDTO) {
    const update: Record<string, unknown> = {};

    if (data.type !== undefined) update.type = data.type;
    if (data.status !== undefined) update.status = data.status;
    if (data.platform !== undefined) update.platform = data.platform;
    if (data.date !== undefined) update.scheduled_date = data.date;
    if (data.caption !== undefined) update.caption = data.caption;
    if (data.creativeDescription !== undefined) update.creative_description = data.creativeDescription;
    if (data.coverImageUrl !== undefined) update.cover_image_url = data.coverImageUrl;
    if (data.rejectionReason !== undefined) update.rejection_reason = data.rejectionReason;
    if (data.gridOrder !== undefined) update.grid_order = data.gridOrder;
    if (data.gridZoom !== undefined) update.grid_zoom = data.gridZoom;
    if (data.gridOffsetX !== undefined) update.grid_offset_x = data.gridOffsetX;
    if (data.gridOffsetY !== undefined) update.grid_offset_y = data.gridOffsetY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabase.from('content') as any)
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return toContentItem(updated as ContentRow);
  },

  async delete(id: string, accessToken?: string) {
    // Get the content item first to retrieve media URLs for R2 cleanup
    const { data: contentData } = await supabase
      .from('content')
      .select(`
        cover_image_url, thumbnail_url,
        content_media (media_url, storage_key)
      `)
      .eq('id', id)
      .single();

    const content = contentData as {
      cover_image_url: string | null;
      thumbnail_url: string | null;
      content_media?: { media_url: string; storage_key: string | null }[];
    } | null;

    // Collect all URLs to delete from R2
    const urlsToDelete: string[] = [];

    if (content) {
      if (content.cover_image_url) urlsToDelete.push(content.cover_image_url);
      if (content.thumbnail_url) urlsToDelete.push(content.thumbnail_url);

      // Add media from content_media table
      if (content.content_media) {
        for (const media of content.content_media) {
          urlsToDelete.push(media.media_url);
        }
      }
    }

    // Delete files from R2 (don't fail if file deletion fails)
    for (const url of urlsToDelete) {
      try {
        // Extract key from URL (format: https://domain/clients/...)
        const key = url.split('.r2.dev/')[1] || url.split('.com/')[1];
        if (key) {
          await deleteFile(key, accessToken);
        }
      } catch (err) {
        console.warn('Failed to delete file from R2:', url, err);
      }
    }

    // Delete related notifications (don't fail if this fails)
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('content_id', id);
    } catch (err) {
      console.warn('Failed to delete related notifications:', err);
    }

    // Delete related comments (don't fail if this fails)
    try {
      await supabase
        .from('content_comments')
        .delete()
        .eq('content_id', id);
    } catch (err) {
      console.warn('Failed to delete related comments:', err);
    }

    // Delete the database record (content_media is deleted via CASCADE)
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

/**
 * Content Media Service
 * Manages multiple media items per content
 */
export interface ContentMediaService {
  addMedia: (contentId: string, mediaUrl: string, mediaType: 'image' | 'video', storageKey?: string) => Promise<ContentMedia>;
  removeMedia: (mediaId: string, accessToken?: string) => Promise<void>;
  reorderMedia: (contentId: string, mediaIds: string[]) => Promise<void>;
  getMediaForContent: (contentId: string) => Promise<ContentMedia[]>;
}

export const contentMediaService: ContentMediaService = {
  async addMedia(contentId: string, mediaUrl: string, mediaType: 'image' | 'video', storageKey?: string) {
    // Get current max sort_order for this content
    const { data: existing } = await supabase
      .from('content_media')
      .select('sort_order')
      .eq('content_id', contentId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? (existing[0] as { sort_order: number }).sort_order + 1 : 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.from('content_media') as any)
      .insert({
        content_id: contentId,
        media_url: mediaUrl,
        media_type: mediaType,
        storage_key: storageKey || null,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return toContentMedia(data as ContentMediaRow);
  },

  async removeMedia(mediaId: string, accessToken?: string) {
    // Get the media item first to retrieve URL for R2 deletion
    const { data: mediaData } = await supabase
      .from('content_media')
      .select('media_url, storage_key')
      .eq('id', mediaId)
      .single();

    const media = mediaData as { media_url: string; storage_key: string | null } | null;

    // Delete from R2
    if (media) {
      try {
        const key = media.storage_key || media.media_url.split('.r2.dev/')[1] || media.media_url.split('.com/')[1];
        if (key) {
          await deleteFile(key, accessToken);
        }
      } catch (err) {
        console.warn('Failed to delete media file from R2:', err);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('content_media')
      .delete()
      .eq('id', mediaId);

    if (error) throw error;
  },

  async reorderMedia(_contentId: string, mediaIds: string[]) {
    // Update sort_order for each media item
    const updates = mediaIds.map((id, index) => ({
      id,
      sort_order: index,
    }));

    for (const update of updates) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('content_media') as any)
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);

      if (error) throw error;
    }
  },

  async getMediaForContent(contentId: string) {
    const { data, error } = await supabase
      .from('content_media')
      .select('*')
      .eq('content_id', contentId)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return ((data || []) as ContentMediaRow[]).map(toContentMedia);
  },
};
