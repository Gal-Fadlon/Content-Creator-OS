/**
 * Upload Service
 * Handles file uploads to Cloudflare R2 via signed URLs
 *
 * Note: For production, you'll need a Supabase Edge Function to generate signed URLs.
 * This service provides the frontend interface for that workflow.
 */

import { supabase } from '@/services/supabase/supabaseClient';
import { withTimeout, fetchWithTimeout } from '@/helpers/timeout';

// Timeouts for different operations
const SIGNED_URL_TIMEOUT = 15000; // 15 seconds for getting signed URL
const UPLOAD_TIMEOUT = 60000; // 60 seconds for actual upload (larger files)

export interface UploadResult {
  url: string;
  key: string;
}

export interface UploadOptions {
  clientId: string;
  folder: 'content' | 'profile' | 'stickers' | 'backdrops';
  contentType?: string;
}

const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || 'https://media.rzsocialmedia.com';

/**
 * Generate a unique file key for storage
 */
const generateFileKey = (options: UploadOptions, fileName: string): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop() || 'jpg';
  
  return `clients/${options.clientId}/${options.folder}/${timestamp}-${randomSuffix}.${extension}`;
};

/**
 * Get a signed upload URL from the backend
 * This requires a Supabase Edge Function to be set up
 */
export const getSignedUploadUrl = async (
  options: UploadOptions,
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> => {
  const key = generateFileKey(options, fileName);
  console.log('[Upload] Getting signed URL for key:', key);

  // Get current session to include auth header
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[Upload] Session error:', sessionError);
    throw new Error('Session error. Please refresh and try again.');
  }

  if (!session) {
    console.error('[Upload] No session found');
    throw new Error('Not authenticated. Please log in.');
  }

  // Validate session is not expired
  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
  if (expiresAt && Date.now() > expiresAt) {
    console.error('[Upload] Session expired');
    // Try to refresh the session
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshData.session) {
      throw new Error('Session expired. Please log in again.');
    }
    console.log('[Upload] Session refreshed successfully');
  }

  console.log('[Upload] Calling Edge Function...');

  // Call Supabase Edge Function to get signed URL with timeout
  const invokePromise = supabase.functions.invoke('generate-upload-url', {
    body: {
      key,
      contentType,
      clientId: options.clientId,
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const { data, error } = await withTimeout(
    invokePromise,
    SIGNED_URL_TIMEOUT,
    'Getting upload URL timed out. Please try again.'
  );

  console.log('[Upload] Edge Function response:', { data: !!data, error: error?.message });

  if (error) {
    console.error('[Upload] Edge Function error:', error);
    throw new Error(`Failed to get upload URL: ${error.message}`);
  }

  if (!data || !data.uploadUrl || !data.publicUrl) {
    console.error('[Upload] Invalid response from Edge Function:', data);
    throw new Error('Invalid response from server. Please try again.');
  }

  return {
    uploadUrl: data.uploadUrl,
    publicUrl: data.publicUrl,
    key: data.key,
  };
};

/**
 * Upload a file directly to R2 using a signed URL
 */
export const uploadFile = async (
  file: File,
  options: UploadOptions,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  console.log('[Upload] Starting upload for file:', file.name, 'size:', file.size);

  try {
    // Get signed URL
    const { uploadUrl, publicUrl, key } = await getSignedUploadUrl(
      options,
      file.name,
      file.type
    );

    console.log('[Upload] Got signed URL, uploading to R2...');

    // Upload file directly to R2 with timeout
    const response = await fetchWithTimeout(
      uploadUrl,
      {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      },
      UPLOAD_TIMEOUT
    );

    console.log('[Upload] R2 response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('[Upload] R2 upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    onProgress?.(100);
    console.log('[Upload] Upload complete, public URL:', publicUrl);

    return {
      url: publicUrl,
      key,
    };
  } catch (error) {
    console.error('[Upload] Upload error:', error);
    throw error;
  }
};

/**
 * Upload a file using base64 data URL
 * Converts data URL to blob and uploads
 */
export const uploadDataUrl = async (
  dataUrl: string,
  options: UploadOptions,
  fileName: string = 'image.jpg'
): Promise<UploadResult> => {
  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });

  return uploadFile(file, options);
};

/**
 * Delete a file from R2
 * Requires a Supabase Edge Function
 */
export const deleteFile = async (key: string): Promise<void> => {
  // Get current session to include auth header
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated. Cannot delete file.');
  }

  const invokePromise = supabase.functions.invoke('delete-file', {
    body: { key },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const { error } = await withTimeout(
    invokePromise,
    SIGNED_URL_TIMEOUT,
    'Delete request timed out.'
  );

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Temporary: For development without Edge Functions,
 * store files in Supabase Storage instead
 */
export const uploadToSupabaseStorage = async (
  file: File,
  options: UploadOptions
): Promise<UploadResult> => {
  const key = generateFileKey(options, file.name);

  const { data, error } = await supabase.storage
    .from('media')
    .upload(key, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrl } = supabase.storage
    .from('media')
    .getPublicUrl(data.path);

  return {
    url: publicUrl.publicUrl,
    key: data.path,
  };
};
