"use client";

import { useState, useEffect } from "react";
import { Heart, Settings, Wifi } from "lucide-react";

export function Navbar() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Set initial time on client only to avoid hydration mismatch
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate occasional connection status changes
    const connectionTimer = setInterval(() => {
      setIsConnected(Math.random() > 0.05);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(connectionTimer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1424] border-b border-border z-50 px-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Heart className="w-8 h-8 text-[#FF4444] fill-[#FF4444]" />
          <div className="absolute inset-0 animate-ping">
            <Heart className="w-8 h-8 text-[#FF4444] opacity-30" />
          </div>
        </div>
        <span className="text-xl font-bold text-foreground">
          Vital<span className="text-[#00F5FF]">Guard</span>
        </span>
      </div>

      {/* Center: Patient Info */}
      <div className="hidden md:flex items-center gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-foreground">John Doe</span>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Age 45</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Patient ID #PX-2024-001</span>
          </div>
        </div>
      </div>

      {/* Right: Clock, Connection, Settings */}
      <div className="flex items-center gap-4">
        {/* Clock */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-lg font-mono text-[#00F5FF]">
            {currentTime ? formatTime(currentTime) : "--:--:--"}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentTime ? formatDate(currentTime) : "--- --- --, ----"}
          </span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-[#00FF88]" : "bg-[#FF4444]"
              } ${isConnected ? "animate-pulse-dot" : ""}`}
            />
          </div>
          <Wifi
            className={`w-5 h-5 ${isConnected ? "text-[#00FF88]" : "text-[#FF4444]"}`}
          />
        </div>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </nav>
  );
}
