/**
 * Content Service Interface
 * Defines the contract for content CRUD operations
 * Now uses Supabase
 */

import type { ContentItem } from '@/types/content';
import type { CreateContentDTO, UpdateContentDTO } from '@/services/api/types';
import { supabase } from '@/services/supabase/supabaseClient';
import type { ContentRow } from '@/services/supabase/supabaseTypes';
import { deleteFile } from '@/services/storage/uploadService';
import { withTimeout } from '@/helpers/timeout';

const QUERY_TIMEOUT = 15000; // 15 seconds for database queries

export interface ContentService {
  getAll: (clientId: string) => Promise<ContentItem[]>;
  getById: (id: string) => Promise<ContentItem>;
  create: (data: CreateContentDTO) => Promise<ContentItem>;
  update: (id: string, data: UpdateContentDTO) => Promise<ContentItem>;
  delete: (id: string) => Promise<void>;
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
  mediaUrl: row.media_url || undefined,
  mediaType: row.media_type || undefined,
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

// Transform frontend DTO to database insert
const toInsertContent = (data: CreateContentDTO) => ({
  client_id: data.clientId,
  type: data.type,
  source: data.source || 'calendar',
  status: data.status || 'draft',
  platform: data.platform || 'instagram',
  scheduled_date: data.date || null,
  caption: data.caption || null,
  creative_description: data.creativeDescription || null,
  media_url: data.mediaUrl || null,
  media_type: data.mediaType || null,
  grid_order: data.gridOrder || 0,
});

// Transform frontend DTO to database update
const toUpdateContent = (data: UpdateContentDTO) => {
  const update: Record<string, any> = {};
  
  if (data.type !== undefined) update.type = data.type;
  if (data.status !== undefined) update.status = data.status;
  if (data.platform !== undefined) update.platform = data.platform;
  if (data.date !== undefined) update.scheduled_date = data.date;
  if (data.caption !== undefined) update.caption = data.caption;
  if (data.creativeDescription !== undefined) update.creative_description = data.creativeDescription;
  if (data.mediaUrl !== undefined) update.media_url = data.mediaUrl;
  if (data.mediaType !== undefined) update.media_type = data.mediaType;
  if (data.coverImageUrl !== undefined) update.cover_image_url = data.coverImageUrl;
  if (data.rejectionReason !== undefined) update.rejection_reason = data.rejectionReason;
  if (data.gridOrder !== undefined) update.grid_order = data.gridOrder;
  if (data.gridZoom !== undefined) update.grid_zoom = data.gridZoom;
  if (data.gridOffsetX !== undefined) update.grid_offset_x = data.gridOffsetX;
  if (data.gridOffsetY !== undefined) update.grid_offset_y = data.gridOffsetY;
  
  return update;
};

export const contentService: ContentService = {
  async getAll(clientId: string) {
    const queryPromise = supabase
      .from('content')
      .select('*')
      .eq('client_id', clientId)
      .order('scheduled_date', { ascending: true, nullsFirst: false })
      .order('grid_order', { ascending: true });

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading content timed out. Please try again.'
    );

    if (error) throw error;

    return (data || []).map(toContentItem);
  },

  async getById(id: string) {
    const queryPromise = supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await withTimeout(
      queryPromise,
      QUERY_TIMEOUT,
      'Loading content timed out.'
    );

    if (error) throw error;

    return toContentItem(data);
  },

  async create(data: CreateContentDTO) {
    const insertPromise = supabase
      .from('content')
      .insert(toInsertContent(data))
      .select()
      .single();

    const { data: created, error } = await withTimeout(
      insertPromise,
      QUERY_TIMEOUT,
      'Creating content timed out. Please try again.'
    );

    if (error) throw error;

    return toContentItem(created);
  },

  async update(id: string, data: UpdateContentDTO) {
    const updatePromise = supabase
      .from('content')
      .update(toUpdateContent(data))
      .eq('id', id)
      .select()
      .single();

    const { data: updated, error } = await withTimeout(
      updatePromise,
      QUERY_TIMEOUT,
      'Updating content timed out. Please try again.'
    );

    if (error) throw error;

    return toContentItem(updated);
  },

  async delete(id: string) {
    // Get the content item first to retrieve media URLs
    const { data: content } = await supabase
      .from('content')
      .select('media_url, cover_image_url')
      .eq('id', id)
      .single();

    // Delete files from R2 (don't fail if file deletion fails)
    if (content) {
      const urlsToDelete = [content.media_url, content.cover_image_url].filter(Boolean);
      
      for (const url of urlsToDelete) {
        try {
          // Extract key from URL (format: https://domain/clients/...)
          const key = url.split('.r2.dev/')[1] || url.split('.com/')[1];
          if (key) {
            await deleteFile(key);
          }
        } catch (err) {
          console.warn('Failed to delete file from R2:', url, err);
        }
      }
    }

    // Delete the database record
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
