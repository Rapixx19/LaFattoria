import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr';
import { createServerClient as createServerClientSSR } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Create a Supabase client for browser/client components
 */
export function createBrowserClient() {
  return createBrowserClientSSR<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Create a Supabase client for server components/actions
 * Pass cookies from next/headers
 */
export function createServerClient(
  cookieStore: {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options: CookieOptions) => void;
    delete: (name: string, options: CookieOptions) => void;
  }
) {
  return createServerClientSSR<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Server component, ignore
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name, options);
          } catch {
            // Server component, ignore
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase admin client with service role
 * Only use on server-side for admin operations
 */
export function createServiceClient() {
  return createServerClientSSR<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
    }
  );
}
