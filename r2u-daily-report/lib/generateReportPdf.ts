import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DailyReport } from "./types";

const NAVY: [number, number, number] = [20, 44, 45]; // R2U cap teal
const GOLD: [number, number, number] = [211, 162, 21]; // R2U road/wordmark gold
const SLATE: [number, number, number] = [90, 120, 118];

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/logo.png");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateReportPdf(report: DailyReport): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  const HEADER_H = 104;
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, HEADER_H, "F");

  doc.setFillColor(...GOLD);
  doc.rect(0, HEADER_H - 3, pageWidth, 3, "F");

  const logoDataUrl = await loadLogoDataUrl();
  // original logo is 592x448 (~4:3) — render it big and clear in the header
  const logoW = 72;
  const logoH = 54;
  const textStartX = logoDataUrl ? 122 : 40;
  if (logoDataUrl) {
    // soft plate behind the mark so it reads clearly on the dark header
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(28, 22, logoW + 16, logoH + 16, 6, 6, "F");
    doc.addImage(logoDataUrl, "PNG", 36, 30, logoW, logoH);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "bold");
  doc.setFontSize(18);
  doc.text("ROUTE 2 UNI", textStartX, 46);
  doc.setFontSize(15);
  doc.setTextColor(...GOLD);
  doc.text("DAILY TASK WORK REPORT", textStartX, 66);

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(230, 230, 230);
  const dateLabel = new Date(report.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`${dateLabel}`, textStartX, 82);
  doc.text(`Prepared by: ${report.userName}`, textStartX, 94);

  // Summary line
  const completed = report.tasks.filter((t) => t.status === "completed").length;
  const total = report.tasks.length;
  doc.setTextColor(...SLATE);
  doc.setFontSize(9);
  doc.text(`${completed} of ${total} tasks completed`, pageWidth - 200, 46, {
    align: "left",
  });

  let cursorY = HEADER_H + 30;

  // Single unified task table (no more Morning / Afternoon split)
  doc.setTextColor(...NAVY);
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text("TASKS", 40, cursorY);

  autoTable(doc, {
    startY: cursorY + 8,
    margin: { left: 40, right: 40 },
    head: [["Task", "Status"]],
    body: report.tasks.length
      ? report.tasks.map((t) => [
          t.text,
          t.status === "completed" ? "Completed" : "Scheduled",
        ])
      : [["No tasks logged", "—"]],
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 6,
      textColor: [30, 30, 30],
      lineColor: [225, 225, 225],
    },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [247, 247, 244] },
    columnStyles: {
      1: { cellWidth: 110 },
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(40, pageHeight - 50, pageWidth - 40, pageHeight - 50);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(
    `Generated ${new Date().toLocaleString()} — R2U Daily Ops Board`,
    40,
    pageHeight - 35
  );

  return doc;
}

export function reportFileName(report: DailyReport): string {
  return `R2U-Daily-Report_${report.userName.replace(/\s+/g, "-")}_${report.date}.pdf`;
}

export interface MemberSummaryRow {
  name: string;
  reports: number;
  tasks: number;
  completed: number;
}

export async function generateTeamSummaryPdf(
  rows: MemberSummaryRow[],
  totals: { totalTasks: number; totalCompleted: number; totalReports: number }
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  const HEADER_H = 104;
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, HEADER_H, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, HEADER_H - 3, pageWidth, 3, "F");

  const logoDataUrl = await loadLogoDataUrl();
  const logoW = 72;
  const logoH = 54;
  const textStartX = logoDataUrl ? 122 : 40;
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(28, 22, logoW + 16, logoH + 16, 6, 6, "F");
    doc.addImage(logoDataUrl, "PNG", 36, 30, logoW, logoH);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("courier", "bold");
  doc.setFontSize(18);
  doc.text("ROUTE 2 UNI", textStartX, 46);
  doc.setFontSize(15);
  doc.setTextColor(...GOLD);
  doc.text("TEAM SUMMARY REPORT", textStartX, 66);

  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(230, 230, 230);
  doc.text(
    `Generated ${new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    textStartX,
    82
  );

  const completionRate = totals.totalTasks
    ? Math.round((totals.totalCompleted / totals.totalTasks) * 100)
    : 0;

  let cursorY = HEADER_H + 30;

  doc.setTextColor(...NAVY);
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text(
    `${totals.totalReports} reports  ·  ${totals.totalTasks} tasks  ·  ${completionRate}% completion rate`,
    40,
    cursorY
  );

  cursorY += 20;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: 40, right: 40 },
    head: [["Team member", "Reports", "Tasks", "Completed", "Completion"]],
    body: rows.length
      ? rows.map((r) => [
          r.name,
          String(r.reports),
          String(r.tasks),
          String(r.completed),
          r.tasks ? `${Math.round((r.completed / r.tasks) * 100)}%` : "—",
        ])
      : [["No data yet", "—", "—", "—", "—"]],
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 6,
      textColor: [30, 30, 30],
      lineColor: [225, 225, 225],
    },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [247, 247, 244] },
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(40, pageHeight - 50, pageWidth - 40, pageHeight - 50);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(
    `Generated ${new Date().toLocaleString()} — R2U Daily Ops Board`,
    40,
    pageHeight - 35
  );

  return doc;
}

export function teamSummaryFileName(): string {
  const d = new Date().toISOString().slice(0, 10);
  return `R2U-Team-Summary_${d}.pdf`;
}
