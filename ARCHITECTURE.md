# Frontend Architecture

> **For LLMs**: Read this file first for project overview. See `/BEST_PRACTICES.md` for coding conventions.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **MUI v5** (Material UI) with Emotion
- **React Query** (@tanstack/react-query) for server state
- **@hello-pangea/dnd** for drag-and-drop (Kanban board)
- **Axios** for HTTP
- **RTL Hebrew** application

## Project Structure

```
frontend/src/
├── components/
│   ├── common/          # Reusable UI (DatePicker, Snackbar)
│   ├── features/        # Domain components by feature
│   │   ├── calendar/    # Calendar view
│   │   ├── content/     # Content modal & forms
│   │   ├── events/      # Event request components
│   │   ├── filter/      # Filter controls
│   │   ├── grid/        # Instagram-style grid
│   │   ├── kanban/      # Kanban board (Board, Column, Card, Modal, Filters)
│   │   └── stickers/    # Sticker overlay system
│   └── layout/          # AppLayout, SideMenu, AppHeader
├── constants/           # Strings, calendar, stickers constants
├── context/providers/   # React Context providers
├── data/                # Mock data
├── hooks/queries/       # React Query hooks
├── pages/               # Page components (Dashboard, TaskManager, NotFound)
├── services/            # API layer with mock toggle
├── theme/               # MUI theme (palette, typography, components)
├── types/               # TypeScript definitions
├── hooks/               # Shared hooks (used across features)
└── helpers/             # Shared helper functions
```

## Import Alias

Use `@/` for absolute imports: `import { useAuth } from '@/context/providers/AuthProvider';`

## State Management

| Type | Solution |
|------|----------|
| Server data (API) | React Query hooks in `/hooks/queries/` |
| UI state (global) | React Context in `/context/providers/` |
| Local state | React `useState`/`useReducer` |

## Mock API Toggle

`VITE_USE_MOCK_API=true` (default) uses mock services, `=false` uses real API.

---

## Detailed Implementation Docs

| Path | Description |
|------|-------------|
| `frontend/src/components/common/IMPLEMENTATION.md` | DatePicker, Snackbar, LoadingSpinner, AuthGuard |
| `frontend/src/components/features/IMPLEMENTATION.md` | Calendar, content, grid, stickers, events, filter, kanban |
| `frontend/src/components/layout/IMPLEMENTATION.md` | AppLayout, SideMenu, AppHeader, ClientSelector, NotificationBell |
| `frontend/src/constants/IMPLEMENTATION.md` | String constants, calendar, stickers |
| `frontend/src/context/IMPLEMENTATION.md` | Context providers and hooks |
| `frontend/src/hooks/IMPLEMENTATION.md` | React Query hooks |
| `frontend/src/pages/IMPLEMENTATION.md` | Dashboard, TaskManager, Login, NotFound pages |
| `frontend/src/services/IMPLEMENTATION.md` | Services, Supabase, storage |
| `frontend/src/theme/IMPLEMENTATION.md` | MUI theme configuration |
| `supabase/IMPLEMENTATION.md` | Migrations and Edge Functions |

---

# Production Architecture

> **Principal Solutions Architect Design Document**

## Executive Summary

| Attribute | Value |
|-----------|-------|
| **System Name** | Content Creator OS |
| **Type** | Multi-tenant SaaS |
| **Initial Scale** | 1 Admin + 10 Clients |
| **Target Scale** | 100+ Clients |
| **Primary Language** | Hebrew (RTL) |
| **Monthly Cost** | ~$29 (initial) |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   INTERNET                                       │
└─────────────────────────────────────┬───────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE (Edge Layer)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │     DNS      │  │  SSL/TLS     │  │   WAF        │  │  DDoS Protection     │ │
│  │  (Routing)   │  │  (HTTPS)     │  │  (Security)  │  │  (Rate Limiting)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────┘ │
└────────────┬────────────────────────────────────┬───────────────────────────────┘
             │                                    │
             ▼                                    ▼
┌────────────────────────┐           ┌────────────────────────────────────────────┐
│        VERCEL          │           │              CLOUDFLARE R2                  │
│   (Frontend Hosting)   │           │           (Media Storage + CDN)             │
│  ┌──────────────────┐  │           │  ┌──────────────────────────────────────┐  │
│  │   React/Vite     │  │           │  │  images/                             │  │
│  │   Static SPA     │  │           │  │  ├── clients/{client_id}/            │  │
│  │   (SSG/CSR)      │  │           │  │  │   ├── content/{content_id}.webp   │  │
│  └──────────────────┘  │           │  │  │   └── profile/avatar.webp         │  │
│                        │           │  │  └── stickers/                       │  │
│  app.yourdomain.com    │           │  └──────────────────────────────────────┘  │
└───────────┬────────────┘           │                                            │
            │                        │  media.yourdomain.com                      │
            │                        └────────────────────────────────────────────┘
            │
            │  REST API + WebSocket
            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE (Backend-as-a-Service)                     │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   Authentication    │  │     PostgreSQL      │  │    Realtime (Optional)  │  │
│  │  ┌───────────────┐  │  │  ┌───────────────┐  │  │  ┌───────────────────┐  │  │
│  │  │ Email/Pass    │  │  │  │   profiles    │  │  │  │  WebSocket        │  │  │
│  │  │ JWT Tokens    │  │  │  │   clients     │  │  │  │  subscriptions    │  │  │
│  │  │ Session Mgmt  │  │  │  │   content     │  │  │  │  (notifications)  │  │  │
│  │  │ Password Reset│  │  │  │   events      │  │  │  └───────────────────┘  │  │
│  │  └───────────────┘  │  │  │   notifications│ │  │                         │  │
│  │                     │  │  │   + RLS       │  │  └─────────────────────────┘  │
│  └─────────────────────┘  │  └───────────────┘  │                               │
│                           │                     │                               │
│  ┌─────────────────────┐  │  ┌───────────────┐  │                               │
│  │   Edge Functions    │  │  │  Row Level    │  │                               │
│  │  (Serverless API)   │  │  │  Security     │  │                               │
│  │  ┌───────────────┐  │  │  │  (RLS)        │  │                               │
│  │  │ Upload signed │  │  │  │               │  │                               │
│  │  │ URL generator │  │  │  │ Data isolation│  │                               │
│  │  │ Image resize  │  │  │  │ per client    │  │                               │
│  │  └───────────────┘  │  │  └───────────────┘  │                               │
│  └─────────────────────┘  └─────────────────────┘                               │
│                                                                                  │
│  api.yourdomain.com (or *.supabase.co)                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend (Supabase)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Database | PostgreSQL 15 | Relational data |
| Auth | Supabase Auth | JWT, sessions |
| API | PostgREST (auto-generated) | REST endpoints |
| Security | Row Level Security (RLS) | Data isolation |
| Functions | Edge Functions (Deno) | Custom logic |
| Realtime | Supabase Realtime | Live updates |

### Infrastructure

| Layer | Technology | Purpose |
|-------|------------|---------|
| CDN/DNS | Cloudflare | Edge caching, security |
| Media Storage | Cloudflare R2 | S3-compatible storage (zero egress fees) |
| Frontend Hosting | Vercel | Static hosting, CI/CD |
| Domain | Namecheap | Domain registration |

---

## Data Architecture

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │    profiles     │       │    clients      │
│   (Supabase)    │       │                 │       │                 │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │──────►│ id (UUID) PK/FK │       │ id (UUID) PK    │
│ email           │       │ email           │       │ name            │
│ encrypted_pass  │       │ full_name       │◄──────│ slug            │
│ created_at      │       │ role            │       │ description     │
│                 │       │ client_id FK    │───────│ avatar_url      │
└────────┬────────┘       │ avatar_url      │       │ brand_color     │
         │                │ created_at      │       │ owner_id FK ────┼──► (admin user)
         │                │ updated_at      │       │ created_at      │
         │                └─────────────────┘       │ updated_at      │
         └───────────────────────────────────────────────────────────┘
                                                             │
                          ┌──────────────────────────────────┼──────────────────┐
                          │                                  │                  │
                          ▼                                  ▼                  ▼
               ┌─────────────────┐              ┌─────────────────┐  ┌─────────────────┐
               │     content     │              │     events      │  │ monthly_themes  │
               ├─────────────────┤              ├─────────────────┤  ├─────────────────┤
               │ id (UUID) PK    │              │ id (UUID) PK    │  │ id (UUID) PK    │
               │ client_id FK    │              │ client_id FK    │  │ client_id FK    │
               │ type            │              │ title           │  │ month, year     │
               │ status          │              │ description     │  │ theme_text      │
               │ scheduled_date  │              │ event_date      │  │ backdrop_url    │
               │ scheduled_time  │              │ color           │  │ created_at      │
               │ caption         │              │ item_type       │  └─────────────────┘
               │ platform        │              │ is_completed    │
               │ cover_image_url │              │ created_by FK   │
               │ thumbnail_url   │              │ created_at      │
               │ grid_zoom       │              │ updated_at      │
               │ grid_offset_x/y │              └─────────────────┘
               │ grid_zoom       │
               │ grid_offset_x/y │              ┌─────────────────┐
               │ grid_order      │              │  content_media  │
               │ source          │              ├─────────────────┤
               │ created_by FK   │              │ id (UUID) PK    │
               │ approved_by FK  │              │ content_id FK   │
               │ approved_at     │              │ media_url       │
               │ rejection_reason│              │ media_type      │
               │ created_at      │              │ sort_order      │
               │ updated_at      │              │ storage_key     │
               └────────┬────────┘              │ file_size       │
                        │                       │ width, height   │
                        │ 1:N                   │ created_at      │
                        └──────────────────────►└─────────────────┘

               ┌─────────────────┐              ┌─────────────────┐
               │  admin_tasks    │              │  event_requests │
               ├─────────────────┤              ├─────────────────┤
               │ id (UUID) PK    │              │ id (UUID) PK    │
               │ owner_id FK ────┼──► auth.users│ client_id FK    │
               │ title           │              │ requested_by FK │
               │ description     │              │ title           │
               │ status          │              │ description     │
               │ priority        │              │ requested_date  │
               │ due_date        │              │ status          │
               │ color_label     │              │ reviewed_by FK  │
               │ sort_order      │              │ reviewed_at     │
               │ created_at      │              │ created_at      │
               │ updated_at      │              └─────────────────┘
               └─────────────────┘

               ┌─────────────────┐
               │content_comments │
               ├─────────────────┤
               │ id (UUID) PK    │
               │ content_id FK   │
               │ user_id FK      │
               │ author_name     │
               │ author_role     │
               │ message         │
               │ created_at      │
               └─────────────────┘

               ┌─────────────────┐              ┌─────────────────┐
               │   stickers      │              │  notifications  │
               ├─────────────────┤              ├─────────────────┤
               │ id (UUID) PK    │              │ id (UUID) PK    │
               │ client_id FK    │              │ user_id FK      │
               │ month, year     │              │ client_id FK    │
               │ sticker_type    │              │ type            │
               │ icon_type       │              │ title, message  │
               │ lucide_icon     │              │ content_id FK   │
               │ label, color    │              │ event_request_id│
               │ position_x/y    │              │ comment_id FK   │
               │ rotation, scale │              │ is_read         │
               │ custom_image_url│              │ created_at      │
               │ created_at      │              └─────────────────┘
               └─────────────────┘
```

### Role-Based Access Control (RBAC)

| Role | Capabilities |
|------|-------------|
| **Admin** | View **owned** clients only, manage their content, approve requests, manage events, personal task board (Kanban) |
| **Client** | View own dashboard only, approve/reject content, request events, view own content |

### Multi-Admin Support

Each admin can only see/manage their own clients. This enables multiple agencies or managers to use the same platform without seeing each other's data.

| Admin | Owns | Can See |
|-------|------|---------|
| Rotem | Client A, Client B | Only A and B |
| Other Admin | Client C, Client D | Only C and D |

The `clients.owner_id` field links each client to their managing admin.

### Row Level Security (RLS)

Data isolation is enforced at the database level:

```sql
-- Helper functions
CREATE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE FUNCTION get_my_client_id() RETURNS UUID AS $$
  SELECT client_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Admin sees only OWNED clients (multi-admin isolation)
CREATE POLICY "Admin can view owned clients"
  ON clients FOR SELECT
  USING (is_admin() AND owner_id = auth.uid());

-- Admin sees content for owned clients only
CREATE POLICY "Admin can view owned clients content"
  ON content FOR SELECT
  USING (is_admin() AND client_id IN (SELECT id FROM clients WHERE owner_id = auth.uid()));

-- Clients see only their own content
CREATE POLICY "Clients can view own content"
  ON content FOR SELECT
  USING (client_id = get_my_client_id());

-- Admin tasks: per-admin isolation (not per-client)
CREATE POLICY "Admins can view own tasks"
  ON admin_tasks FOR SELECT
  USING (is_admin() AND owner_id = auth.uid());
```

---

## Media Storage (Cloudflare R2)

### Why R2?

| Solution | Storage (200GB) | Egress (1TB/mo) | Total/Month |
|----------|-----------------|-----------------|-------------|
| AWS S3 + CloudFront | $4.60 | $85.00 | $89.60 |
| Google Cloud Storage | $4.00 | $120.00 | $124.00 |
| **Cloudflare R2** | $3.00 | **$0** | **$3.00** |

### Bucket Structure

```
r2-bucket: content-creator-media
├── clients/
│   └── {client_id}/
│       ├── content/{content_id}.webp
│       ├── profile/avatar.webp
│       └── stickers/{sticker_id}.webp
├── backdrops/
│   ├── preset/
│   └── custom/
└── system/
```

---

## Security Architecture

### Security Layers

| Layer | Protection |
|-------|------------|
| **Edge (Cloudflare)** | DDoS, WAF, Rate Limiting, Bot Detection |
| **Transport** | TLS 1.3, HSTS Headers |
| **Application** | JWT Validation, CORS, CSP Headers |
| **Data** | Row Level Security, Encrypted at Rest |

### Security Checklist

| Threat | Mitigation |
|--------|------------|
| Unauthorized access | Row Level Security (RLS) |
| Cross-client data leakage | Tenant isolation via client_id |
| XSS attacks | Content Security Policy |
| CSRF attacks | SameSite cookies |
| SQL injection | Parameterized queries (Supabase client) |
| Brute force | Rate limiting (Cloudflare + Supabase) |
| Token theft | Short-lived JWTs (1 hour) + refresh |

---

## Deployment

### Domain Configuration (Cloudflare DNS)

| Record | Type | Value |
|--------|------|-------|
| `@` | A | 76.76.21.21 (Vercel) |
| `www` | CNAME | cname.vercel-dns.com |
| `media` | CNAME | your-r2-bucket.r2.dev |

### Environment Variables

```bash
# Frontend (.env.production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_MEDIA_URL=https://media.yourdomain.com
VITE_USE_MOCK_API=false
```

---

## Cost Summary

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Supabase | Pro | $25.00 |
| Cloudflare R2 | Pay-as-you-go (200GB) | $3.00 |
| Cloudflare | Free | $0.00 |
| Vercel | Free | $0.00 |
| Namecheap | Domain (annual/12) | ~$1.00 |
| **Total** | | **~$29/month** |

### Scaling Costs

| Clients | Storage | Monthly Cost |
|---------|---------|--------------|
| 10 | 200GB | $28 |
| 50 | 1TB | $40 |
| 100 | 2TB | $105 |

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Create Supabase project
- [ ] Run database migrations
- [ ] Configure RLS policies
- [ ] Set up Cloudflare R2 bucket
- [ ] Create initial admin + client users

### Phase 2: Integration (Week 2)
- [ ] Replace mock services with Supabase client
- [ ] Implement auth flow with Supabase Auth
- [ ] Create upload flow with R2 signed URLs
- [ ] Test RLS policies

### Phase 3: Deployment (Week 3)
- [ ] Configure Vercel project
- [ ] Set up domain DNS in Cloudflare
- [ ] Configure environment variables
- [ ] Deploy and test production

### Phase 4: Polish (Week 4)
- [ ] Set up monitoring dashboards
- [ ] Create client onboarding flow
- [ ] Security audit

---

## Production Configuration (Live)

> **⚠️ IMPORTANT**: Do NOT commit these values to git. Use environment variables.

### Services Setup Status

| Service | Status | URL/Details |
|---------|--------|-------------|
| **Supabase** | ✅ Active | Frankfurt region, Free tier |
| **Cloudflare R2** | ✅ Active | Western Europe |
| **Cloudflare DNS** | ✅ Active | Managing `rzsocialmedia.com` |
| **Vercel** | ✅ Ready | Connected to GitHub |
| **Namecheap** | ✅ Configured | Nameservers pointing to Cloudflare |

### Supabase Configuration

| Key | Value |
|-----|-------|
| Project ID | `tjvfbmtprqxnyweziiqg` |
| Project URL | `https://tjvfbmtprqxnyweziiqg.supabase.co` |
| Region | Europe (Frankfurt) |
| Plan | Free (upgrade to Pro before production) |

**Environment Variables:**
```bash
VITE_SUPABASE_URL=https://tjvfbmtprqxnyweziiqg.supabase.co
VITE_SUPABASE_ANON_KEY=<stored in .env.local>
```

### Cloudflare R2 Configuration

| Key | Value |
|-----|-------|
| Bucket Name | `content-creator-media` |
| Account ID | `b863c1257ab18db66daf9754cf554593` |
| Endpoint | `https://b863c1257ab18db66daf9754cf554593.r2.cloudflarestorage.com` |
| Region | Western Europe (automatic) |
| Storage Class | Standard |

**Environment Variables (Server-side only):**
```bash
R2_ACCOUNT_ID=b863c1257ab18db66daf9754cf554593
R2_BUCKET_NAME=content-creator-media
R2_ENDPOINT=https://b863c1257ab18db66daf9754cf554593.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<stored securely>
R2_SECRET_ACCESS_KEY=<stored securely>
```

**CORS Policy (R2 Bucket Settings):**
```json
[{"AllowedOrigins":["http://localhost:*","https://rzsocialmedia.com","https://*.rzsocialmedia.com"],"AllowedMethods":["GET","PUT","POST","DELETE","HEAD"],"AllowedHeaders":["*"],"MaxAgeSeconds":3600}]
```

### Domain Configuration

| Key | Value |
|-----|-------|
| Domain | `rzsocialmedia.com` |
| Registrar | Namecheap |
| DNS Provider | Cloudflare |
| Nameservers | `elliot.ns.cloudflare.com`, `joselyn.ns.cloudflare.com` |
| SSL | Cloudflare Universal SSL (automatic) |
| Zone ID | `458acc3ff729619ca1e40c71198436b4` |

### Planned Subdomains

| Subdomain | Points To | Purpose |
|-----------|-----------|---------|
| `rzsocialmedia.com` | Vercel | Main app |
| `www.rzsocialmedia.com` | Vercel | Main app (redirect) |
| `media.rzsocialmedia.com` | Cloudflare R2 | Media CDN |

### DNS Records to Configure (After Propagation)

```
Type    Name    Value                           Proxy
─────   ────    ─────                           ─────
A       @       76.76.21.21                     Proxied (Vercel)
CNAME   www     cname.vercel-dns.com            Proxied
CNAME   media   <R2 public bucket URL>          Proxied
```

---

## Environment Files

### `.env.local` (Development - DO NOT COMMIT)

```bash
# Supabase
VITE_SUPABASE_URL=https://tjvfbmtprqxnyweziiqg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxx

# Feature Flags
VITE_USE_MOCK_API=false

# Media
VITE_MEDIA_URL=https://media.rzsocialmedia.com
```

### `.env.production` (Vercel Environment Variables)

```bash
VITE_SUPABASE_URL=https://tjvfbmtprqxnyweziiqg.supabase.co
VITE_SUPABASE_ANON_KEY=<set in Vercel dashboard>
VITE_USE_MOCK_API=false
VITE_MEDIA_URL=https://media.rzsocialmedia.com
```

### Supabase Edge Functions Secrets

```bash
R2_ENDPOINT=https://b863c1257ab18db66daf9754cf554593.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<set in Supabase dashboard>
R2_SECRET_ACCESS_KEY=<set in Supabase dashboard>
R2_BUCKET_NAME=content-creator-media
```
