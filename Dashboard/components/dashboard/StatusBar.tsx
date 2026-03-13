"use client";

import { Clock, Database, RefreshCw, Wifi } from "lucide-react";

interface StatusBarProps {
  uptime: string;
  totalReadings: number;
  lastSync: Date;
  apiStatus: "connected" | "disconnected" | "error";
}

export function StatusBar({
  uptime,
  totalReadings,
  lastSync,
  apiStatus,
}: StatusBarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const apiStatusColors = {
    connected: "#00FF88",
    disconnected: "#FFB800",
    error: "#FF4444",
  };

  const apiStatusLabels = {
    connected: "Connected",
    disconnected: "Disconnected",
    error: "Error",
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#0D1424] border-t border-border px-4 flex items-center justify-between text-xs z-40">
      <div className="flex items-center gap-6">
        {/* Uptime */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Uptime: <span className="text-foreground">{uptime}</span></span>
        </div>

        {/* Total Readings */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="w-3.5 h-3.5" />
          <span>Readings: <span className="text-foreground">{totalReadings.toLocaleString()}</span></span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Last Sync */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Last Sync: <span className="text-foreground">{formatTime(lastSync)}</span></span>
        </div>

        {/* API Status */}
        <div className="flex items-center gap-2">
          <Wifi
            className="w-3.5 h-3.5"
            style={{ color: apiStatusColors[apiStatus] }}
          />
          <span
            className="font-medium"
            style={{ color: apiStatusColors[apiStatus] }}
          >
            {apiStatusLabels[apiStatus]}
          </span>
        </div>
      </div>
    </div>
  );
}
