import { AttendanceRecord } from "./types";

export const MOCK_ATTENDANCE_HISTORY: AttendanceRecord[] = [
  { id: "d1", date: "2026-07-01", day: "Wednesday", checkIn: "09:35 AM", checkOut: "06:06 PM", workingHours: "8 hrs 31 min", status: "present", lateBy: null, location: "Kathmandu-10, Kathmandu" },
  { id: "d2", date: "2026-07-02", day: "Thursday", checkIn: "09:32 AM", checkOut: "06:03 PM", workingHours: "8 hrs 30 min", status: "present", lateBy: null, location: "Devkota Sadak, Kathmandu" },
  { id: "d3", date: "2026-07-03", day: "Friday", checkIn: "09:23 AM", checkOut: "06:02 PM", workingHours: "8 hrs 38 min", status: "present", lateBy: null, location: "Prabhu Bank, Devkota" },
  { id: "d4", date: "2026-07-06", day: "Monday", checkIn: "09:34 AM", checkOut: "06:05 PM", workingHours: "8 hrs 30 min", status: "present", lateBy: null, location: "Kathmandu-10, Kathmandu" },
  { id: "d5", date: "2026-07-07", day: "Tuesday", checkIn: "09:31 AM", checkOut: "06:06 PM", workingHours: "8 hrs 35 min", status: "present", lateBy: null, location: "Devkota Sadak, Kathmandu" },
  { id: "d6", date: "2026-07-08", day: "Wednesday", checkIn: "09:36 AM", checkOut: "06:09 PM", workingHours: "8 hrs 32 min", status: "present", lateBy: null, location: "Nepal Ideal School" },
  { id: "d7", date: "2026-07-09", day: "Thursday", checkIn: "09:28 AM", checkOut: "06:10 PM", workingHours: "8 hrs 41 min", status: "present", lateBy: null, location: "27.6980301, 85.33778" },
  { id: "d8", date: "2026-07-10", day: "Friday", checkIn: "09:32 AM", checkOut: "06:10 PM", workingHours: "8 hrs 37 min", status: "present", lateBy: null, location: "Kathmandu-10, Kathmandu" },
  { id: "d9", date: "2026-07-13", day: "Monday", checkIn: "09:37 AM", checkOut: "06:13 PM", workingHours: "8 hrs 35 min", status: "present", lateBy: null, location: "Sanyak Diagnostic Pr..." },
  { id: "d10", date: "2026-07-14", day: "Tuesday", checkIn: "09:26 AM", checkOut: null, workingHours: null, status: "present", lateBy: null, location: "27.6980313, 85.33779" },
];
