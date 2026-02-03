-- Migration: Remove legacy media_url and media_type columns from content table
-- These fields are now redundant with content_media table
--
-- IMPORTANT: Only run this AFTER verifying the application works correctly
-- with the updated code that uses content_media table exclusively.
--
-- Run verification queries first:
-- 1. Ensure all content with media_url has corresponding content_media entry
-- 2. Test application thoroughly

-- Create backup table (optional but recommended)
CREATE TABLE IF NOT EXISTS content_media_url_backup AS
SELECT id, media_url, media_type, created_at
FROM content
WHERE media_url IS NOT NULL;

-- Drop the legacy columns
ALTER TABLE content DROP COLUMN IF EXISTS media_url;
ALTER TABLE content DROP COLUMN IF EXISTS media_type;

-- Add comment for documentation
COMMENT ON TABLE content IS 'Content items. Media is stored in content_media table (multi-image support).';
