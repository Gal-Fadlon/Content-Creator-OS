# Frontend Architecture

> **For LLMs**: Read this file first for project overview. See `/BEST_PRACTICES.md` for coding conventions.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **MUI v5** (Material UI) with Emotion
- **React Query** (@tanstack/react-query) for server state
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
│   │   └── stickers/    # Sticker overlay system
│   └── layout/          # App-level layout
├── constants/           # Strings, calendar, stickers constants
├── context/providers/   # React Context providers
├── data/                # Mock data
├── hooks/queries/       # React Query hooks
├── pages/               # Page components (Dashboard, NotFound)
├── services/            # API layer with mock toggle
├── theme/               # MUI theme (palette, typography, components)
└── types/               # TypeScript definitions
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
| `components/common/IMPLEMENTATION.md` | DatePicker and Snackbar components |
| `components/features/IMPLEMENTATION.md` | Calendar, content, grid, stickers, events, filter components |
| `components/layout/IMPLEMENTATION.md` | AppHeader, ClientSelector, NotificationBell, etc. |
| `constants/IMPLEMENTATION.md` | String constants, calendar names, sticker definitions |
| `context/IMPLEMENTATION.md` | All context providers and their hooks |
| `hooks/IMPLEMENTATION.md` | React Query hooks for CRUD operations |
| `pages/IMPLEMENTATION.md` | Dashboard and NotFound pages |
| `services/IMPLEMENTATION.md` | API services, mock toggle, query keys |
| `theme/IMPLEMENTATION.md` | MUI theme, palette, typography, component overrides |

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
│ created_at      │       │ role            │       │ avatar_url      │
│                 │       │ client_id FK    │───────│ brand_color     │
└─────────────────┘       │ avatar_url      │       │ created_at      │
                          │ created_at      │       │ updated_at      │
                          └─────────────────┘       └────────┬────────┘
                                                             │
                          ┌──────────────────────────────────┼──────────────────┐
                          │                                  │                  │
                          ▼                                  ▼                  ▼
               ┌─────────────────┐              ┌─────────────────┐  ┌─────────────────┐
               │     content     │              │     events      │  │ monthly_themes  │
               ├─────────────────┤              ├─────────────────┤  ├─────────────────┤
               │ id (UUID) PK    │              │ id (UUID) PK    │  │ id (UUID) PK    │
               │ client_id FK    │              │ client_id FK    │  │ client_id FK    │
               │ type            │              │ title           │  │ month (INT)     │
               │ status          │              │ description     │  │ year (INT)      │
               │ scheduled_date  │              │ event_date      │  │ theme_text      │
               │ caption         │              │ color           │  │ backdrop_url    │
               │ media_url       │              │ created_by FK   │  │ created_at      │
               │ media_type      │              │ created_at      │  └─────────────────┘
               │ creative_desc   │              │ updated_at      │
               │ display_order   │              └─────────────────┘
               │ zoom_level      │
               │ offset_x        │              ┌─────────────────┐
               │ offset_y        │              │  event_requests │
               │ created_by FK   │              ├─────────────────┤
               │ approved_by FK  │              │ id (UUID) PK    │
               │ approved_at     │              │ client_id FK    │
               │ created_at      │              │ requested_by FK │
               │ updated_at      │              │ title           │
               └─────────────────┘              │ description     │
                                                │ requested_date  │
               ┌─────────────────┐              │ status          │
               │   stickers      │              │ reviewed_by FK  │
               ├─────────────────┤              │ reviewed_at     │
               │ id (UUID) PK    │              │ created_at      │
               │ client_id FK    │              └─────────────────┘
               │ month (INT)     │
               │ year (INT)      │              ┌─────────────────┐
               │ sticker_type    │              │  notifications  │
               │ position_x      │              ├─────────────────┤
               │ position_y      │              │ id (UUID) PK    │
               │ custom_url      │              │ user_id FK      │
               │ created_at      │              │ type            │
               └─────────────────┘              │ title           │
                                                │ message         │
                                                │ reference_id    │
                                                │ reference_type  │
                                                │ is_read         │
                                                │ created_at      │
                                                └─────────────────┘
```

### Role-Based Access Control (RBAC)

| Role | Capabilities |
|------|-------------|
| **Admin** | View all clients, manage all content, approve requests, manage events, access all dashboards |
| **Client** | View own dashboard only, approve/reject content, request events, view own content |

### Row Level Security (RLS)

Data isolation is enforced at the database level:

```sql
-- Helper function to check if user is admin
CREATE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to get user's client_id
CREATE FUNCTION get_my_client_id() RETURNS UUID AS $$
  SELECT client_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Content policies
CREATE POLICY "Admin can view all content" ON content FOR SELECT USING (is_admin());
CREATE POLICY "Clients can view own content" ON content FOR SELECT USING (client_id = get_my_client_id());
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
