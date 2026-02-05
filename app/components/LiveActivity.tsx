import { Activity } from "@/lib/types";
import { ActivityItem } from "./ActivityItem";

interface LiveActivityProps {
  activities: Activity[];
  title?: string;
}

export function LiveActivity({
  activities,
  title = "Live Activity",
}: LiveActivityProps) {
  return (
    <div className="w-full max-w-sm rounded-xl bg-foreground border border-white/10 p-4">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>

      <div className="space-y-1">
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
