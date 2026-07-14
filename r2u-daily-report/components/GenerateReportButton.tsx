"use client";

import { useState } from "react";
import { DailyReport } from "@/lib/types";
import { generateReportPdf, reportFileName } from "@/lib/generateReportPdf";
import { finalizeReport } from "@/lib/reports";

export default function GenerateReportButton({
  report,
}: {
  report: DailyReport;
}) {
  const [busy, setBusy] = useState(false);
  const alreadyFinalized = report.status === "finalized";

  async function handleClick() {
    if (report.tasks.length === 0) {
      alert("Add at least one task before generating the report.");
      return;
    }
    setBusy(true);
    try {
      const doc = await generateReportPdf(report);
      doc.save(reportFileName(report));
      if (!alreadyFinalized) {
        await finalizeReport(report.id);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="w-full rounded-lg bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a332e] disabled:opacity-60"
    >
      {busy
        ? "Generating…"
        : alreadyFinalized
        ? "Re-download PDF"
        : "Generate end-of-day report (PDF)"}
    </button>
  );
}
