-- ============================================
-- Content Creator OS - Comment Notification Link
-- Links notifications to their source comments for deletion
-- Run this in Supabase SQL Editor AFTER 006_content_comments.sql
-- ============================================

-- ============================================
-- ADD comment_id COLUMN TO notifications
-- ============================================
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS comment_id UUID REFERENCES content_comments(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notifications_comment_id ON notifications(comment_id);

-- ============================================
-- UPDATE TRIGGER: Include comment_id and preview in notification
-- ============================================
CREATE OR REPLACE FUNCTION notify_on_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_content_client_id UUID;
  v_commenter_role TEXT;
  v_target_user_id UUID;
  v_commenter_name TEXT;
  v_content_type TEXT;
  v_comment_preview TEXT;
  v_message TEXT;
BEGIN
  -- Get content's client_id
  SELECT client_id INTO v_content_client_id
  FROM content WHERE id = NEW.content_id;

  -- Get commenter's role and name
  SELECT role, COALESCE(full_name, email) INTO v_commenter_role, v_commenter_name
  FROM profiles WHERE id = NEW.user_id;

  -- Get content type in Hebrew
  SELECT CASE type
    WHEN 'post' THEN 'פוסט'
    WHEN 'story' THEN 'סטורי'
    WHEN 'reel' THEN 'ריל'
    WHEN 'carousel' THEN 'קרוסלה'
    ELSE 'תוכן'
  END INTO v_content_type
  FROM content WHERE id = NEW.content_id;

  -- Create comment preview (truncate to 50 chars)
  v_comment_preview := LEFT(NEW.message, 50);
  IF LENGTH(NEW.message) > 50 THEN
    v_comment_preview := v_comment_preview || '...';
  END IF;

  -- Build message with preview
  v_message := v_commenter_name || ': "' || v_comment_preview || '"';

  IF v_commenter_role = 'admin' THEN
    -- Admin commented → notify client
    v_target_user_id := get_client_user_id(v_content_client_id);
  ELSE
    -- Client commented → notify admin
    v_target_user_id := get_client_admin_id(v_content_client_id);
  END IF;

  IF v_target_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, content_id, comment_id, client_id)
    VALUES (
      v_target_user_id,
      'new_comment',
      'תגובה חדשה',
      v_message,
      NEW.content_id,
      NEW.id,  -- Store the comment_id
      v_content_client_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
