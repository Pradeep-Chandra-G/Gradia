import { AssessmentStatus } from "./types";
import { ActivityType } from "./types";

export const statusStyles: Record<
  AssessmentStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  live: {
    label: "Live",
    bg: "bg-green-400/10",
    text: "text-green-400",
    border: "border-green-400/20",
    dot: "bg-green-400",
  },
  published: {
    label: "Published",
    bg: "bg-blue-400/10",
    text: "text-blue-400",
    border: "border-blue-400/20",
    dot: "bg-blue-400",
  },
  draft: {
    label: "Draft",
    bg: "bg-white/10",
    text: "text-white/60",
    border: "border-white/20",
    dot: "bg-white/50",
  },
  closed: {
    label: "Closed",
    bg: "bg-purple-400/10",
    text: "text-purple-400",
    border: "border-purple-400/20",
    dot: "bg-purple-400",
  },
};

import { Play, Check, AlertTriangle, UserPlus } from "lucide-react";

export const activityStyles: Record<
  ActivityType,
  {
    icon: React.ElementType;
    bg: string;
    text: string;
    border: string;
  }
> = {
  start: {
    icon: Play,
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-400/30",
  },
  complete: {
    icon: Check,
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-400/30",
  },
  alert: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-400/30",
  },
  user: {
    icon: UserPlus,
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-400/30",
  },
};
