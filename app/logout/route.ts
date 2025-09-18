// app/logout/route.ts
import { NextResponse } from "next/server";
import { supabaseServerAction } from "@/lib/supabaseServerAction";

export async function POST() {
  const supabase = await supabaseServerAction();
  await supabase.auth.signOut();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.redirect(new URL("/", origin));
}
