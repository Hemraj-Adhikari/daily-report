"use client";

import { useState } from "react";
import { LeaveStatus, LeaveType } from "@/lib/types";
import { LEAVE_BALANCES, MOCK_LEAVE_APPLICATIONS } from "@/lib/mockLeave";
import SummaryCard from "./SummaryCard";
import { IconEye } from "./icons";

const TYPE_DOT: Record<LeaveType, string> = {
  annual: "var(--status-info)",
  sick: "var(--status-refused)",
  other: "var(--status-scheduled)",
  unpaid: "var(--status-neutral)",
};

const TYPE_BADGE: Record<LeaveType, { fg: string; bg: string }> = {
  annual: { fg: "var(--status-info)", bg: "var(--status-info-bg)" },
  sick: { fg: "var(--status-refused)", bg: "var(--status-refused-bg)" },
  other: { fg: "var(--status-scheduled)", bg: "var(--status-scheduled-bg)" },
  unpaid: { fg: "var(--status-neutral)", bg: "var(--status-neutral-bg)" },
};

const STATUS_BADGE: Record<LeaveStatus, { fg: string; bg: string; label: string }> = {
  approved: { fg: "var(--status-completed)", bg: "var(--status-completed-bg)", label: "Approved" },
  pending: { fg: "var(--status-scheduled)", bg: "var(--status-scheduled-bg)", label: "Pending" },
  rejected: { fg: "var(--status-refused)", bg: "var(--status-refused-bg)", label: "Rejected" },
};

export default function MyLeave() {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-[var(--ink)]">
          Leave Balance — Year 2026
        </div>
        <button
          onClick={() => setApplyOpen(true)}
          className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[#1a1300] transition-colors hover:bg-[var(--gold-bright)]"
        >
          + Apply Leave
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {LEAVE_BALANCES.map((b) => {
          const balance = b.total - b.used;
          return (
            <SummaryCard
              key={b.type}
              label={b.label}
              dotColor={TYPE_DOT[b.type]}
              value={
                <span>
                  {b.used.toFixed(0)}
                  <span className="text-base font-medium text-[var(--muted)]">
                    /{b.total.toFixed(0)}
                  </span>
                </span>
              }
              sub={
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)]">Taken</span>
                  <span>
                    <span className="font-semibold text-[var(--status-scheduled)]">
                      {balance.toFixed(0)}
                    </span>{" "}
                    <span className="text-[var(--muted)]">Pending</span>
                  </span>
                </div>
              }
            />
          );
        })}
      </div>

      <div className="mb-3 text-sm font-semibold text-[var(--ink)]">
        My Leave Applications
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
        <div className="overflow-x-auto">
          <div className="grid min-w-[880px] grid-cols-[120px_100px_100px_70px_1.4fr_150px_110px_70px] gap-2 border-b border-[var(--card-border)] bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            <span>Leave type</span>
            <span>From date</span>
            <span>To date</span>
            <span>Days</span>
            <span>Reason</span>
            <span>Applied date</span>
            <span>Status</span>
            <span></span>
          </div>

          {MOCK_LEAVE_APPLICATIONS.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[var(--muted)]">
              No leave applications yet.
            </div>
          )}

          {MOCK_LEAVE_APPLICATIONS.map((l) => {
            const typeStyle = TYPE_BADGE[l.type];
            const statusStyle = STATUS_BADGE[l.status];
            return (
              <div
                key={l.id}
                className="grid min-w-[880px] grid-cols-[120px_100px_100px_70px_1.4fr_150px_110px_70px] items-center gap-2 border-b border-[var(--card-border)] px-5 py-3.5 text-sm last:border-b-0 hover:bg-gray-50"
              >
                <span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: typeStyle.fg, backgroundColor: typeStyle.bg }}
                  >
                    {l.label}
                  </span>
                </span>
                <span className="text-[var(--muted)]">{l.fromDate}</span>
                <span className="text-[var(--muted)]">{l.toDate}</span>
                <span className="text-[var(--muted)]">{l.days.toFixed(2)}</span>
                <span className="truncate text-[var(--ink)]" title={l.reason}>
                  {l.reason}
                </span>
                <span className="text-xs text-[var(--muted)]">{l.appliedAt}</span>
                <span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: statusStyle.fg, backgroundColor: statusStyle.bg }}
                  >
                    {statusStyle.label}
                  </span>
                </span>
                <button
                  aria-label="View leave application"
                  className="justify-self-end text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
                >
                  <IconEye className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3.5 text-sm text-[var(--muted)]">
          Showing 1 to {MOCK_LEAVE_APPLICATIONS.length} of{" "}
          {MOCK_LEAVE_APPLICATIONS.length} entries
        </div>
      </div>

      {applyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setApplyOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-base font-semibold text-[var(--ink)]">
              Apply Leave
            </h2>
            <p className="mb-4 text-sm text-[var(--muted)]">
              Hook this form up to your leave-request API. Left as a stub so
              the layout matches your design system.
            </p>
            <button
              onClick={() => setApplyOpen(false)}
              className="w-full rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[#1a1300] hover:bg-[var(--gold-bright)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
