'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password !== confirm) return setMsg('Passwords do not match');
    const { error } = await supabaseBrowser().auth.updateUser({ password });
    if (error) return setMsg(error.message);
    router.replace('/dashboard');
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Choose a new password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="password" placeholder="New password"
               value={password} onChange={e=>setPassword(e.target.value)} required />
        <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
               type="password" placeholder="Confirm password"
               value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        <button className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Update password</button>
      </form>
      {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
    </main>
  );
}
