"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResourcesEditor, { Resource } from "@/components/creator/ResourcesEditor";
import UploadButton from "@/components/creator/UploadButton";

export default function EditLessonPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const id = sp.get("id") || "";
  const [status, setStatus] = useState<string | null>(null);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    (async () => {
      if (!id) { setStatus("Missing ?id=…"); return; }
      setStatus("Loading…");
      const res = await fetch(`/api/creator/lessons?id=${id}`);
      const data = await res.json();
      if (!res.ok) return setStatus(data?.error || "Failed to load");
      const l = data.lesson;
      setSlug(l.slug); setTitle(l.title); setContent(l.content || "");
      setVideoUrl(l.video_url || ""); setTranscript(l.transcript || "");
      setResources(l.resources || []);
      setStatus(null);
    })();
  }, [id]);

  async function save() {
    setStatus("Saving…");
    const res = await fetch("/api/creator/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id, title, content,
        video_url: videoUrl || null,
        transcript: transcript || null,
        resources,
      }),
    });
    const data = await res.json();
    setStatus(res.ok ? "Saved!" : data?.error || "Failed to save");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-5">
      <h1 className="text-3xl font-bold">Edit lesson</h1>
      {!id && <p className="text-sm text-gray-300">{status ?? "Missing id"}</p>}

      <p className="text-gray-400 text-sm">Slug: <span className="font-mono">{slug}</span></p>

      <label htmlFor="title" className="block text-sm text-gray-300">Title</label>
      <input
        id="title"
        className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
        placeholder="Consent 101"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="intro" className="block text-sm text-gray-300">Intro (HTML allowed)</label>
      <textarea
        id="intro"
        className="w-full rounded-xl border border-gray-700 bg-transparent p-3 h-28"
        placeholder="<p>Welcome…</p>"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <label htmlFor="videoUrl" className="block text-sm text-gray-300">Video URL</label>
        <UploadButton onUploaded={setVideoUrl} label="Replace video" />
      </div>
      <input
        id="videoUrl"
        className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
        placeholder="https://…/video.mp4"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <label htmlFor="transcript" className="block text-sm text-gray-300">Transcript</label>
      <textarea
        id="transcript"
        className="w-full rounded-xl border border-gray-700 bg-transparent p-3 h-28"
        placeholder="Paste plain-text transcript…"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />

      <div>
        <label className="block text-sm text-gray-300 mb-1">Resources</label>
        <ResourcesEditor value={resources} onChange={setResources} />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">Save</button>
        <button onClick={()=>router.push(`/learn/${slug}`)} className="rounded-xl border border-gray-600 px-4 py-2 hover:bg-gray-800">View</button>
      </div>
      {status && <p className="text-sm text-gray-300">{status}</p>}
    </main>
  );
}
