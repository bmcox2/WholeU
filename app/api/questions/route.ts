// app/api/questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabaseServer";

const schema = z.object({
  body: z.string().min(10).max(2000),
  cohort_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = schema.parse(json);

    const supabase = await supabaseServer(); // <-- await the async helper

    const { error } = await supabase.from("questions").insert({
      body: parsed.body,
      cohort_id: parsed.cohort_id ?? null,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Invalid request" },
      { status: 400 }
    );
  }
}
