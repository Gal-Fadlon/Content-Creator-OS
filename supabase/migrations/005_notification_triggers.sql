-- ============================================
-- Content Creator OS - Notification Triggers
-- Automatic notifications for key events
-- Run this in Supabase SQL Editor AFTER 004_multi_admin_support.sql
-- ============================================

-- ============================================
-- HELPER FUNCTION: Get admin user_id for a client
-- ============================================
CREATE OR REPLACE FUNCTION get_client_admin_id(p_client_id UUID)
RETURNS UUID AS $$
  SELECT owner_id FROM clients WHERE id = p_client_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Get client user_id
-- ============================================
CREATE OR REPLACE FUNCTION get_client_user_id(p_client_id UUID)
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE client_id = p_client_id AND role = 'client' LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Get client name
-- ============================================
CREATE OR REPLACE FUNCTION get_client_name(p_client_id UUID)
RETURNS TEXT AS $$
  SELECT name FROM clients WHERE id = p_client_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- NOTE: No notification for new event requests to admin
-- The EventRequestsPanel already shows pending requests with a badge count
-- and real-time updates, so a notification would be redundant.
-- ============================================

-- Cleanup: Remove the redundant admin notification trigger if it exists
DROP TRIGGER IF EXISTS on_event_request_created ON event_requests;
DROP FUNCTION IF EXISTS notify_admin_on_event_request();

-- ============================================
-- TRIGGER: Event Request Approved/Rejected → Notify Client
-- ============================================
CREATE OR REPLACE FUNCTION notify_client_on_event_request_review()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
  v_title TEXT;
  v_message TEXT;
BEGIN
  -- Only trigger on status change
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get the client user
  v_client_user_id := get_client_user_id(NEW.client_id);
  
  IF v_client_user_id IS NOT NULL THEN
    IF NEW.status = 'approved' THEN
      v_title := 'בקשת האירוע אושרה';
      v_message := 'הבקשה "' || NEW.title || '" אושרה והאירוע נוסף ללוח';
    ELSIF NEW.status = 'rejected' THEN
      v_title := 'בקשת האירוע נדחתה';
      v_message := 'הבקשה "' || NEW.title || '" נדחתה';
    ELSE
      RETURN NEW;
    END IF;
    
    INSERT INTO notifications (user_id, type, title, message, event_request_id, client_id)
    VALUES (
      v_client_user_id,
      'event_request',
      v_title,
      v_message,
      NEW.id,
      NEW.client_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_request_reviewed ON event_requests;
CREATE TRIGGER on_event_request_reviewed
  AFTER UPDATE ON event_requests
  FOR EACH ROW EXECUTE FUNCTION notify_client_on_event_request_review();

-- ============================================
-- TRIGGER: Content Status → Pending → Notify Client
-- ============================================
CREATE OR REPLACE FUNCTION notify_client_on_content_pending()
RETURNS TRIGGER AS $$
DECLARE
  v_client_user_id UUID;
  v_content_type TEXT;
BEGIN
  -- Only trigger when status changes TO pending
  IF (TG_OP = 'INSERT' AND NEW.status = 'pending') OR 
     (TG_OP = 'UPDATE' AND OLD.status != 'pending' AND NEW.status = 'pending') THEN
    
    v_client_user_id := get_client_user_id(NEW.client_id);
    
    -- Map content type to Hebrew
    v_content_type := CASE NEW.type
      WHEN 'post' THEN 'פוסט'
      WHEN 'story' THEN 'סטורי'
      WHEN 'reel' THEN 'ריל'
      WHEN 'carousel' THEN 'קרוסלה'
      ELSE NEW.type
    END;
    
    IF v_client_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, message, content_id, client_id)
      VALUES (
        v_client_user_id,
        'content_pending',
        'תוכן חדש לאישור',
        v_content_type || ' חדש ממתין לאישורך',
        NEW.id,
        NEW.client_id
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_content_pending ON content;
CREATE TRIGGER on_content_pending
  AFTER INSERT OR UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION notify_client_on_content_pending();

-- ============================================
-- TRIGGER: Content Approved/Rejected by Client → Notify Admin
-- ============================================
CREATE OR REPLACE FUNCTION notify_admin_on_content_review()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
  v_client_name TEXT;
  v_content_type TEXT;
  v_title TEXT;
  v_message TEXT;
  v_notification_type TEXT;
BEGIN
  -- Only trigger on status change from pending
  IF OLD.status != 'pending' THEN
    RETURN NEW;
  END IF;
  
  -- Only handle approved or rejected
  IF NEW.status NOT IN ('approved', 'rejected') THEN
    RETURN NEW;
  END IF;
  
  v_admin_id := get_client_admin_id(NEW.client_id);
  v_client_name := get_client_name(NEW.client_id);
  
  v_content_type := CASE NEW.type
    WHEN 'post' THEN 'הפוסט'
    WHEN 'story' THEN 'הסטורי'
    WHEN 'reel' THEN 'הריל'
    WHEN 'carousel' THEN 'הקרוסלה'
    ELSE 'התוכן'
  END;
  
  IF NEW.status = 'approved' THEN
    v_title := 'תוכן אושר!';
    v_message := v_client_name || ' אישר/ה את ' || v_content_type;
    v_notification_type := 'content_approved';
  ELSE
    v_title := 'תוכן נדחה';
    v_message := v_client_name || ' דחה/תה את ' || v_content_type;
    v_notification_type := 'content_pending'; -- Using content_pending for rejected too
  END IF;
  
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, content_id, client_id)
    VALUES (
      v_admin_id,
      v_notification_type,
      v_title,
      v_message,
      NEW.id,
      NEW.client_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_content_reviewed ON content;
CREATE TRIGGER on_content_reviewed
  AFTER UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION notify_admin_on_content_review();

-- ============================================
-- Add 'rejected' status to content table
-- ============================================
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_status_check;
ALTER TABLE content ADD CONSTRAINT content_status_check 
  CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published'));

-- ============================================
-- Add rejection_reason column to content
-- ============================================
ALTER TABLE content ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
