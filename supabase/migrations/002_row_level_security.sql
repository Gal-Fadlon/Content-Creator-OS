-- ============================================
-- Content Creator OS - Row Level Security Policies
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_sticker_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND 
    role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- ============================================
-- CLIENTS POLICIES
-- ============================================

-- Admin can view all clients
CREATE POLICY "Admin can view all clients"
  ON clients FOR SELECT
  USING (is_admin());

-- Clients can view their own client record
CREATE POLICY "Clients can view own client record"
  ON clients FOR SELECT
  USING (id = get_my_client_id());

-- Admin can manage clients (insert, update, delete)
CREATE POLICY "Admin can insert clients"
  ON clients FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update clients"
  ON clients FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete clients"
  ON clients FOR DELETE
  USING (is_admin());

-- ============================================
-- CONTENT POLICIES
-- ============================================

-- Admin can view all content
CREATE POLICY "Admin can view all content"
  ON content FOR SELECT
  USING (is_admin());

-- Clients can view their own content
CREATE POLICY "Clients can view own content"
  ON content FOR SELECT
  USING (client_id = get_my_client_id());

-- Admin can insert content
CREATE POLICY "Admin can insert content"
  ON content FOR INSERT
  WITH CHECK (is_admin());

-- Admin can update all content
CREATE POLICY "Admin can update all content"
  ON content FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Clients can update their own content (status approval only)
CREATE POLICY "Clients can update own content status"
  ON content FOR UPDATE
  USING (
    client_id = get_my_client_id() AND 
    NOT is_admin()
  )
  WITH CHECK (
    client_id = get_my_client_id()
  );

-- Admin can delete content
CREATE POLICY "Admin can delete content"
  ON content FOR DELETE
  USING (is_admin());

-- ============================================
-- EVENTS POLICIES
-- ============================================

-- Admin can view all events
CREATE POLICY "Admin can view all events"
  ON events FOR SELECT
  USING (is_admin());

-- Clients can view their own events
CREATE POLICY "Clients can view own events"
  ON events FOR SELECT
  USING (client_id = get_my_client_id());

-- Admin can manage events
CREATE POLICY "Admin can insert events"
  ON events FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update events"
  ON events FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete events"
  ON events FOR DELETE
  USING (is_admin());

-- ============================================
-- EVENT REQUESTS POLICIES
-- ============================================

-- Admin can view all event requests
CREATE POLICY "Admin can view all event requests"
  ON event_requests FOR SELECT
  USING (is_admin());

-- Clients can view their own event requests
CREATE POLICY "Clients can view own event requests"
  ON event_requests FOR SELECT
  USING (client_id = get_my_client_id());

-- Clients can create event requests for themselves
CREATE POLICY "Clients can create own event requests"
  ON event_requests FOR INSERT
  WITH CHECK (
    client_id = get_my_client_id() AND
    requested_by = auth.uid()
  );

-- Admin can update event requests (approve/reject)
CREATE POLICY "Admin can update event requests"
  ON event_requests FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can delete event requests
CREATE POLICY "Admin can delete event requests"
  ON event_requests FOR DELETE
  USING (is_admin());

-- ============================================
-- MONTHLY THEMES POLICIES
-- ============================================

-- Admin can manage all themes
CREATE POLICY "Admin can view all themes"
  ON monthly_themes FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can insert themes"
  ON monthly_themes FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update themes"
  ON monthly_themes FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete themes"
  ON monthly_themes FOR DELETE
  USING (is_admin());

-- Clients can view their own themes
CREATE POLICY "Clients can view own themes"
  ON monthly_themes FOR SELECT
  USING (client_id = get_my_client_id());

-- ============================================
-- STICKERS POLICIES
-- ============================================

-- Admin can manage all stickers
CREATE POLICY "Admin can view all stickers"
  ON stickers FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can insert stickers"
  ON stickers FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update stickers"
  ON stickers FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete stickers"
  ON stickers FOR DELETE
  USING (is_admin());

-- Clients can view their own stickers
CREATE POLICY "Clients can view own stickers"
  ON stickers FOR SELECT
  USING (client_id = get_my_client_id());

-- ============================================
-- CUSTOM STICKER BANK POLICIES
-- ============================================

-- Admin can manage all custom stickers
CREATE POLICY "Admin can view all custom stickers"
  ON custom_sticker_bank FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can insert custom stickers"
  ON custom_sticker_bank FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete custom stickers"
  ON custom_sticker_bank FOR DELETE
  USING (is_admin());

-- Clients can view their own custom stickers
CREATE POLICY "Clients can view own custom stickers"
  ON custom_sticker_bank FOR SELECT
  USING (client_id = get_my_client_id());

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- System/Admin can create notifications for anyone
CREATE POLICY "Admin can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (is_admin() OR user_id = auth.uid());
