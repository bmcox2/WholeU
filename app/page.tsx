import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-16">
        <div className="text-sm uppercase tracking-widest text-gray-300">Beta</div>
        <h1 className="mt-2 text-5xl font-extrabold leading-tight">
          Learn skills for better <span className="text-indigo-400">communication</span>,
          <br /> consent, and relationships.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-gray-300">
          Evidence-based, shame-free micro-lessons with live Q&A. Anonymous questions welcomed.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/learn/consent-101" className="rounded-xl bg-indigo-500 px-5 py-3 font-medium hover:bg-indigo-400">
            Start the sample lesson
          </Link>
          <Link href="/questions" className="rounded-xl border border-gray-600 px-5 py-3 font-medium hover:bg-gray-800">
            Ask a question
          </Link>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {title: "Expert-led", body: "Vetted educators and coaches with clear credentials."},
          {title: "Anonymous Q&A", body: "Ask privately; get public or private answers."},
          {title: "Practice-first", body: "Role-plays, scripts, and weekly micro-missions."},
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-gray-700/60 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-gray-300">{c.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
