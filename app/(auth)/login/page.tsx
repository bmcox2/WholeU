'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' }
    });
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-2 text-gray-300">We’ll email you a magic link to sign in.</p>
      <form onSubmit={sendMagicLink} className="mt-6 space-y-4">
        <input
          type="email"
          className="w-full rounded-xl border border-gray-700 bg-transparent p-3 outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Send link</button>
      </form>
      {sent && <p className="mt-3 text-sm text-green-400">Check your email for the sign-in link.</p>}
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
    </main>
  );
}
