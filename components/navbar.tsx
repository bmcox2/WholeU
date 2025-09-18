import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Navbar() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <Link className="flex items-center gap-2" href="/">
        <img src="/logo.svg" alt="WholeU" className="h-8 w-8" />
        <span className="font-semibold tracking-tight">WholeU</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/learn/consent-101" className="hover:underline">Sample lesson</Link>
        <Link href="/questions" className="hover:underline">Ask a question</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <form action="/logout" method="post">
              <button className="rounded border border-gray-600 px-3 py-1 hover:bg-gray-800" type="submit">Log out</button>
            </form>
          </>
        ) : (
          <Link href="/login" className="rounded border border-gray-600 px-3 py-1 hover:bg-gray-800">Log in</Link>
        )}
      </div>
    </nav>
  );
}
