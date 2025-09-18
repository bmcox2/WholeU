import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabaseServer';

const schema = z.object({
  slug: z.string().min(3).max(120),
  title: z.string().min(3).max(200),
  content: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['creator','admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = schema.parse(body);

    const { error } = await supabase.from('lessons').insert({
      slug: parsed.slug,
      title: parsed.title,
      content: parsed.content,
      created_by: user.id
    });

    if (error) throw error;
    return NextResponse.json({ ok: true, slug: parsed.slug });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
