"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { TeamMember } from "@/lib/types";
import { IconBoard, IconHistory, IconReports, IconLogout } from "./icons";

const STORAGE_KEY = "r2u-daily-board-member";

const NAV_ITEMS = [
  { key: "today", label: "Daily Board", href: "/", icon: IconBoard },
  { key: "history", label: "History", href: "/history", icon: IconHistory },
  { key: "reports", label: "Reports", href: "/reports", icon: IconReports },
] as const;

export default function AppShell({
  active,
  title,
  subtitle,
  action,
  children,
}: {
  active: "today" | "history" | "reports";
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [member, setMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMember(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  function switchUser() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen bg-[var(--page-bg)]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[var(--nav-bg)] lg:flex">
        <div className="border-b border-[var(--nav-line)] px-5 py-5">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <a
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--gold)] text-[#1a1300]"
                    : "text-[var(--nav-fg)] hover:bg-[var(--nav-bg-soft)]"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-[var(--nav-line)] px-3 py-4">
          {member ? (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-sm font-semibold text-[#1a1300]">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-[var(--nav-fg)]">
                  {member.name}
                </div>
                <div className="truncate text-xs text-[var(--nav-muted)]">
                  {member.role}
                </div>
              </div>
              <button
                onClick={switchUser}
                aria-label="Switch user"
                className="shrink-0 text-[var(--nav-muted)] transition-colors hover:text-[var(--gold)]"
              >
                <IconLogout className="h-[18px] w-[18px]" />
              </button>
            </div>
          ) : (
            <div className="px-2 text-xs text-[var(--nav-muted)]">
              No user selected
            </div>
          )}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar with logo (sidebar hidden below lg) */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] bg-[var(--nav-bg)] px-4 py-3 lg:hidden">
          <Logo compact />
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className={`rounded-md p-2 ${
                    isActive
                      ? "bg-[var(--gold)] text-[#1a1300]"
                      : "text-[var(--nav-fg)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-5 sm:px-8">
          <div>
            <h1 className="text-xl font-semibold text-[var(--ink)]">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm text-[var(--muted)]">{subtitle}</p>
            )}
          </div>
          {action}
        </header>

        <main className="flex-1 px-6 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
