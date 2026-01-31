-- ============================================
-- Content Creator OS - Multi-Admin Support
-- Run this in Supabase SQL Editor AFTER previous migrations
-- ============================================

-- ============================================
-- SCHEMA CHANGES
-- ============================================

-- Add owner_id to clients table (the admin who owns this client)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_owner_id ON clients(owner_id);

-- ============================================
-- UPDATE RLS POLICIES FOR CLIENTS
-- ============================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Admin can view all clients" ON clients;
DROP POLICY IF EXISTS "Admin can insert clients" ON clients;
DROP POLICY IF EXISTS "Admin can update clients" ON clients;
DROP POLICY IF EXISTS "Admin can delete clients" ON clients;

-- Admin can view only their owned clients
CREATE POLICY "Admin can view owned clients"
  ON clients FOR SELECT
  USING (is_admin() AND owner_id = auth.uid());

-- Admin can insert clients (automatically becomes owner)
CREATE POLICY "Admin can insert clients"
  ON clients FOR INSERT
  WITH CHECK (is_admin() AND owner_id = auth.uid());

-- Admin can update only their owned clients
CREATE POLICY "Admin can update owned clients"
  ON clients FOR UPDATE
  USING (is_admin() AND owner_id = auth.uid())
  WITH CHECK (is_admin() AND owner_id = auth.uid());

-- Admin can delete only their owned clients
CREATE POLICY "Admin can delete owned clients"
  ON clients FOR DELETE
  USING (is_admin() AND owner_id = auth.uid());

-- ============================================
-- UPDATE RLS POLICIES FOR CONTENT
-- ============================================

-- Drop old admin content policies
DROP POLICY IF EXISTS "Admin can view all content" ON content;
DROP POLICY IF EXISTS "Admin can insert content" ON content;
DROP POLICY IF EXISTS "Admin can update all content" ON content;
DROP POLICY IF EXISTS "Admin can delete content" ON content;

-- Admin can view content for their owned clients
CREATE POLICY "Admin can view owned clients content"
  ON content FOR SELECT
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- Admin can insert content for their owned clients
CREATE POLICY "Admin can insert content for owned clients"
  ON content FOR INSERT
  WITH CHECK (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- Admin can update content for their owned clients
CREATE POLICY "Admin can update owned clients content"
  ON content FOR UPDATE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- Admin can delete content for their owned clients
CREATE POLICY "Admin can delete owned clients content"
  ON content FOR DELETE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- ============================================
-- UPDATE RLS POLICIES FOR EVENTS
-- ============================================

DROP POLICY IF EXISTS "Admin can view all events" ON events;
DROP POLICY IF EXISTS "Admin can insert events" ON events;
DROP POLICY IF EXISTS "Admin can update events" ON events;
DROP POLICY IF EXISTS "Admin can delete events" ON events;

CREATE POLICY "Admin can view owned clients events"
  ON events FOR SELECT
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can insert events for owned clients"
  ON events FOR INSERT
  WITH CHECK (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can update owned clients events"
  ON events FOR UPDATE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can delete owned clients events"
  ON events FOR DELETE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- ============================================
-- UPDATE RLS POLICIES FOR EVENT REQUESTS
-- ============================================

DROP POLICY IF EXISTS "Admin can view all event requests" ON event_requests;
DROP POLICY IF EXISTS "Admin can update event requests" ON event_requests;

CREATE POLICY "Admin can view owned clients event requests"
  ON event_requests FOR SELECT
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can update owned clients event requests"
  ON event_requests FOR UPDATE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- ============================================
-- UPDATE RLS POLICIES FOR MONTHLY THEMES
-- ============================================

DROP POLICY IF EXISTS "Admin can manage monthly themes" ON monthly_themes;

CREATE POLICY "Admin can view owned clients themes"
  ON monthly_themes FOR SELECT
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can insert themes for owned clients"
  ON monthly_themes FOR INSERT
  WITH CHECK (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can update owned clients themes"
  ON monthly_themes FOR UPDATE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can delete owned clients themes"
  ON monthly_themes FOR DELETE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- ============================================
-- UPDATE RLS POLICIES FOR STICKERS
-- ============================================

DROP POLICY IF EXISTS "Admin can manage stickers" ON stickers;

CREATE POLICY "Admin can view owned clients stickers"
  ON stickers FOR SELECT
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can insert stickers for owned clients"
  ON stickers FOR INSERT
  WITH CHECK (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can update owned clients stickers"
  ON stickers FOR UPDATE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can delete owned clients stickers"
  ON stickers FOR DELETE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

-- ============================================
-- UPDATE RLS POLICIES FOR CUSTOM STICKER BANK
-- ============================================

DROP POLICY IF EXISTS "Admin can manage custom stickers" ON custom_sticker_bank;

CREATE POLICY "Admin can view owned clients custom stickers"
  ON custom_sticker_bank FOR SELECT
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can insert custom stickers for owned clients"
  ON custom_sticker_bank FOR INSERT
  WITH CHECK (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );

CREATE POLICY "Admin can delete owned clients custom stickers"
  ON custom_sticker_bank FOR DELETE
  USING (
    is_admin() AND 
    client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid())
  );
