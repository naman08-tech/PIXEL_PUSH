"use client";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Phone,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Alert {
  id: string;
  severity: "warning" | "critical";
  message: string;
  time: string;
}

export interface Action {
  id: string;
  type: "call" | "appointment" | "notification";
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface ActionsPanelProps {
  alerts: Alert[];
  actions: Action[];
  onDismissAlert: (id: string) => void;
}

const actionIcons = {
  call: Phone,
  appointment: Calendar,
  notification: MessageSquare,
};

const statusColors = {
  completed: "#00FF88",
  pending: "#FFB800",
  failed: "#FF4444",
};

const statusLabels = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
};

export function ActionsPanel({
  alerts,
  actions,
  onDismissAlert,
}: ActionsPanelProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Active Alerts */}
      <div className="bg-card border border-border rounded-xl flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Active Alerts
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <CheckCircle className="w-12 h-12 text-[#00FF88] mb-3" />
              <p className="text-sm text-[#00FF88] font-medium">
                No Active Alerts
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All systems operating normally
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-lg border flex items-start gap-3",
                    alert.severity === "critical"
                      ? "bg-[#FF4444]/10 border-[#FF4444]/30"
                      : "bg-[#FFB800]/10 border-[#FFB800]/30"
                  )}
                >
                  {alert.severity === "critical" ? (
                    <XCircle className="w-5 h-5 text-[#FF4444] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-[#FFB800] shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.time}
                    </p>
                  </div>
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions Triggered */}
      <div className="bg-card border border-border rounded-xl flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Actions Triggered
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {actions.map((action) => {
            const Icon = actionIcons[action.type];
            return (
              <div
                key={action.id}
                className="p-3 rounded-lg bg-[#0D1424] border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${statusColors[action.status]}20` }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: statusColors[action.status] }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {action.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {action.timestamp}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${statusColors[action.status]}20`,
                          color: statusColors[action.status],
                        }}
                      >
                        {statusLabels[action.status]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
