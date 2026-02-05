import { Activity } from "@/lib/types";
import { activityStyles } from "@/lib/styles";

interface ActivityItemProps {
  activity: Activity;
  isLast?: boolean;
}

export function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const style = activityStyles[activity.type];
  const Icon = style.icon;

  return (
    <div className="relative flex gap-4 select-none">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-10 h-full w-px bg-white/10" />
      )}

      {/* Icon */}
      <div
        className={`h-8 w-8 rounded-full border flex items-center justify-center ${style.bg} ${style.border}`}
      >
        <Icon className={`h-4 w-4 ${style.text}`} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <p className="text-sm">
          {activity.title}{" "}
          {activity.highlight && (
            <span className="text-indigo-400 font-medium">
              {activity.highlight}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
      </div>
    </div>
  );
}
