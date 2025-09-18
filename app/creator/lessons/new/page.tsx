'use client';

import { useState } from 'react';

export default function NewLessonPage() {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setStatus('Saving...');
    const res = await fetch('/api/creator/lessons', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ slug, title, content })
    });
    const data = await res.json();
    if (!res.ok) setStatus(data.error || 'Failed to save');
    else setStatus('Saved! Visit /learn/' + slug);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold">Create lesson</h1>
      <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3" placeholder="slug (e.g., consent-101)" value={slug} onChange={e=>setSlug(e.target.value)} />
      <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3" placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full rounded-xl border border-gray-700 bg-transparent p-3 h-64" placeholder="HTML content" value={content} onChange={e=>setContent(e.target.value)} />
      <button onClick={save} className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Save</button>
      {status && <p className="text-sm text-gray-300">{status}</p>}
    </main>
  );
}
