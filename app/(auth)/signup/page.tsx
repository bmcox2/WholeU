'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password !== confirm) return setMsg('Passwords do not match');

    const { error } = await supabaseBrowser().auth.signUp({ email, password });

    if (error) {
      // Supabase commonly returns “User already registered”
      if (error.message?.toLowerCase().includes('already')) {
        setMsg('You already have an account — try logging in.');
        // Optionally jump straight to login and prefill email:
        // router.replace(`/login?email=${encodeURIComponent(email)}`);
      } else {
        setMsg(error.message);
      }
      return;
    }

    // If email confirmation is OFF, you’re logged in immediately
    await fetch("/api/auth/ensure-profile", { method: "POST" });
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-4xl font-bold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="email" placeholder="you@example.com"
               value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="password" placeholder="Password"
               value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="password" placeholder="Confirm password"
               value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
        <button className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Sign up</button>
      </form>
      <p className="mt-3 text-sm">
        Already have an account? <a className="underline" href="/login">Log in</a>
      </p>
      {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
    </main>
  );
}
