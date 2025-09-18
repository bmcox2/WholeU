'use client';
import { useState } from "react";

export default function QuestionsPage() {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  async function submit() {
    setStatus("Submitting...");
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("Thanks! Your question was submitted.");
      setBody("");
    } else {
      setStatus(data?.error ?? "Something went wrong.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Ask anonymously</h1>
      <p className="mt-3 text-gray-300">Your question will be sent to the expert inbox.</p>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type your question..."
        className="mt-6 w-full rounded-xl border border-gray-700 bg-transparent p-4 outline-none focus:ring-2 focus:ring-indigo-500"
        rows={6}
      />
      <button
        onClick={submit}
        className="mt-4 rounded-xl bg-indigo-500 px-5 py-3 font-medium hover:bg-indigo-400 disabled:opacity-50"
        disabled={!body.trim()}
      >
        Submit
      </button>
      {status && <p className="mt-3 text-sm text-gray-300">{status}</p>}
    </main>
  );
}
