"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type VitalStatus = "normal" | "warning" | "critical";

interface VitalCardProps {
  icon: React.ReactNode;
  name: string;
  value: string | number;
  unit: string;
  status: VitalStatus;
  normalRange: string;
  history: number[];
  isActivity?: boolean;
  activityTimeline?: { state: string; time: string }[];
}

const statusColors = {
  normal: "#00FF88",
  warning: "#FFB800",
  critical: "#FF4444",
};

const statusLabels = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

export function VitalCard({
  icon,
  name,
  value,
  unit,
  status,
  normalRange,
  history,
  isActivity = false,
  activityTimeline,
}: VitalCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const color = statusColors[status];

  // Trigger animation on value change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [value]);

  const chartData = history.map((v, i) => ({ value: v, index: i }));

  const activityColors: Record<string, string> = {
    Resting: "#00F5FF",
    Walking: "#00FF88",
    Running: "#FFB800",
    Sleeping: "#8B5CF6",
  };

  return (
    <div
      className={cn(
        "relative bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden group",
        status === "critical" && "animate-critical-pulse"
      )}
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: color,
        boxShadow: `inset 0 0 30px ${color}10`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-10"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div style={{ color }} className="opacity-80">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{name}</h3>
        </div>
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            status === "normal" && "bg-[#00FF88]/20 text-[#00FF88]",
            status === "warning" && "bg-[#FFB800]/20 text-[#FFB800]",
            status === "critical" && "bg-[#FF4444]/20 text-[#FF4444]"
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* Value */}
      <div className="relative text-center my-4">
        <span
          className={cn(
            "text-3xl font-bold transition-transform",
            isAnimating && "animate-value-pulse"
          )}
          style={{ color }}
        >
          {value}
        </span>
        <span className="text-lg text-muted-foreground ml-1">{unit}</span>
      </div>

      {/* Chart or Activity Timeline */}
      <div className="relative h-12 mb-3">
        {isActivity && activityTimeline ? (
          <div className="flex items-center gap-1 h-full overflow-x-auto">
            {activityTimeline.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center flex-1 min-w-[50px]"
              >
                <span
                  className="text-xs font-medium px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: `${activityColors[item.state] || "#00F5FF"}20`,
                    color: activityColors[item.state] || "#00F5FF",
                  }}
                >
                  {item.state}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Normal Range */}
      <p className="relative text-xs text-muted-foreground text-center">
        Normal: {normalRange}
      </p>
    </div>
  );
}
