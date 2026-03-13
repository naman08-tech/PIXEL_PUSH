"use client";

import { useEffect, useState } from "react";

interface RiskScoreGaugeProps {
  score: number;
  lastUpdated: Date;
}

function getScoreColor(score: number): string {
  if (score <= 30) return "#00FF88";
  if (score <= 60) return "#FFB800";
  if (score <= 80) return "#FF8800";
  return "#FF4444";
}

function getScoreStatus(score: number): string {
  if (score <= 30) return "SAFE";
  if (score <= 60) return "CAUTION";
  if (score <= 80) return "HIGH RISK";
  return "CRITICAL";
}

function getStatusGlow(score: number): string {
  if (score <= 30) return "shadow-[0_0_30px_rgba(0,255,136,0.3)]";
  if (score <= 60) return "shadow-[0_0_30px_rgba(255,184,0,0.3)]";
  if (score <= 80) return "shadow-[0_0_30px_rgba(255,136,0,0.3)]";
  return "shadow-[0_0_30px_rgba(255,68,68,0.5)]";
}

export function RiskScoreGauge({ score, lastUpdated }: RiskScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const color = getScoreColor(score);
  const status = getScoreStatus(score);
  const glow = getStatusGlow(score);

  // Animate score changes
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = (score - displayScore) / steps;
    let current = displayScore;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      setDisplayScore(Math.round(current));

      if (step >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // SVG arc calculation
  const radius = 90;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; // Half circle
  const progress = (displayScore / 100) * circumference;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div
      className={`bg-card border border-border rounded-xl p-6 ${glow} transition-shadow duration-500`}
    >
      <div className="flex flex-col items-center">
        {/* Gauge */}
        <div className="relative">
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Background arc */}
            <path
              d="M 10 110 A 90 90 0 0 1 190 110"
              fill="none"
              stroke="#1E293B"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 110 A 90 90 0 0 1 190 110"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              style={{
                transition: "stroke-dasharray 1s ease-out, stroke 0.5s ease",
                filter: `drop-shadow(0 0 8px ${color})`,
              }}
            />
            {/* Score markers */}
            {[0, 30, 60, 80, 100].map((marker, i) => {
              const angle = (marker / 100) * 180;
              const rad = (angle * Math.PI) / 180;
              const x = 100 - Math.cos(rad) * (normalizedRadius + 15);
              const y = 110 - Math.sin(rad) * (normalizedRadius + 15);
              return (
                <text
                  key={marker}
                  x={x}
                  y={y}
                  fontSize="10"
                  fill="#64748B"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {marker}
                </text>
              );
            })}
          </svg>

          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span
              className="text-5xl font-bold transition-colors duration-500"
              style={{ color }}
            >
              {displayScore}
            </span>
          </div>
        </div>

        {/* Status label */}
        <div
          className="mt-4 px-6 py-2 rounded-full text-lg font-bold transition-all duration-500"
          style={{
            backgroundColor: `${color}20`,
            color,
            boxShadow: `0 0 20px ${color}40`,
          }}
        >
          {status}
        </div>

        {/* Last updated */}
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {formatTime(lastUpdated)}
        </p>
      </div>
    </div>
  );
}
