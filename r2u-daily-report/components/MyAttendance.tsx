"use client";

import { useEffect, useMemo, useState } from "react";
import { AttendanceStatus } from "@/lib/types";
import { MOCK_ATTENDANCE_HISTORY } from "@/lib/mockAttendance";
import { IconPin } from "./icons";

const STATUS_BADGE: Record<AttendanceStatus, { fg: string; bg: string; label: string }> = {
  present: { fg: "var(--status-completed)", bg: "var(--status-completed-bg)", label: "Present" },
  absent: { fg: "var(--status-refused)", bg: "var(--status-refused-bg)", label: "Absent" },
  half_day: { fg: "var(--status-scheduled)", bg: "var(--status-scheduled-bg)", label: "Half Day" },
};

export default function MyAttendance() {
  const [now, setNow] = useState(() => new Date());
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkedInAt] = useState("09:26 AM");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = useMemo(() => {
    const present = MOCK_ATTENDANCE_HISTORY.filter((r) => r.status === "present").length;
    const absent = MOCK_ATTENDANCE_HISTORY.filter((r) => r.status === "absent").length;
    const halfDay = MOCK_ATTENDANCE_HISTORY.filter((r) => r.status === "half_day").length;
    const late = MOCK_ATTENDANCE_HISTORY.filter((r) => r.lateBy).length;
    return { present, absent, halfDay, late };
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Clock / check-in card */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-[var(--card-border)] bg-gradient-to-r from-[var(--nav-bg)] to-[var(--nav-bg-soft)] px-6 py-6 shadow-sm">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--nav-muted)]">
            Current Time
          </div>
          <div className="mt-1 text-4xl font-semibold text-[var(--gold)]">
            {time}
          </div>
          <div className="mt-1 text-sm text-[var(--nav-fg)]">{dateLabel}</div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              color: checkedIn ? "var(--status-completed)" : "var(--status-neutral)",
              backgroundColor: checkedIn
                ? "var(--status-completed-bg)"
                : "var(--status-neutral-bg)",
            }}
          >
            {checkedIn ? "Checked In" : "Checked Out"}
          </span>
          {checkedIn && (
            <>
              <div className="text-sm text-[var(--nav-fg)]">
                Checked in at: {checkedInAt}
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--nav-muted)]">
                <IconPin className="h-3.5 w-3.5" />
                Location: 27.6980313, 85.3377911
              </div>
            </>
          )}
          <button
            onClick={() => setCheckedIn((v) => !v)}
            className="mt-1 rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[#1a1300] transition-colors hover:bg-[var(--gold-bright)]"
          >
            {checkedIn ? "Check Out Now" : "Check In Now"}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Present Days" value={stats.present} color="var(--status-completed)" />
        <Stat label="Absent Days" value={stats.absent} color="var(--status-refused)" />
        <Stat label="Late Arrivals" value={stats.late} color="var(--status-scheduled)" />
        <Stat label="Half Days" value={stats.halfDay} color="var(--status-info)" />
      </div>

      <div className="mb-3 text-sm font-semibold text-[var(--ink)]">
        Attendance History — Current Month
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
        <div className="overflow-x-auto">
          <div className="grid min-w-[880px] grid-cols-[100px_100px_100px_100px_120px_100px_90px_1.3fr] gap-2 border-b border-[var(--card-border)] bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            <span>Date</span>
            <span>Day</span>
            <span>Check in</span>
            <span>Check out</span>
            <span>Working hours</span>
            <span>Status</span>
            <span>Late by</span>
            <span>Location</span>
          </div>

          {MOCK_ATTENDANCE_HISTORY.map((r) => {
            const style = STATUS_BADGE[r.status];
            return (
              <div
                key={r.id}
                className="grid min-w-[880px] grid-cols-[100px_100px_100px_100px_120px_100px_90px_1.3fr] items-center gap-2 border-b border-[var(--card-border)] px-5 py-3.5 text-sm last:border-b-0 hover:bg-gray-50"
              >
                <span className="text-[var(--ink)]">{r.date}</span>
                <span className="text-[var(--muted)]">{r.day}</span>
                <span className="text-[var(--muted)]">{r.checkIn ?? "—"}</span>
                <span className="text-[var(--muted)]">{r.checkOut ?? "—"}</span>
                <span className="text-[var(--muted)]">{r.workingHours ?? "—"}</span>
                <span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: style.fg, backgroundColor: style.bg }}
                  >
                    {style.label}
                  </span>
                </span>
                <span className="text-[var(--muted)]">{r.lateBy ?? "—"}</span>
                <span className="flex items-center gap-1 truncate text-[var(--muted)]" title={r.location}>
                  <IconPin className="h-3.5 w-3.5 shrink-0" />
                  {r.location}
                </span>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3.5 text-sm text-[var(--muted)]">
          Showing 1 to {MOCK_ATTENDANCE_HISTORY.length} of{" "}
          {MOCK_ATTENDANCE_HISTORY.length} entries
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-4 text-center shadow-sm">
      <div className="text-2xl font-semibold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </div>
    </div>
  );
}
