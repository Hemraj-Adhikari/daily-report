export default function SummaryCard({
  label,
  value,
  dotColor,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  /** Optional colored dot next to the label, e.g. "#2563eb" */
  dotColor?: string;
  /** Optional secondary row, e.g. Used / Balance breakdown */
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-5 py-4 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2">
        {dotColor && (
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {label}
        </span>
      </div>
      <div className="text-2xl font-semibold text-[var(--ink)]">{value}</div>
      {sub && <div className="mt-2">{sub}</div>}
    </div>
  );
}
