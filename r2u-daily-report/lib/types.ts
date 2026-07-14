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

/* ---------------------------------------------------------------------- */
/* Asset Management                                                        */
/* ---------------------------------------------------------------------- */

export type AssetStatus =
  | "not_used"
  | "using"
  | "liquidation"
  | "warranty_repair"
  | "report_lost"
  | "broken";

export interface Asset {
  id: string;
  code: string;
  name: string;
  group: string;
  purchaseDate: string; // YYYY-MM-DD
  quantityAllocated: number;
  inventory: number;
  originalPrice: number;
  unit: string;
  department: string;
  status: AssetStatus;
}

/* ---------------------------------------------------------------------- */
/* HR — Leave                                                              */
/* ---------------------------------------------------------------------- */

export type LeaveType = "annual" | "sick" | "other" | "unpaid";
export type LeaveStatus = "approved" | "pending" | "rejected";

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
}

export interface LeaveApplication {
  id: string;
  type: LeaveType;
  label: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  appliedAt: string;
  status: LeaveStatus;
}

/* ---------------------------------------------------------------------- */
/* HR — Attendance                                                         */
/* ---------------------------------------------------------------------- */

export type AttendanceStatus = "present" | "absent" | "half_day";

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  day: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string | null;
  status: AttendanceStatus;
  lateBy: string | null;
  location: string;
}
