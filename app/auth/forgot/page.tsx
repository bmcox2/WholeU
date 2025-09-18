'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset`
    });
    setMsg(error ? error.message : 'Check your email for a reset link.');
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Reset password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="email" placeholder="you@example.com"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <button className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Send reset link</button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-300">{msg}</p>}
    </main>
  );
}
