"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function UploadButton({
  onUploaded,
  folder = "videos",
  label = "Upload video",
}: { onUploaded: (publicUrl: string) => void; folder?: string; label?: string; }) {
  const [busy, setBusy] = useState(false);

  async function pick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusy(true);
      try {
        const supabase = supabaseBrowser();
        const filename = `${Date.now()}-${file.name}`;
        const path = `${folder}/${filename}`;
        const { error } = await supabase.storage.from("lesson-media").upload(path, file, { upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("lesson-media").getPublicUrl(path);
        onUploaded(data.publicUrl);
      } catch (e: any) {
        alert(e.message || "Upload failed");
      } finally {
        setBusy(false);
      }
    };
    input.click();
  }

  return (
    <button type="button" onClick={pick} disabled={busy}
      className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50">
      {busy ? "Uploading…" : label}
    </button>
  );
}
