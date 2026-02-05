import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export type CardProps = {
  iconBgColor: string;
  trend?: number;
  description: string;
  icon: React.ReactNode;
  type: "percentage" | "time";
  value: number;
};

function Card({
  iconBgColor,
  trend,
  description,
  icon,
  type,
  value,
}: CardProps) {
  return (
    <div className="bg-foreground p-6 rounded-lg shadow-md text-black border border-white/10">
      {/* ICON & TREND */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center flex-row justify-between">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>{icon}</div>
          <div className="mt-2">
            {type === "percentage" ? (
              trend !== undefined && trend >= 0 ? (
                <span className="text-green-600 flex flex-row items-center gap-1 text-sm bg-green-500/5 px-2 py-1 rounded-md">
                  <TrendingUp size={14} />
                  {`+${trend}%`}
                </span>
              ) : (
                <span className="text-red-500 flex flex-row items-center gap-1 text-sm bg-red-500/5 px-2 py-1 rounded-md">
                  <TrendingDown size={14} />
                  {`${trend}%`}
                </span>
              )
            ) : (
              <span className="text-gray-400/90 text-sm">
                Updated {trend}m ago
              </span>
            )}
          </div>
        </div>

        {/* SUBHEADING */}
        <p className="text-gray-400 text-sm font-semibold">{description}</p>

        {/* VALUE */}
        <div className="text-white text-4xl font-bold tracking-wide">
          {value}
        </div>
      </div>
    </div>
  );
}

export default Card;
