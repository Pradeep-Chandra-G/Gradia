"use client";

import { EllipsisVertical } from "lucide-react";
import { Assessment } from "@/lib/types";
import { statusStyles } from "@/lib/styles";

interface AssessmentRowProps {
  assessment: Assessment;
  onActionClick?: (id: string) => void;
}

export function AssessmentRow({
  assessment,
  onActionClick,
}: AssessmentRowProps) {
  const status = statusStyles[assessment.status];

  const progress =
    assessment.candidates &&
    Math.round(
      (assessment.candidates.current / assessment.candidates.total) * 100,
    );

  return (
    <tr className="bg-white/5 hover:bg-white/10 transition rounded-lg">
      {/* NAME */}
      <td className="px-4 py-3 rounded-l-lg select-none">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold">
            {assessment.name.charAt(0)}
          </div>

          <div>
            <p className="font-medium">{assessment.name}</p>
            {assessment.subtitle && (
              <p className="text-xs text-muted-foreground">
                {assessment.subtitle}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* STATUS */}
      <td className="px-4 py-3 select-none">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border ${status.bg} ${status.text} ${status.border}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${status.dot} ${
              assessment.status === "live" ? "animate-pulse" : ""
            }`}
          />
          {status.label}
        </div>
      </td>

      {/* CANDIDATES */}
      <td className="px-4 py-3 select-none">
        {assessment.candidates ? (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {assessment.candidates.current} / {assessment.candidates.total}
            </p>
            <div className="h-1.5 w-28 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-current"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>

      {/* DATE */}
      <td className="px-4 py-3 text-muted-foreground select-none">
        {assessment.date}
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-3 text-right rounded-r-lg">
        <button
          onClick={() => onActionClick?.(assessment.id)}
          className="p-2 rounded-md hover:bg-white/10 hover:cursor-pointer"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
