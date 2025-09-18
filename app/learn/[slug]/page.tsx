import { supabaseServer } from "@/lib/supabaseServer";

type Props = { params: { slug: string } };

export default async function LessonPage({ params }: Props) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("lessons")
    .select("title, content")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">Sample: Consent 101</h1>
        <p className="mt-4 text-gray-300">
          Your Supabase isn't set up yet. Run the SQL in <code>supabase_schema.sql</code> and insert a sample lesson.
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <article className="prose prose-invert mt-6" dangerouslySetInnerHTML={{ __html: data.content }} />
    </main>
  );
}
