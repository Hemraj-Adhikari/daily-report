export type TaskStatus = "scheduled" | "completed";

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  addedAt: string; // ISO timestamp
  /** Legacy field from the old Morning/Afternoon board. Old reports may still
   * have this set — kept optional so they still render correctly. New tasks
   * no longer set it. */
  slot?: "morning" | "afternoon";
}

export type ReportStatus = "open" | "finalized";

export interface DailyReport {
  id: string; // format: YYYY-MM-DD_userId
  date: string; // YYYY-MM-DD
  userId: string;
  userName: string;
  tasks: Task[];
  status: ReportStatus;
  finalizedAt?: string;
  pdfGeneratedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}
