"use client";

import { useEffect, useRef, useState } from "react";
import { Task } from "@/lib/types";

export default function TaskRow({
  task,
  editable,
  onToggleStatus,
  onRemove,
}: {
  task: Task;
  editable: boolean;
  onToggleStatus?: (task: Task) => void;
  onRemove?: (task: Task) => void;
}) {
  const [flip, setFlip] = useState(false);
  const prevStatus = useRef(task.status);

  useEffect(() => {
    if (prevStatus.current !== task.status) {
      setFlip(true);
      const t = setTimeout(() => setFlip(false), 400);
      prevStatus.current = task.status;
      return () => clearTimeout(t);
    }
  }, [task.status]);

  const isCompleted = task.status === "completed";

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[var(--card-border)] px-5 py-3.5 last:border-b-0">
      <span className="text-sm text-[var(--ink)]">{task.text}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!editable}
          onClick={() => onToggleStatus?.(task)}
          className={`${flip ? "flap-flip" : ""} rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            isCompleted
              ? "bg-[var(--status-completed-bg)] text-[var(--status-completed)]"
              : "bg-[var(--status-scheduled-bg)] text-[var(--status-scheduled)]"
          } ${editable ? "cursor-pointer" : "cursor-default opacity-90"}`}
        >
          {isCompleted ? "Completed" : "Scheduled"}
        </button>

        {editable && (
          <button
            type="button"
            onClick={() => onRemove?.(task)}
            aria-label="Remove task"
            className="text-[var(--muted)] transition-colors hover:text-[var(--status-refused)]"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
