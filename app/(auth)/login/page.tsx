'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get('next') || '/dashboard';

  useEffect(() => {
    const preset = sp.get('email');
    if (preset) setEmail(preset);
  }, [sp]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) {
      // Friendlier messages
      if (error.message.toLowerCase().includes('invalid login')) {
        setMsg('Wrong email or password.');
      } else {
        setMsg(error.message);
      }
      return;
    }
    // after successful signInWithPassword:
    await fetch("/api/auth/ensure-profile", { method: "POST" });
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-4xl font-bold">Log in</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="email" placeholder="you@example.com"
               value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="password" placeholder="Password"
               value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Log in</button>
      </form>
      <div className="mt-3 text-sm">
        <a className="underline" href="/signup">Create an account</a>
        <span className="mx-2">·</span>
        <a className="underline" href="/auth/forgot">Forgot password?</a>
      </div>
      {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
    </main>
  );
}
