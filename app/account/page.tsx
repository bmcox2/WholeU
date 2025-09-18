import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import AccountForm from "@/components/account-form";

export default async function AccountPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ensure profile row exists (if trigger missed)
  await supabase.from("profiles").upsert(
    { id: user.id, display_name: user.email ?? "" },
    { onConflict: "id", ignoreDuplicates: true }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Your account</h1>
      <AccountForm
        initialEmail={user.email || ""}
        initialRole={profile?.role || "learner"}
        initialDisplayName={profile?.display_name || ""}
      />
    </main>
  );
}
