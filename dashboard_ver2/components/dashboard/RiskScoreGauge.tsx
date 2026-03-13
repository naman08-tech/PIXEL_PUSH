'use client';

import { useEffect, useState } from 'react';
import { RiskScore } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RiskScoreGaugeProps {
  riskScore: RiskScore;
}

function getStatusColor(status: RiskScore['status']) {
  switch (status) {
    case 'SAFE':
      return '#00FF88';
    case 'CAUTION':
      return '#FFB800';
    case 'HIGH RISK':
      return '#FF8C00';
    case 'CRITICAL':
      return '#FF4444';
    default:
      return '#00FF88';
  }
}

function getStatusFromScore(score: number): RiskScore['status'] {
  if (score <= 30) return 'SAFE';
  if (score <= 60) return 'CAUTION';
  if (score <= 80) return 'HIGH RISK';
  return 'CRITICAL';
}

export function RiskScoreGauge({ riskScore }: RiskScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const status = getStatusFromScore(riskScore.score);
  const color = getStatusColor(status);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(riskScore.score);
    }, 100);
    return () => clearTimeout(timer);
  }, [riskScore.score]);

  // Calculate arc path for semicircle gauge
  const radius = 120;
  const strokeWidth = 12;
  const centerX = 150;
  const centerY = 130;
  const startAngle = Math.PI;
  const endAngle = 0;
  const scoreAngle = startAngle - (displayScore / 100) * Math.PI;

  const describeArc = (startAng: number, endAng: number) => {
    const startX = centerX + radius * Math.cos(startAng);
    const startY = centerY - radius * Math.sin(startAng);
    const endX = centerX + radius * Math.cos(endAng);
    const endY = centerY - radius * Math.sin(endAng);
    const largeArcFlag = endAng - startAng <= Math.PI ? 0 : 1;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  return (
    <div
      className={cn(
        'bg-[#111827] rounded-xl p-6 border border-[#374151] transition-all duration-300',
        status === 'CRITICAL' && 'animate-critical-pulse border-[#FF4444]'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Patient Risk Score</h2>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-[#9CA3AF]">Live</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Gauge SVG */}
        <svg width="300" height="160" viewBox="0 0 300 160">
          {/* Background arc */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="#1F2937"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Colored progress arc */}
          <path
            d={describeArc(startAngle, scoreAngle)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />

          {/* Gradient segments indicators */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF88" />
              <stop offset="30%" stopColor="#FFB800" />
              <stop offset="60%" stopColor="#FF8C00" />
              <stop offset="100%" stopColor="#FF4444" />
            </linearGradient>
          </defs>

          {/* Score text */}
          <text
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            className="text-5xl font-bold"
            fill={color}
            style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}
          >
            {displayScore}
          </text>
          
          {/* Status text */}
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            className="text-lg font-semibold"
            fill={color}
          >
            {status}
          </text>

          {/* Scale labels */}
          <text x="35" y="135" fill="#9CA3AF" fontSize="12">0</text>
          <text x="85" y="55" fill="#9CA3AF" fontSize="12">25</text>
          <text x="145" y="25" fill="#9CA3AF" fontSize="12">50</text>
          <text x="205" y="55" fill="#9CA3AF" fontSize="12">75</text>
          <text x="255" y="135" fill="#9CA3AF" fontSize="12">100</text>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#00FF88]" />
            <span className="text-[#9CA3AF]">Safe (0-30)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
            <span className="text-[#9CA3AF]">Caution (31-60)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#FF8C00]" />
            <span className="text-[#9CA3AF]">High (61-80)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#FF4444]" />
            <span className="text-[#9CA3AF]">Critical (81-100)</span>
          </div>
        </div>

        {/* Last updated */}
        <p className="text-xs text-[#9CA3AF] mt-4">
          Last updated: {riskScore.lastUpdated}
        </p>
      </div>
    </div>
  );
}
