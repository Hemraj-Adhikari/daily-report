"use client";

import { useMemo, useState } from "react";
import { TEAM_MEMBERS } from "@/lib/team";
import { TeamMember } from "@/lib/types";

export default function MemberPicker({
  value,
  onChange,
}: {
  value: TeamMember | null;
  onChange: (member: TeamMember) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TEAM_MEMBERS;
    return TEAM_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm">
      <div className="mb-1 text-center text-base font-semibold text-[var(--ink)]">
        Who is logging in?
      </div>
      <div className="mb-5 text-center text-sm text-[var(--muted)]">
        Select your name to open today&apos;s board
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name..."
        className="mb-4 w-full rounded-lg border border-[var(--card-border)] bg-gray-50 px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
      />

      <div className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m)}
            className={`flex flex-col items-start rounded-lg border px-4 py-2.5 text-left transition-colors ${
              value?.id === m.id
                ? "border-[var(--gold)] bg-[var(--gold-soft)]"
                : "border-[var(--card-border)] bg-white hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]/40"
            }`}
          >
            <span className="text-sm font-medium text-[var(--ink)]">
              {m.name}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {m.role}
            </span>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full px-4 py-6 text-center text-sm text-[var(--muted)]">
            No one matches &quot;{query}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
