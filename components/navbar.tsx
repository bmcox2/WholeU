// components/navbar.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { unstable_noStore as noStore } from "next/cache";

export default async function Navbar() {
  noStore(); // ensure fresh render on each request

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // Read role for creator/admin shortcuts
  let role: "learner" | "creator" | "admin" | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = (data?.role as any) ?? null;
  }
  const isCreator = role === "creator" || role === "admin";

  return (
    <header className="border-b border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="WholeU" className="h-7 w-7" />
          <span className="text-sm font-semibold tracking-tight">WholeU</span>
        </Link>

        {/* Primary links (desktop) */}
        <div className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
          <Link href="/learn/consent-101" className="hover:text-white">
            Lessons
          </Link>
          <Link href="/questions" className="hover:text-white">
            Questions
          </Link>
          {user && isCreator && (
            <>
              <Link href="/creator/lessons" className="hover:text-white" title="View and edit your lessons">
                My lessons
              </Link>
              <Link href="/creator/lessons/new" className="hover:text-white" title="Create a new lesson">
                New lesson
              </Link>
            </>
          )}
        </div>

        {/* Auth / actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
              >
                Account
              </Link>
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg白/20 hover:bg-white/20"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile links row */}
      <div className="mx-auto block max-w-6xl px-4 pb-3 text-sm text-gray-300 md:hidden">
        <div className="flex flex-wrap gap-6">
          <Link href="/learn/consent-101" className="hover:text-white">
            Lessons
          </Link>
          <Link href="/questions" className="hover:text-white">
            Questions
          </Link>
          {user && isCreator && (
            <>
              <Link href="/creator/lessons" className="hover:text-white">
                My lessons
              </Link>
              <Link href="/creator/lessons/new" className="hover:text-white">
                New lesson
              </Link>
            </>
          )}
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <Link href="/account" className="hover:text-white">
                Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
