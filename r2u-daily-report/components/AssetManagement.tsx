"use client";

import { useMemo, useState } from "react";
import { Asset, AssetStatus } from "@/lib/types";
import { MOCK_ASSETS, ASSET_STATUS_LABEL } from "@/lib/mockAssets";
import { IconSearch } from "./icons";

const TABS: { key: "all" | AssetStatus; label: string }[] = [
  { key: "all", label: "All Asset" },
  { key: "not_used", label: "Not used yet" },
  { key: "using", label: "Using" },
  { key: "liquidation", label: "Liquidation" },
  { key: "warranty_repair", label: "Warranty Repair" },
  { key: "report_lost", label: "Report lost" },
  { key: "broken", label: "Broken" },
];

const STATUS_STYLE: Record<AssetStatus, { fg: string; bg: string }> = {
  not_used: { fg: "var(--status-neutral)", bg: "var(--status-neutral-bg)" },
  using: { fg: "var(--status-info)", bg: "var(--status-info-bg)" },
  liquidation: { fg: "var(--status-scheduled)", bg: "var(--status-scheduled-bg)" },
  warranty_repair: { fg: "var(--status-purple)", bg: "var(--status-purple-bg)" },
  report_lost: { fg: "var(--status-refused)", bg: "var(--status-refused-bg)" },
  broken: { fg: "var(--status-refused)", bg: "var(--status-refused-bg)" },
};

const currency = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function AssetManagement() {
  const [tab, setTab] = useState<"all" | AssetStatus>("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);

  const assets: Asset[] = MOCK_ASSETS; // swap for a real fetch when the backend is wired up

  const filtered = useMemo(() => {
    let rows = tab === "all" ? assets : assets.filter((a) => a.status === tab);
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (a) =>
          a.code.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [assets, tab, query]);

  const visible = filtered.slice(0, pageSize);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1.5 shadow-sm">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--gold)] text-[#1a1300]"
                  : "text-[var(--muted)] hover:bg-gray-50 hover:text-[var(--ink)]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-[var(--card-border)] bg-white px-2.5 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button className="rounded-lg border border-[var(--card-border)] px-3.5 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-gray-50">
              Export
            </button>
          </div>

          <div className="relative w-full max-w-xs">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-lg border border-[var(--card-border)] bg-white py-1.5 pl-9 pr-3 text-sm text-[var(--ink)] focus:border-[var(--gold)] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[980px] grid-cols-[90px_1.4fr_1fr_110px_120px_90px_130px_100px_1.2fr_130px] gap-2 border-b border-[var(--card-border)] bg-gray-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            <span>Asset code</span>
            <span>Asset name</span>
            <span>Asset group</span>
            <span>Purchase date</span>
            <span>Qty allocated</span>
            <span>Inventory</span>
            <span>Original price</span>
            <span>Unit</span>
            <span>Department</span>
            <span>Status</span>
          </div>

          {visible.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-[var(--muted)]">
              No assets match this view.
            </div>
          )}

          {visible.map((a) => {
            const style = STATUS_STYLE[a.status];
            return (
              <div
                key={a.id}
                className="grid min-w-[980px] grid-cols-[90px_1.4fr_1fr_110px_120px_90px_130px_100px_1.2fr_130px] items-center gap-2 border-b border-[var(--card-border)] px-5 py-3.5 text-sm last:border-b-0 hover:bg-gray-50"
              >
                <span className="font-medium text-[var(--ink)]">{a.code}</span>
                <span className="text-[var(--ink)]">{a.name}</span>
                <span className="text-[var(--muted)]">{a.group}</span>
                <span className="text-[var(--muted)]">{a.purchaseDate}</span>
                <span className="text-[var(--muted)]">{a.quantityAllocated}</span>
                <span className="text-[var(--muted)]">{a.inventory}</span>
                <span className="text-[var(--muted)]">{currency.format(a.originalPrice)}</span>
                <span className="text-[var(--muted)]">{a.unit}</span>
                <span className="text-[var(--muted)]">{a.department}</span>
                <span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: style.fg, backgroundColor: style.bg }}
                  >
                    {ASSET_STATUS_LABEL[a.status]}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm text-[var(--muted)]">
          <span>
            Showing {visible.length === 0 ? 0 : 1} to {visible.length} of{" "}
            {filtered.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[var(--muted)] hover:bg-gray-50">
              Previous
            </button>
            <span className="rounded-lg bg-[var(--gold)] px-3 py-1.5 font-semibold text-[#1a1300]">
              1
            </span>
            <button className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-[var(--muted)] hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
