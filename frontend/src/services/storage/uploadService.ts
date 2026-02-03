/**
 * Upload Service
 * Handles file uploads to Cloudflare R2 via signed URLs
 */

import { supabase } from '@/services/supabase/supabaseClient';
import { withTimeout, fetchWithTimeout } from '@/helpers/timeout';

// Timeouts for different operations
const SIGNED_URL_TIMEOUT = 15000; // 15 seconds for getting signed URL
const UPLOAD_TIMEOUT = 60000; // 60 seconds for actual upload

export interface UploadResult {
  url: string;
  key: string;
}

export interface UploadOptions {
  clientId: string;
  folder: 'content' | 'profile' | 'stickers' | 'backdrops';
  contentType?: string;
  accessToken?: string; // Pass from AuthProvider to avoid getSession() race conditions
}

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

  // Use passed access token (from AuthProvider) or fall back to getSession
  let accessToken = options.accessToken;

  if (!accessToken) {
    console.log('[Upload] No access token passed, falling back to getSession...');
    const sessionResult = await withTimeout(
      supabase.auth.getSession(),
      5000,
      'Getting session timed out. Please refresh the page.'
    );
    accessToken = sessionResult.data.session?.access_token;

    if (sessionResult.error) {
      console.error('[Upload] Session error:', sessionResult.error);
      throw new Error('Session error. Please refresh and try again.');
    }
  }

  if (!accessToken) {
    console.error('[Upload] No access token available');
    throw new Error('Not authenticated. Please log in.');
  }

  console.log('[Upload] Calling Edge Function with token length:', accessToken.length);

  // Get Supabase URL from environment
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/generate-upload-url`;

  console.log('[Upload] Calling Edge Function URL:', functionUrl);

  const response = await fetchWithTimeout(
    functionUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        key,
        contentType,
        clientId: options.clientId,
      }),
    },
    SIGNED_URL_TIMEOUT
  );

  console.log('[Upload] Edge Function response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error('[Upload] Edge Function error:', response.status, errorText);
    throw new Error(`Failed to get upload URL: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log('[Upload] Edge Function response data:', data);

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
};

/**
 * Delete a file from R2
 * Requires a Supabase Edge Function
 */
export const deleteFile = async (key: string, accessToken?: string): Promise<void> => {
  let token = accessToken;

  // Fall back to getSession if no token passed
  if (!token) {
    const sessionResult = await withTimeout(
      supabase.auth.getSession(),
      5000,
      'Getting session timed out.'
    );
    token = sessionResult.data.session?.access_token;
  }

  if (!token) {
    throw new Error('Not authenticated. Cannot delete file.');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/delete-file`;

  const response = await fetchWithTimeout(
    functionUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ key }),
    },
    SIGNED_URL_TIMEOUT
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to delete file: ${response.status} ${errorText}`);
  }
};

