"use client";

import { cn } from "@/lib/utils";

export interface LogEntry {
  id: string;
  timestamp: string;
  agent: "Monitor" | "Risk" | "Emergency";
  decision: string;
  triggers: string[];
  confidence: number;
  action: string;
}

interface DecisionLogProps {
  entries: LogEntry[];
}

const agentColors = {
  Monitor: "#00F5FF",
  Risk: "#FFB800",
  Emergency: "#FF4444",
};

const agentNames = {
  Monitor: "Vitals Monitor Agent",
  Risk: "Risk Assessment Agent",
  Emergency: "Emergency Response Agent",
};

export function DecisionLog({ entries }: DecisionLogProps) {
  return (
    <div className="bg-card border border-border rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Agent Decision Log
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse-dot" />
          <span className="text-xs text-[#00FF88] font-medium">Live</span>
        </div>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              "p-3 rounded-lg border border-border/50 animate-in slide-in-from-top-2 fade-in duration-300",
              index % 2 === 0 ? "bg-[#0D1424]" : "bg-[#111827]"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Timestamp and Agent */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">
                {entry.timestamp}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${agentColors[entry.agent]}20`,
                  color: agentColors[entry.agent],
                }}
              >
                {agentNames[entry.agent]}
              </span>
            </div>

            {/* Decision */}
            <p className="text-sm text-foreground mb-2">{entry.decision}</p>

            {/* Triggers */}
            {entry.triggers.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {entry.triggers.map((trigger, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#1E293B] text-muted-foreground"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            )}

            {/* Confidence and Action */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Confidence:{" "}
                <span
                  className={cn(
                    "font-medium",
                    entry.confidence >= 90
                      ? "text-[#00FF88]"
                      : entry.confidence >= 70
                        ? "text-[#FFB800]"
                        : "text-[#FF4444]"
                  )}
                >
                  {entry.confidence}%
                </span>
              </span>
              <span className="text-muted-foreground">
                Action:{" "}
                <span className="text-foreground font-medium">
                  {entry.action}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
