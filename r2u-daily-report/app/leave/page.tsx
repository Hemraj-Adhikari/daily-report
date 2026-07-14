import AppShell from "@/components/AppShell";
import MyLeave from "@/components/MyLeave";

export default function LeavePage() {
  return (
    <AppShell
      active="leave"
      title="My Leave"
      subtitle="Leave balances and applications for 2026"
    >
      <MyLeave />
    </AppShell>
  );
}
