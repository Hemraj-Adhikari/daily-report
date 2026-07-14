import AppShell from "@/components/AppShell";
import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <AppShell
      active="history"
      title="History"
      subtitle="Every finalized daily report, by team member"
    >
      <HistoryList />
    </AppShell>
  );
}
