import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabaseServer";

// Schemas
const createSchema = z.object({
  slug: z.string().min(3).max(120),
  title: z.string().min(3).max(200),
  content: z.string().min(1),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["creator", "admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.parse(body);

    const { error } = await supabase.from("lessons").insert({
      slug: parsed.slug,
      title: parsed.title,
      content: parsed.content,
      created_by: user.id,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true, slug: parsed.slug });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// GET /api/creator/lessons?id=<uuid>
export async function GET(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = new URL(req.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("id, slug, title, content, created_by")
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    const isAdmin = profile?.role === "admin";
    if (!isAdmin && lesson.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ lesson });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT /api/creator/lessons  { id, title?, content? }
export async function PUT(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = updateSchema.parse(await req.json());

    const { data: current, error: fetchErr } = await supabase
      .from("lessons")
      .select("id, created_by")
      .eq("id", parsed.id)
      .single();
    if (fetchErr) throw fetchErr;
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    const isAdmin = profile?.role === "admin";
    if (!isAdmin && current.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates: Record<string, any> = {};
    if (parsed.title) updates.title = parsed.title;
    if (parsed.content) updates.content = parsed.content;

    const { error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", parsed.id);
    if (error) throw error;

    return NextResponse.json({ ok: true, id: parsed.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
