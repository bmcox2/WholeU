// lib/ensureProfile.ts
import { supabaseServer } from "@/lib/supabaseServer";

export async function ensureProfile() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Try to insert; if it exists, do nothing.
  await supabase
    .from("profiles")
    .upsert(
      { id: user.id, display_name: user.email ?? "" },
      { onConflict: "id", ignoreDuplicates: true }
    );
}
