import { AttendanceRecord } from "./types";

export const MOCK_ATTENDANCE_HISTORY: AttendanceRecord[] = [
  { id: "d1", date: "2026-07-01", day: "Wednesday", checkIn: "10: AM", checkOut: "06:06 PM", workingHours: "8 hrs ", status: "present", lateBy: null, location: "RD Backend" },
  { id: "d2", date: "2026-07-02", day: "Thursday", checkIn: "10: AM", checkOut: "06:03 PM", workingHours: "8 hrs ", status: "present", lateBy: null, location: "R2uni" },
  { id: "d3", date: "2026-07-03", day: "Friday", checkIn: "10: AM", checkOut: "06:02 PM", workingHours: "8 hrs ", status: "present", lateBy: null, location: "RD Bagbajar" },
  { id: "d4", date: "2026-07-06", day: "Monday", checkIn: "10: AM", checkOut: "06:05 PM", workingHours: "8 hrs ", status: "present", lateBy: null, location: "Ysju " },
  { id: "d5", date: "2026-07-07", day: "Tuesday", checkIn: "10: AM", checkOut: "06:06 PM", workingHours: "8 hrs", status: "present", lateBy: null, location: "R2uni" },
  { id: "d6", date: "2026-07-08", day: "Wednesday", checkIn: "10: AM", checkOut: "06:09 PM", workingHours: "8 hrs", status: "present", lateBy: null, location: "Ysju" },
  { id: "d7", date: "2026-07-09", day: "Thursday", checkIn: "10: AM", checkOut: "06:10 PM", workingHours: "8 hrs", status: "present", lateBy: null, location: "Realdreams Bagbajar" },
  { id: "d8", date: "2026-07-10", day: "Friday", checkIn: "10: AM", checkOut: "06:10 PM", workingHours: "8 hrs", status: "present", lateBy: null, location: "RDLC" },
  { id: "d9", date: "2026-07-13", day: "Monday", checkIn: "10:AM", checkOut: "06:13 PM", workingHours: "8 hrs", status: "present", lateBy: null, location: "RDLC" },
  { id: "d10", date: "2026-07-14", day: "Tuesday", checkIn: "10: AM", checkOut: null, workingHours: null, status: "present", lateBy: null, location: "Real Dreams" },
];
