-- ============================================
-- Content Creator OS - Separate Grid and Calendar Content
-- Grid and Calendar now have independent content
-- Run this in Supabase SQL Editor AFTER 007_comment_notification_link.sql
-- ============================================

-- Add source column to distinguish between grid and calendar content
ALTER TABLE content ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'calendar';

-- Add check constraint for valid source values
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_source_check;
ALTER TABLE content ADD CONSTRAINT content_source_check
  CHECK (source IN ('calendar', 'grid'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_content_source ON content(source);

-- Update existing content without dates to be grid content
UPDATE content SET source = 'grid' WHERE scheduled_date IS NULL;

-- Update existing content with dates to be calendar content
UPDATE content SET source = 'calendar' WHERE scheduled_date IS NOT NULL;
