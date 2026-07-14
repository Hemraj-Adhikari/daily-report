"use client";

import { useEffect, useMemo, useState } from "react";
import { DailyReport } from "@/lib/types";
import { subscribeToHistory } from "@/lib/reports";
import {
  generateTeamSummaryPdf,
  teamSummaryFileName,
  MemberSummaryRow,
} from "@/lib/generateReportPdf";
import { IconDownload } from "./icons";

export default function ReportsView() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = subscribeToHistory(setReports);
    return () => unsub();
  }, []);

  const totals = useMemo(() => {
    const totalTasks = reports.reduce((sum, r) => sum + r.tasks.length, 0);
    const totalCompleted = reports.reduce(
      (sum, r) => sum + r.tasks.filter((t) => t.status === "completed").length,
      0
    );
    const activeMembers = new Set(reports.map((r) => r.userId)).size;
    return {
      totalTasks,
      totalCompleted,
      totalReports: reports.length,
      activeMembers,
      completionRate: totalTasks
        ? Math.round((totalCompleted / totalTasks) * 100)
        : 0,
    };
  }, [reports]);

  const byMember: MemberSummaryRow[] = useMemo(() => {
    const map = new Map<string, MemberSummaryRow>();
    for (const r of reports) {
      const existing = map.get(r.userId) ?? {
        name: r.userName,
        reports: 0,
        tasks: 0,
        completed: 0,
      };
      existing.reports += 1;
      existing.tasks += r.tasks.length;
      existing.completed += r.tasks.filter(
        (t) => t.status === "completed"
      ).length;
      map.set(r.userId, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.tasks - a.tasks);
  }, [reports]);

  const maxTasks = Math.max(1, ...byMember.map((m) => m.tasks));
  const scheduledCount = totals.totalTasks - totals.totalCompleted;

  async function downloadPdf() {
    setBusy(true);
    try {
      const doc = await generateTeamSummaryPdf(byMember, totals);
      doc.save(teamSummaryFileName());
    } finally {
      setBusy(false);
    }
  }

  function downloadCsv() {
    const header = ["Team member", "Reports", "Tasks", "Completed", "Completion %"];
    const rows = byMember.map((m) => [
      m.name,
      m.reports,
      m.tasks,
      m.completed,
      m.tasks ? Math.round((m.completed / m.tasks) * 100) : 0,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `R2U-Team-Summary_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex justify-end gap-2">
        <button
          onClick={downloadCsv}
          className="rounded-lg border border-[var(--card-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--gold)]"
        >
          Export CSV
        </button>
        <button
          onClick={downloadPdf}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a332e] disabled:opacity-60"
        >
          <IconDownload className="h-4 w-4" />
          {busy ? "Generating…" : "Download PDF Report"}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total tasks" value={totals.totalTasks} />
        <StatCard
          label="Completion rate"
          value={`${totals.completionRate}%`}
          accent="text-[var(--status-completed)]"
        />
        <StatCard label="Reports logged" value={totals.totalReports} />
        <StatCard label="Team members active" value={totals.activeMembers} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">
            Tasks by team member
          </h2>
          {byMember.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No reports yet.</p>
          )}
          <div className="space-y-3">
            {byMember.slice(0, 8).map((m) => (
              <div key={m.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-[var(--ink)]">{m.name}</span>
                  <span className="font-medium text-[var(--muted)]">
                    {m.tasks}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-[var(--ink)]"
                    style={{ width: `${(m.tasks / maxTasks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[var(--ink)]">
            Task status breakdown
          </h2>
          <div className="space-y-4">
            <BreakdownRow
              label="Completed"
              value={totals.totalCompleted}
              total={totals.totalTasks}
              color="var(--status-completed)"
            />
            <BreakdownRow
              label="Scheduled"
              value={scheduledCount}
              total={totals.totalTasks}
              color="var(--status-scheduled)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 shadow-sm">
      <div className={`text-2xl font-semibold ${accent ?? "text-[var(--ink)]"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-[var(--ink)]">{label}</span>
        <span className="font-medium text-[var(--muted)]">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
