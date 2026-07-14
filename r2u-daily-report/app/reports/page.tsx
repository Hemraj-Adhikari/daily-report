import AppShell from "@/components/AppShell";
import ReportsView from "@/components/ReportsView";

export default function ReportsPage() {
  return (
    <AppShell
      active="reports"
      title="Reports"
      subtitle="Team task summary and PDF export"
    >
      <ReportsView />
    </AppShell>
  );
}
