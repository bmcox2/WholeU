import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold">Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}</h1>
      <p className="text-gray-300">Role: <span className="font-mono">{profile?.role ?? "learner"}</span></p>

      {(profile?.role === "creator" || profile?.role === "admin") && (
        <div className="mt-6">
          <Link href="/creator/lessons/new" className="rounded-xl bg-indigo-500 px-4 py-2 hover:bg-indigo-400">
            Create new lesson
          </Link>
        </div>
      )}
    </main>
  );
}
