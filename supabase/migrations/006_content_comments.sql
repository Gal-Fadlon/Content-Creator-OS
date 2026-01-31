-- ============================================
-- Content Creator OS - Content Comments
-- Allows back-and-forth conversation on content items
-- Run this in Supabase SQL Editor AFTER 005_notification_triggers.sql
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- Content comments table
CREATE TABLE IF NOT EXISTS content_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Additional FK to profiles for PostgREST join support
  CONSTRAINT content_comments_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_content_comments_content_id ON content_comments(content_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_user_id ON content_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_content_comments_created_at ON content_comments(created_at);

-- ============================================
-- TRIGGERS (updated_at)
-- ============================================
CREATE TRIGGER update_content_comments_updated_at 
  BEFORE UPDATE ON content_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;

-- Admins can see all comments for their clients' content
CREATE POLICY "Admins can view comments on their clients content" ON content_comments
  FOR SELECT
  USING (
    is_admin() AND EXISTS (
      SELECT 1 FROM content c
      JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = content_comments.content_id
      AND cl.owner_id = auth.uid()
    )
  );

-- Clients can see comments on their own content
CREATE POLICY "Clients can view comments on their content" ON content_comments
  FOR SELECT
  USING (
    NOT is_admin() AND EXISTS (
      SELECT 1 FROM content c
      WHERE c.id = content_comments.content_id
      AND c.client_id = get_my_client_id()
    )
  );

-- Users can insert comments on content they have access to
CREATE POLICY "Users can insert comments on accessible content" ON content_comments
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND (
      -- Admin can comment on their clients' content
      (is_admin() AND EXISTS (
        SELECT 1 FROM content c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.id = content_comments.content_id
        AND cl.owner_id = auth.uid()
      ))
      OR
      -- Client can comment on their own content
      (NOT is_admin() AND EXISTS (
        SELECT 1 FROM content c
        WHERE c.id = content_comments.content_id
        AND c.client_id = get_my_client_id()
      ))
    )
  );

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON content_comments
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- ADD NEW NOTIFICATION TYPE
-- ============================================
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('content_pending', 'publish_reminder', 'content_approved', 'new_request', 'event_request', 'new_comment'));

-- ============================================
-- TRIGGER: New Comment → Notify Other Party
-- ============================================
CREATE OR REPLACE FUNCTION notify_on_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_content_client_id UUID;
  v_commenter_role TEXT;
  v_target_user_id UUID;
  v_commenter_name TEXT;
  v_content_type TEXT;
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
  
  IF v_commenter_role = 'admin' THEN
    -- Admin commented → notify client
    v_target_user_id := get_client_user_id(v_content_client_id);
  ELSE
    -- Client commented → notify admin
    v_target_user_id := get_client_admin_id(v_content_client_id);
  END IF;
  
  IF v_target_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, content_id, client_id)
    VALUES (
      v_target_user_id,
      'new_comment',
      'תגובה חדשה',
      v_commenter_name || ' הגיב/ה על ' || v_content_type,
      NEW.content_id,
      v_content_client_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_comment ON content_comments;
CREATE TRIGGER on_new_comment
  AFTER INSERT ON content_comments
  FOR EACH ROW EXECUTE FUNCTION notify_on_new_comment();
