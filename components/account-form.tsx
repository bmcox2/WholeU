"use client";
import { useState } from "react";

export default function AccountForm({
  initialEmail, initialRole, initialDisplayName,
}: { initialEmail: string; initialRole: string; initialDisplayName: string }) {
  const [displayName, setDisplayName] = useState(initialDisplayName || "");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: displayName }),
    });
    const data = await res.json();
    setSaving(false);
    setMsg(res.ok ? "Saved!" : data?.error || "Failed to save");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 p-4">
        <p className="text-sm text-gray-400">Signed in as</p>
        <p className="mt-1 font-medium">{initialEmail}</p>
        <p className="mt-2 text-sm">Role: <span className="font-mono">{initialRole || "learner"}</span></p>
      </div>

      <form onSubmit={save} className="space-y-3 rounded-2xl border border-white/10 p-4">
        <label className="block text-sm text-gray-300 mb-1">Display name</label>
        <input
          className="w-full rounded-xl border border-gray-700 bg-transparent p-3 outline-none"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
        />
        <button
          disabled={saving || !displayName.trim()}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>

      <form action="/logout" method="post">
        <button
          type="submit"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
