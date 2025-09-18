import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAction } from "@/lib/supabaseServerAction";

const createSchema = z.object({
  slug: z.string().min(3).max(120),
  title: z.string().min(3).max(200),
  content: z.string().min(1),
  video_url: z.string().url().optional().nullable(),
  transcript: z.string().optional().nullable(),
  resources: z.array(z.object({ label: z.string(), href: z.string().url() })).optional().nullable(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200).optional(),
  content: z.string().optional(),
  video_url: z.string().url().optional().nullable(),
  transcript: z.string().optional().nullable(),
  resources: z.array(z.object({ label: z.string(), href: z.string().url() })).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const supabase = await supabaseServerAction(); 
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["creator","admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.parse(await req.json());
  const { error } = await supabase.from("lessons").insert({
    slug: parsed.slug,
    title: parsed.title,
    content: parsed.content,
    created_by: user.id,
    video_url: parsed.video_url ?? null,
    transcript: parsed.transcript ?? null,
    resources: parsed.resources ?? [],
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, slug: parsed.slug });
}

export async function GET(req: NextRequest) {
  const supabase = await supabaseServerAction(); 
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, slug, title, content, created_by, video_url, transcript, resources")
    .eq("id", id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";
  if (!isAdmin && lesson.created_by !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ lesson });
}

export async function PUT(req: NextRequest) {
  const supabase = await supabaseServerAction(); 
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = updateSchema.parse(await req.json());

  const { data: current, error: fetchErr } = await supabase
    .from("lessons")
    .select("id, created_by")
    .eq("id", parsed.id)
    .single();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";
  if (!isAdmin && current.created_by !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, any> = {};
  if (parsed.title !== undefined) updates.title = parsed.title;
  if (parsed.content !== undefined) updates.content = parsed.content;
  if (parsed.video_url !== undefined) updates.video_url = parsed.video_url;
  if (parsed.transcript !== undefined) updates.transcript = parsed.transcript;
  if (parsed.resources !== undefined) updates.resources = parsed.resources;

  const { error } = await supabase.from("lessons").update(updates).eq("id", parsed.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, id: parsed.id });
}
