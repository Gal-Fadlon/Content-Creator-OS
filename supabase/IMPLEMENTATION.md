# Supabase Implementation

## Structure

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql      # Tables, indexes, triggers
│   ├── 002_row_level_security.sql  # RLS policies
│   ├── 003_seed_test_user.sql      # Test data setup
│   ├── 004_multi_admin_support.sql # Multi-admin isolation
│   ├── 005_notification_triggers.sql # Auto-notifications
│   ├── 006_content_comments.sql    # Comments table & triggers
│   ├── 007_comment_notification_link.sql # Links comments to notifications
│   ├── 008_separate_grid_calendar.sql # Separates grid and calendar content
│   ├── 009_content_media.sql          # Multi-image support table
│   ├── 010_remove_legacy_media_columns.sql # Removes deprecated media_url/media_type
│   └── 011_admin_tasks.sql                # Admin tasks table (Kanban board)
├── functions/
│   ├── generate-upload-url/        # Edge Function for R2 signed URLs
│   └── delete-file/                # Edge Function for R2 file deletion
└── README.md                       # Setup guide
```

## Migrations

Run in Supabase SQL Editor in order (001 → 008).

## Notification Triggers (005, 006, 007)

Automatic notifications for:
- Event request created → Notify admin
- Event request approved/rejected → Notify client
- Content set to pending → Notify client
- Content approved/rejected by client → Notify admin
- New comment on content → Notify other party

Migration 007 adds `comment_id` column to notifications with `ON DELETE CASCADE`, so when a comment is deleted, its notification is automatically removed.

## Grid/Calendar Separation (008)

Migration 008 adds `source` column to content table with values 'calendar' or 'grid'. This completely separates grid and calendar content - they are now independent systems with no shared data.

## Multi-Image Support (009, 010)

Migration 009 adds `content_media` table for multi-image support per content item. Migration 010 removes legacy `media_url`/`media_type` columns from content table.

## Admin Tasks (011)

Migration 011 adds `admin_tasks` table for personal task management (Kanban board). Each admin manages their own tasks independently. RLS ensures admins can only access their own tasks via `is_admin() AND owner_id = auth.uid()`.

## Multi-Admin Support

Migration 004 adds `owner_id` to clients table. Each admin sees only their own clients.

## Edge Functions

- `generate-upload-url` - Generates presigned URLs for Cloudflare R2 uploads
- `delete-file` - Deletes files from Cloudflare R2 storage
