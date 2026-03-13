"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyButtonProps {
  isCritical: boolean;
  onTrigger: () => void;
}

export function EmergencyButton({ isCritical, onTrigger }: EmergencyButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onTrigger();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#1E293B] border border-border rounded-lg shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-sm text-foreground">
            Manually trigger emergency protocol
          </p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#1E293B] border-b border-r border-border rotate-45" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "relative w-16 h-16 rounded-full bg-[#FF4444] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95",
          isCritical && "animate-pulse-glow",
          isPressed && "scale-90"
        )}
        style={{
          boxShadow: isCritical
            ? "0 0 30px rgba(255, 68, 68, 0.6), 0 0 60px rgba(255, 68, 68, 0.3)"
            : "0 0 20px rgba(255, 68, 68, 0.4)",
          color: "#FF4444",
        }}
      >
        <AlertTriangle className="w-8 h-8 text-white" />
        
        {/* Pulse rings for critical state */}
        {isCritical && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#FF4444] opacity-30 animate-ping" />
            <span className="absolute inset-0 rounded-full border-2 border-[#FF4444] animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
