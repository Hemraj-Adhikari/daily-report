import AppShell from "@/components/AppShell";
import MyAttendance from "@/components/MyAttendance";

export default function AttendancePage() {
  return (
    <AppShell
      active="attendance"
      title="My Attendance"
      subtitle="Check in/out and review your attendance history"
    >
      <MyAttendance />
    </AppShell>
  );
}
