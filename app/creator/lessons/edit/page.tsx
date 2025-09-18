"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Lesson = { id: string; slug: string; title: string; content: string };

export default function EditLessonPage() {
  const router = useRouter();
  const search = useSearchParams();
  const id = search.get("id") || "";
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setStatus("Missing ?id=…"); return; }
    (async () => {
      setStatus("Loading...");
      const res = await fetch(`/api/creator/lessons?id=${id}`);
      const data = await res.json();
      if (!res.ok) return setStatus(data?.error || "Failed to load");
      setLesson(data.lesson);
      setTitle(data.lesson.title);
      setContent(data.lesson.content);
      setStatus(null);
    })();
  }, [id]);

  async function save() {
    if (!lesson) return;
    setStatus("Saving...");
    const res = await fetch("/api/creator/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lesson.id, title, content }),
    });
    const data = await res.json();
    if (!res.ok) return setStatus(data?.error || "Failed to save");
    setStatus("Saved!");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold">Edit lesson</h1>
      {!lesson && <p className="text-sm text-gray-300">{status ?? "Loading..."}</p>}
      {lesson && (
        <>
          <p className="text-gray-400 text-sm">
            Slug: <span className="font-mono">{lesson.slug}</span>
          </p>
          <input
            className="w-full rounded-xl border border-gray-700 bg-transparent p-3"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-xl border border-gray-700 bg-transparent p-3 h-64"
            placeholder="HTML content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400"
            >
              Save
            </button>
            <button
              onClick={() => router.push(`/learn/${lesson.slug}`)}
              className="rounded-xl border border-gray-600 px-4 py-2 hover:bg-gray-800"
            >
              View lesson
            </button>
          </div>
          {status && <p className="text-sm text-gray-300">{status}</p>}
        </>
      )}
    </main>
  );
}
