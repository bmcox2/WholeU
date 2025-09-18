"use client";
import { useState } from "react";

export type Resource = { label: string; href: string };
export default function ResourcesEditor({
  value, onChange,
}: { value: Resource[]; onChange: (v: Resource[]) => void }) {
  const [items, setItems] = useState<Resource[]>(value || []);
  function commit(next: Resource[]) { setItems(next); onChange(next); }
  return (
    <div className="space-y-2">
      {items.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-700 bg-transparent p-3"
            placeholder="Label (e.g., Worksheet PDF)"
            value={r.label}
            onChange={e => {
              const next = [...items]; next[i] = { ...next[i], label: e.target.value }; commit(next);
            }}
          />
          <input
            className="flex-[2] rounded-xl border border-gray-700 bg-transparent p-3"
            placeholder="https://link"
            value={r.href}
            onChange={e => {
              const next = [...items]; next[i] = { ...next[i], href: e.target.value }; commit(next);
            }}
          />
          <button
            type="button"
            onClick={() => commit(items.filter((_, idx) => idx !== i))}
            className="rounded-xl border border-gray-700 px-3 hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => commit([...(items || []), { label: "", href: "" }])}
        className="rounded-xl bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
      >
        + Add resource
      </button>
    </div>
  );
}
