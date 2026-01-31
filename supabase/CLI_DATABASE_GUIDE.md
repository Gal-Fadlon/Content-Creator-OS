# Supabase Database Guide

This guide explains how to connect to the database and query tables.

## Method 1: REST API with curl (Recommended)

Use the service_role key to bypass RLS and query tables directly via HTTP.

### Setup

Set environment variables for convenience:
```bash
export SUPABASE_URL="https://tjvfbmtprqxnyweziiqg.supabase.co"
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqdmZibXRwcnF4bnl3ZXppaXFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzOTI5MiwiZXhwIjoyMDg0MDE1MjkyfQ.bx5uaSTfAtk-QDmOy28l0zOssZH-jLBr6b_q796j3Ao"
```

### Read Tables

**Profiles:**
```bash
curl -s "$SUPABASE_URL/rest/v1/profiles?select=id,email,role,client_id" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" | jq .
```

**Clients:**
```bash
curl -s "$SUPABASE_URL/rest/v1/clients?select=id,name,slug,owner_id" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" | jq .
```

**Content:**
```bash
curl -s "$SUPABASE_URL/rest/v1/content?select=id,client_id,type,status,scheduled_date&limit=20" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" | jq .
```

**Events:**
```bash
curl -s "$SUPABASE_URL/rest/v1/events?select=id,client_id,title,event_date" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" | jq .
```

**Event Requests:**
```bash
curl -s "$SUPABASE_URL/rest/v1/event_requests?select=id,client_id,title,status" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" | jq .
```

**Notifications:**
```bash
curl -s "$SUPABASE_URL/rest/v1/notifications?select=id,client_id,type,is_read&limit=20" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" | jq .
```

### Insert Data

```bash
curl -s -X POST "$SUPABASE_URL/rest/v1/profiles" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "id": "USER_UUID_HERE",
    "email": "user@example.com",
    "full_name": "User Name",
    "role": "client",
    "client_id": "CLIENT_UUID_HERE"
  }' | jq .
```

### Update Data

```bash
curl -s -X PATCH "$SUPABASE_URL/rest/v1/profiles?id=eq.USER_UUID_HERE" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"role": "admin"}' | jq .
```

### Delete Data

```bash
curl -s -X DELETE "$SUPABASE_URL/rest/v1/profiles?id=eq.USER_UUID_HERE" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
```

### Query Filters

| Filter | Example |
|--------|---------|
| Equal | `?column=eq.value` |
| Not Equal | `?column=neq.value` |
| Greater Than | `?column=gt.value` |
| Less Than | `?column=lt.value` |
| In List | `?column=in.(a,b,c)` |
| Is Null | `?column=is.null` |
| Order | `?order=column.asc` |
| Limit | `?limit=10` |

---

## Method 2: Supabase CLI

### Prerequisites

1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Login to Supabase:
```bash
npx supabase login
```

3. Link your project (run from project root):
```bash
supabase link --project-ref tjvfbmtprqxnyweziiqg
```

### Querying Tables

Use `supabase db query` to run SQL against the remote database.

### View All Tables
```bash
supabase db query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
```

### Read Table Data

**Profiles (users):**
```bash
supabase db query "SELECT id, email, role, client_id FROM profiles"
```

**Clients:**
```bash
supabase db query "SELECT id, name, slug, owner_id FROM clients"
```

**Content:**
```bash
supabase db query "SELECT id, client_id, type, status, scheduled_date FROM content LIMIT 20"
```

**Events:**
```bash
supabase db query "SELECT id, client_id, title, event_date FROM events"
```

**Event Requests:**
```bash
supabase db query "SELECT id, client_id, title, status FROM event_requests"
```

**Monthly Themes:**
```bash
supabase db query "SELECT id, client_id, month_key, theme FROM monthly_themes"
```

**Notifications:**
```bash
supabase db query "SELECT id, client_id, type, is_read FROM notifications LIMIT 20"
```

### Useful Queries

**Count rows in a table:**
```bash
supabase db query "SELECT COUNT(*) FROM content"
```

**View table structure:**
```bash
supabase db query "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles'"
```

**View RLS policies:**
```bash
supabase db query "SELECT policyname, tablename, cmd FROM pg_policies WHERE schemaname = 'public'"
```

**Join profiles with clients:**
```bash
supabase db query "SELECT p.email, p.role, c.name as client_name FROM profiles p LEFT JOIN clients c ON p.client_id = c.id"
```

## Tips

- Wrap complex queries in double quotes
- Use `LIMIT` for large tables
- Use `\x` in psql for expanded display (not available in `supabase db query`)
- For interactive sessions, use the Supabase Dashboard SQL Editor

## Alternative: Direct psql Connection

Get your connection string from Supabase Dashboard → Settings → Database → Connection string, then:

```bash
psql "postgresql://postgres:[PASSWORD]@db.tjvfbmtprqxnyweziiqg.supabase.co:5432/postgres"
```
