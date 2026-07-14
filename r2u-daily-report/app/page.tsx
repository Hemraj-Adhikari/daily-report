import AppShell from "@/components/AppShell";
import DailyBoard from "@/components/DailyBoard";

export default function Home() {
  return (
    <AppShell
      active="today"
      title="Daily Board"
      subtitle="Log today's tasks and generate the end-of-day report"
    >
      <DailyBoard />
    </AppShell>
  );
}
