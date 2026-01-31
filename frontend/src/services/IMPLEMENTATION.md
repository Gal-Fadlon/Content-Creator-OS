# Services Implementation

## Structure

```
services/
├── services.ts              # Central factory for all services
├── queryKeys.ts             # React Query key factory
├── api/
│   ├── client.ts            # Axios instance
│   └── types.ts             # DTOs and API types
├── supabase/
│   ├── supabaseClient.ts    # Supabase client instance
│   └── supabaseTypes.ts     # Database type definitions
├── storage/
│   └── uploadService.ts     # R2 media upload via signed URLs
├── auth/
├── clients/
├── content/
├── events/
├── notifications/
└── comments/
    └── commentsService.ts   # Content comments CRUD
```

## Supabase Integration

All services use the Supabase client for database operations. Auth is handled via Supabase Auth in `AuthProvider`.

## Storage

`uploadService.ts` handles media uploads to Cloudflare R2 via presigned URLs from a Supabase Edge Function.
