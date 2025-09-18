// components/lesson-player.tsx
export type LessonResource = { label: string; href: string };
export type LessonData = {
  id: string;
  slug: string;
  title: string;
  video_url: string | null;
  transcript: string | null;
  resources: LessonResource[];
  duration_seconds?: number | null;
};

export default function LessonPlayer({ lesson }: { lesson: LessonData }) {
  const resources = Array.isArray(lesson.resources) ? lesson.resources : [];

  return (
    <section className="grid gap-6 md:grid-cols-[1fr_340px]">
      {/* Left: video */}
      <div className="rounded-2xl border border-white/10 p-0">
        {lesson.video_url ? (
          <video
            className="h-full w-full rounded-2xl"
            src={lesson.video_url}
            controls
            preload="metadata"
          />
        ) : (
          <div className="p-6 text-sm text-gray-400">No video provided.</div>
        )}
      </div>

      {/* Right: transcript + resources */}
      <div className="space-y-6">
        {lesson.transcript && (
          <section className="rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300">
              Transcript
            </h3>
            {/* IMPORTANT: no clamp/overflow; show all lines */}
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-200">
              {lesson.transcript}
            </p>
          </section>
        )}

        {resources.length > 0 && (
          <section className="rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300">
              Resources
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              {resources.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
