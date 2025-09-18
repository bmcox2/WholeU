import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { z } from "zod";

const schema = z.object({
  slug: z.string().min(1),
  seconds_watched: z.number().int().nonnegative().optional(),
  complete: z.boolean().optional(),
});

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  // Find lesson by slug
  const { data: lesson, error: lerr } = await supabase
    .from("lessons")
    .select("id")
    .eq("slug", parsed.data.slug)
    .single();
  if (lerr || !lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  // Upsert progress: increase seconds_watched if provided; set completed_at if complete
  const fields: any = { user_id: user.id, lesson_id: lesson.id };
  if (typeof parsed.data.seconds_watched === "number") {
    // Fetch current to keep max watched time
    const { data: current } = await supabase
      .from("progress")
      .select("seconds_watched")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .maybeSingle();

    fields.seconds_watched = Math.max(parsed.data.seconds_watched, current?.seconds_watched ?? 0);
  }
  if (parsed.data.complete) {
    fields.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("progress")
    .upsert(fields, { onConflict: "user_id,lesson_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
