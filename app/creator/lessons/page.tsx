import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function MyLessons() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isCreator = me?.role === "creator" || me?.role === "admin";
  if (!isCreator) redirect("/dashboard");

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, slug, title, created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My lessons</h1>
        <Link href="/creator/lessons/new" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400">
          New lesson
        </Link>
      </div>

      {error && <p className="text-sm text-red-400">{error.message}</p>}

      {(!lessons || lessons.length === 0) ? (
        <div className="rounded-2xl border border-white/10 p-6 text-sm text-gray-300">
          You haven’t created any lessons yet. Click <strong>New lesson</strong> to get started.
        </div>
      ) : (
        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10">
          {lessons.map(l => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{l.title}</p>
                <p className="text-xs text-gray-400">/{l.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/learn/${l.slug}`} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">View</Link>
                <Link href={`/creator/lessons/edit?id=${l.id}`} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
