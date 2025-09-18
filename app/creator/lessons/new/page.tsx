'use client';
import { useEffect, useMemo, useState } from 'react';
import ResourcesEditor, { Resource } from '@/components/creator/ResourcesEditor';
import UploadButton from '@/components/creator/UploadButton';

function slugify(t: string) {
  return t.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

export default function NewLessonPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  // Auto-slug from title (user can still edit slug field)
  const auto = useMemo(() => slugify(title), [title]);
  useEffect(() => { if (!slug) setSlug(auto); }, [auto, slug]);

  async function save() {
    setStatus('Saving…');
    const res = await fetch('/api/creator/lessons', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        slug, title,
        content,
        video_url: videoUrl || null,
        transcript: transcript || null,
        resources,
      })
    });
    const data = await res.json();
    setStatus(res.ok ? `Saved! Visit /learn/${slug}` : data.error || 'Failed to save');
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-5">
      <h1 className="text-3xl font-bold">Create lesson</h1>

      <label className="block text-sm text-gray-300">Title</label>
      <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
             value={title} onChange={e=>setTitle(e.target.value)} placeholder="Consent 101" />

      <label className="block text-sm text-gray-300">Slug</label>
      <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3 font-mono"
             value={slug} onChange={e=>setSlug(slugify(e.target.value))} placeholder={auto || 'consent-101'} />

      <label className="block text-sm text-gray-300">Intro (HTML allowed)</label>
      <textarea className="w-full rounded-xl border border-gray-700 bg-transparent p-3 h-28"
                value={content} onChange={e=>setContent(e.target.value)} placeholder="<p>Welcome…</p>" />

      <div className="flex items-center gap-3">
        <label className="block text-sm text-gray-300">Video URL</label>
        <UploadButton onUploaded={setVideoUrl} />
      </div>
      <input className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
             value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://…/video.mp4" />

      <label className="block text-sm text-gray-300">Transcript</label>
      <textarea className="w-full rounded-xl border border-gray-700 bg-transparent p-3 h-28"
                value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="Plain text…" />

      <div>
        <label className="block text-sm text-gray-300 mb-1">Resources</label>
        <ResourcesEditor value={resources} onChange={setResources} />
      </div>

      <button onClick={save} className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Save</button>
      {status && <p className="text-sm text-gray-300">{status}</p>}
    </main>
  );
}
