// Type declarations for Deno runtime
// This silences IDE errors for Supabase Edge Functions

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    has(key: string): boolean;
    toObject(): { [key: string]: string };
  }
  export const env: Env;
}

// Allow URL imports
declare module "https://*";
declare module "npm:*";
