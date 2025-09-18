// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies(); // ← await in Next 15

  // READ-ONLY in Server Components: set/remove are no-ops (avoid Next error)
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // no-op in Server Components
        },
        remove(_name: string, _options: CookieOptions) {
          // no-op in Server Components
        },
      },
    }
  );
}
export default supabaseServer;
