-- Migration: Add content_media table for multi-image support
-- This allows content items (posts, stories, carousels) to have multiple images

-- Create content_media table
CREATE TABLE IF NOT EXISTS content_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  storage_key TEXT, -- R2 storage key for deletion
  sort_order INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by content_id
CREATE INDEX IF NOT EXISTS idx_content_media_content_id ON content_media(content_id);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_content_media_sort_order ON content_media(content_id, sort_order);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_content_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_media_updated_at
  BEFORE UPDATE ON content_media
  FOR EACH ROW
  EXECUTE FUNCTION update_content_media_updated_at();

-- Migrate existing media_url data to content_media table
-- This preserves all existing single-image content
INSERT INTO content_media (content_id, media_url, media_type, sort_order)
SELECT
  id,
  media_url,
  COALESCE(media_type, 'image'),
  0
FROM content
WHERE media_url IS NOT NULL AND media_url != '';

-- Row Level Security for content_media
ALTER TABLE content_media ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view media for content they can view
CREATE POLICY "Users can view content media"
  ON content_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM content c
      JOIN profiles p ON p.id = auth.uid()
      WHERE c.id = content_media.content_id
      AND (
        p.role = 'admin'
        OR c.client_id = p.client_id
      )
    )
  );

-- Policy: Admins can insert content media
CREATE POLICY "Admins can insert content media"
  ON content_media
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Admins can update content media
CREATE POLICY "Admins can update content media"
  ON content_media
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Admins can delete content media
CREATE POLICY "Admins can delete content media"
  ON content_media
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Note: We keep media_url, media_type columns in content table for:
-- 1. Backward compatibility during transition
-- 2. Quick access to "primary" media without joins
-- 3. Cover image selection (can point to one of the content_media items)
