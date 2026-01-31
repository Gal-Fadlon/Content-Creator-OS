-- ============================================
-- Content Creator OS - Seed Test Data
-- Run this AFTER creating a user in Supabase Auth Dashboard
-- ============================================

-- ============================================
-- STEP 1: Create the test user in Supabase Auth Dashboard
-- ============================================
-- Go to: Supabase Dashboard → Authentication → Users → Add User
-- Email: admin@rzsocialmedia.com
-- Password: (your secure password)
-- 
-- After creating the user, get the user's UUID from the dashboard
-- and replace 'YOUR_USER_UUID_HERE' below with the actual UUID

-- ============================================
-- STEP 2: Update the profile to be admin
-- Replace YOUR_USER_UUID_HERE with the actual UUID
-- ============================================

-- UPDATE profiles 
-- SET 
--   role = 'admin',
--   full_name = 'Admin User'
-- WHERE id = 'YOUR_USER_UUID_HERE';

-- ============================================
-- STEP 3: Create a sample client for testing
-- ============================================
INSERT INTO clients (id, name, slug, description, brand_color)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'לקוח לדוגמה',
  'demo-client',
  'לקוח לדוגמה לבדיקות המערכת',
  '#823d22'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- STEP 4: Create sample content for the demo client
-- ============================================
INSERT INTO content (id, client_id, type, status, platform, scheduled_date, caption, creative_description)
VALUES 
  (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'post',
    'draft',
    'instagram',
    CURRENT_DATE + INTERVAL '1 day',
    'פוסט לדוגמה - טיוטה',
    'תיאור קריאייטיב לפוסט הראשון'
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'story',
    'pending',
    'instagram',
    CURRENT_DATE + INTERVAL '2 days',
    'סטורי לדוגמה - ממתין לאישור',
    'תיאור קריאייטיב לסטורי'
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'reel',
    'approved',
    'instagram',
    CURRENT_DATE + INTERVAL '3 days',
    'ריל לדוגמה - מאושר',
    'תיאור קריאייטיב לריל'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Create sample events
-- ============================================
INSERT INTO events (id, client_id, title, description, event_date, color)
VALUES 
  (
    'e0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'אירוע לדוגמה',
    'תיאור האירוע הראשון',
    CURRENT_DATE + INTERVAL '5 days',
    'blue'
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'יום הולדת ללקוח',
    'לזכור לפרסם ברכה',
    CURRENT_DATE + INTERVAL '10 days',
    'red'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES (run to verify data)
-- ============================================
-- SELECT * FROM clients;
-- SELECT * FROM profiles;
-- SELECT * FROM content WHERE client_id = 'c0000000-0000-0000-0000-000000000001';
-- SELECT * FROM events WHERE client_id = 'c0000000-0000-0000-0000-000000000001';
