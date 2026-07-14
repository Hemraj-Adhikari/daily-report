import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit as fsLimit,
} from "firebase/firestore";
import { db } from "./firebase";
import { DailyReport, Task } from "./types";

function todayStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function reportDocId(userId: string, date: string): string {
  return `${date}_${userId}`;
}

export async function getOrCreateTodayReport(
  userId: string,
  userName: string
): Promise<DailyReport> {
  const date = todayStr();
  const id = reportDocId(userId, date);
  const ref = doc(db, "dailyReports", id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as DailyReport;
  }

  const fresh: DailyReport = {
    id,
    date,
    userId,
    userName,
    tasks: [],
    status: "open",
  };
  await setDoc(ref, fresh);
  return fresh;
}

export function subscribeToReport(
  reportId: string,
  cb: (report: DailyReport | null) => void
) {
  const ref = doc(db, "dailyReports", reportId);
  return onSnapshot(ref, (snap) => {
    cb(snap.exists() ? (snap.data() as DailyReport) : null);
  });
}

export async function addTask(
  reportId: string,
  currentTasks: Task[],
  text: string
) {
  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    status: "scheduled",
    addedAt: new Date().toISOString(),
  };
  const ref = doc(db, "dailyReports", reportId);
  await updateDoc(ref, { tasks: [...currentTasks, newTask] });
}

export async function toggleTaskStatus(
  reportId: string,
  currentTasks: Task[],
  taskId: string
) {
  const updated = currentTasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          status: t.status === "completed" ? "scheduled" : "completed",
        }
      : t
  );
  const ref = doc(db, "dailyReports", reportId);
  await updateDoc(ref, { tasks: updated });
}

export async function removeTask(
  reportId: string,
  currentTasks: Task[],
  taskId: string
) {
  const updated = currentTasks.filter((t) => t.id !== taskId);
  const ref = doc(db, "dailyReports", reportId);
  await updateDoc(ref, { tasks: updated });
}

export async function finalizeReport(reportId: string) {
  const ref = doc(db, "dailyReports", reportId);
  await updateDoc(ref, {
    status: "finalized",
    finalizedAt: new Date().toISOString(),
    pdfGeneratedAt: new Date().toISOString(),
  });
}

export function subscribeToHistory(
  cb: (reports: DailyReport[]) => void,
  max = 100
) {
  const q = query(
    collection(db, "dailyReports"),
    orderBy("date", "desc"),
    fsLimit(max)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as DailyReport));
  });
}
