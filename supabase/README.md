# Supabase Setup Instructions

## Overview

This folder contains database migrations and Edge Functions for the Content Creator OS backend.

## Setup Steps

### Step 1: Run Database Migrations

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `tjvfbmtprqxnyweziiqg`
3. Navigate to **SQL Editor**
4. Run each migration file **in order**:

#### Migration 1: Initial Schema
Copy the contents of `migrations/001_initial_schema.sql` and run it.

This creates:
- `clients` - Business/brand records
- `profiles` - User profiles extending Supabase Auth
- `content` - Posts, stories, reels
- `events` - Calendar events
- `event_requests` - Client event requests
- `monthly_themes` - Monthly themes and backdrops
- `stickers` - Calendar stickers
- `custom_sticker_bank` - Custom sticker uploads
- `notifications` - User notifications

#### Migration 2: Row Level Security
Copy the contents of `migrations/002_row_level_security.sql` and run it.

This creates RLS policies for data isolation:
- Admins can view/manage all data
- Clients can only view their own data

#### Migration 3: Seed Test Data
Copy the contents of `migrations/003_seed_test_user.sql` and run it.

This creates sample data for testing.

---

### Step 2: Create Test Admin User

1. Go to **Authentication** → **Users** → **Add User**
2. Create user:
   - **Email**: `admin@rzsocialmedia.com`
   - **Password**: (choose a secure password)
   - **Auto Confirm User**: ✅ Yes
3. Copy the user's **UUID** from the dashboard
4. Run this SQL to make them admin (replace `YOUR_USER_UUID_HERE`):

```sql
UPDATE profiles 
SET 
  role = 'admin',
  full_name = 'Admin User'
WHERE id = 'YOUR_USER_UUID_HERE';
```

---

### Step 3: Deploy Edge Functions (Optional - for R2 uploads)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref tjvfbmtprqxnyweziiqg
```

4. Set secrets for R2:
```bash
supabase secrets set R2_ENDPOINT=https://b863c1257ab18db66daf9754cf554593.r2.cloudflarestorage.com
supabase secrets set R2_ACCESS_KEY_ID=9d6a71a8e20b3e744dd88b2c5d10b9d6
supabase secrets set R2_SECRET_ACCESS_KEY=<your-secret-key>
supabase secrets set R2_BUCKET_NAME=content-creator-media
supabase secrets set MEDIA_BASE_URL=https://media.rzsocialmedia.com
```

5. Deploy the function:
```bash
supabase functions deploy generate-upload-url
```

---

### Step 4: Create .env.local in Frontend

Create `frontend/.env.local` with:

```bash
VITE_SUPABASE_URL=https://tjvfbmtprqxnyweziiqg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_wNnjBfKBooSsDHbMJ--I9A_L0x3WelZ
VITE_USE_MOCK_API=false
VITE_MEDIA_URL=https://media.rzsocialmedia.com
```

---

## Verification

After setup, verify by running:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check profiles
SELECT * FROM profiles;

-- Check clients
SELECT * FROM clients;
```

---

## Common Issues

### "permission denied for table X"
RLS is enabled and you're not authenticated or don't have access. Make sure you're using a valid JWT.

### "relation X does not exist"
Run the migrations in order: 001, then 002, then 003.

### Profile not created on signup
Check that the `on_auth_user_created` trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
