import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureProfile } from "@/lib/ensureProfile";

export default async function Dashboard() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await ensureProfile();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold">
        Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}
      </h1>
      <p className="text-gray-300">
        Role: <span className="font-mono">{profile?.role ?? "learner"}</span>
      </p>

      {(profile?.role === "creator" || profile?.role === "admin") && (
        <div className="mt-6 space-x-3">
          <Link
            href="/creator/lessons/new"
            className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400"
          >
            Create new lesson
          </Link>
          <Link
            href="/learn/consent-101"
            className="rounded-xl border border-gray-600 px-4 py-2 hover:bg-gray-800"
          >
            View sample
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            To edit an existing lesson, open{" "}
            <code>/creator/lessons/edit?id=&lt;id&gt;</code>.
          </p>
        </div>
      )}
    </main>
  );
}
