"use client";

import { useEffect, useState } from "react";
import { DailyReport, TeamMember } from "@/lib/types";
import {
  getOrCreateTodayReport,
  subscribeToReport,
  addTask,
  toggleTaskStatus,
  removeTask,
} from "@/lib/reports";
import MemberPicker from "./MemberPicker";
import TaskForm from "./TaskForm";
import TaskRow from "./TaskRow";
import GenerateReportButton from "./GenerateReportButton";

const STORAGE_KEY = "r2u-daily-board-member";

export default function DailyBoard() {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [ready, setReady] = useState(false);

  // restore selected member from this device
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMember(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    setReady(true);
  }, []);

  function selectMember(m: TeamMember) {
    setMember(m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  }

  // load / subscribe to today's report once a member is chosen
  useEffect(() => {
    if (!member) return;
    let unsub: (() => void) | undefined;

    (async () => {
      const initial = await getOrCreateTodayReport(member.id, member.name);
      setReport(initial);
      unsub = subscribeToReport(initial.id, (r) => setReport(r));
    })();

    return () => unsub?.();
  }, [member]);

  if (!ready) return null;

  if (!member) {
    return (
      <div className="mx-auto max-w-3xl">
        <MemberPicker value={member} onChange={selectMember} />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center text-sm text-[var(--muted)]">
        Loading board…
      </div>
    );
  }

  async function handleAdd(text: string) {
    await addTask(report!.id, report!.tasks, text);
  }
  async function handleToggle(taskId: string) {
    await toggleTaskStatus(report!.id, report!.tasks, taskId);
  }
  async function handleRemove(taskId: string) {
    await removeTask(report!.id, report!.tasks, taskId);
  }

  const editable = report.status === "open";
  const completed = report.tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-[var(--muted)]">
          Logged in as{" "}
          <span className="font-semibold text-[var(--ink)]">{member.name}</span>
        </div>
        <div className="text-sm text-[var(--muted)]">
          {completed}/{report.tasks.length} tasks done
        </div>
      </div>

      {!editable && (
        <div className="mb-5 rounded-xl border border-[var(--gold)] bg-[var(--gold-soft)] px-4 py-3 text-sm text-[#8a6a0e]">
          Today&apos;s report has been finalized and generated. You can still
          re-download the PDF below.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-3.5">
          <span className="text-sm font-semibold text-[var(--ink)]">
            Today&apos;s Tasks
          </span>
        </div>

        {report.tasks.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[var(--muted)]">
            No tasks logged yet.
          </div>
        )}

        {report.tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            editable={editable}
            onToggleStatus={(task) => handleToggle(task.id)}
            onRemove={(task) => handleRemove(task.id)}
          />
        ))}

        {editable && <TaskForm onAdd={handleAdd} />}
      </div>

      <div className="mt-6">
        <GenerateReportButton report={report} />
        <p className="mt-2 text-center text-xs text-[var(--muted)]">
          Click this at the end of the day. It downloads a PDF and locks
          today&apos;s board — the report also appears in History.
        </p>
      </div>
    </div>
  );
}
