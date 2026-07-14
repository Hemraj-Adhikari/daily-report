"use client";

import { useState } from "react";

export default function TaskForm({
  onAdd,
}: {
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2 px-5 py-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 rounded-lg border border-[var(--card-border)] bg-gray-50 px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-[#1a1300] transition-colors hover:bg-[var(--gold-bright)]"
      >
        Add
      </button>
    </form>
  );
}
