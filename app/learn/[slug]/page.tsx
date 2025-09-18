import { supabaseServer } from "@/lib/supabaseServer";
import LessonPlayer, { LessonData } from "@/components/lesson-player";

// normalize any weird shapes (stringified JSON or {0:{},1:{}}) into a clean array
function normalizeResources(input: any): { label: string; href: string }[] {
  if (!input) return [];
  try {
    if (typeof input === "string") input = JSON.parse(input);
  } catch {
    return [];
  }
  if (!Array.isArray(input) && typeof input === "object") {
    input = Object.keys(input)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => (input as any)[k]);
  }
  if (!Array.isArray(input)) return [];
  return input
    .filter((r) => r && typeof r === "object")
    .map((r) => ({ label: String(r.label ?? ""), href: String(r.href ?? "") }))
    .filter((r) => r.label.trim() && r.href.trim());
}

type Props = { params: Promise<{ slug: string }> }; // 👈 Next 15: params is a Promise

export default async function LessonPage({ params }: Props) {
  const { slug } = await params; // 👈 await it

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, content, video_url, transcript, resources, duration_seconds"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">Lesson not found</h1>
        <p className="mt-4 text-gray-300">
          Check your URL or create a lesson in Creator Studio.
        </p>
      </div>
    );
  }

  const lesson: LessonData = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    video_url: data.video_url ?? null,
    transcript: (data.transcript ?? null) as string | null,
    resources: normalizeResources(data.resources),
    duration_seconds: (data.duration_seconds ?? null) as number | null,
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        {data.content && (
          <div
            className="prose prose-invert mt-2"
            dangerouslySetInnerHTML={{ __html: data.content as string }}
          />
        )}
      </header>

      <LessonPlayer lesson={lesson} />
    </main>
  );
}
