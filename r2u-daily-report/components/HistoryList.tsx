"use client";

import { useEffect, useMemo, useState } from "react";
import { DailyReport } from "@/lib/types";
import { subscribeToHistory } from "@/lib/reports";
import { generateReportPdf, reportFileName } from "@/lib/generateReportPdf";
import { TEAM_MEMBERS } from "@/lib/team";
import { IconDownload } from "./icons";

export default function HistoryList() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [personFilter, setPersonFilter] = useState<string>("all");

  useEffect(() => {
    const unsub = subscribeToHistory(setReports);
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (personFilter === "all") return reports;
    return reports.filter((r) => r.userId === personFilter);
  }, [reports, personFilter]);

  const totals = useMemo(() => {
    const totalTasks = filtered.reduce((sum, r) => sum + r.tasks.length, 0);
    const totalCompleted = filtered.reduce(
      (sum, r) => sum + r.tasks.filter((t) => t.status === "completed").length,
      0
    );
    return { totalTasks, totalCompleted, totalReports: filtered.length };
  }, [filtered]);

  async function download(report: DailyReport) {
    const doc = await generateReportPdf(report);
    doc.save(reportFileName(report));
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 grid-cols-3 gap-3">
          <Stat label="Reports" value={totals.totalReports} />
          <Stat label="Tasks logged" value={totals.totalTasks} />
          <Stat label="Completed" value={totals.totalCompleted} />
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <select
          value={personFilter}
          onChange={(e) => setPersonFilter(e.target.value)}
          className="rounded-lg border border-[var(--card-border)] bg-white px-3.5 py-2 text-sm text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none"
        >
          <option value="all">All team members</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
        <div className="grid grid-cols-[110px_1fr_90px_100px_44px] gap-2 border-b border-[var(--card-border)] bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          <span>Date</span>
          <span>Team member</span>
          <span>Tasks</span>
          <span>Status</span>
          <span></span>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-[var(--muted)]">
            No reports yet.
          </div>
        )}

        {filtered.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[110px_1fr_90px_100px_44px] items-center gap-2 border-b border-[var(--card-border)] px-5 py-3.5 text-sm last:border-b-0 hover:bg-gray-50"
          >
            <span className="text-xs text-[var(--muted)]">{r.date}</span>
            <span className="font-medium text-[var(--ink)]">{r.userName}</span>
            <span className="text-[var(--muted)]">
              {r.tasks.filter((t) => t.status === "completed").length}/
              {r.tasks.length}
            </span>
            <span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  r.status === "finalized"
                    ? "bg-[var(--status-completed-bg)] text-[var(--status-completed)]"
                    : "bg-[var(--status-scheduled-bg)] text-[var(--status-scheduled)]"
                }`}
              >
                {r.status === "finalized" ? "Finalized" : "Open"}
              </span>
            </span>
            <button
              onClick={() => download(r)}
              disabled={r.tasks.length === 0}
              aria-label="Download PDF"
              className="justify-self-end text-[var(--muted)] transition-colors hover:text-[var(--gold)] disabled:opacity-30"
            >
              <IconDownload className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-4 shadow-sm">
      <div className="text-2xl font-semibold text-[var(--ink)]">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </div>
    </div>
  );
}
