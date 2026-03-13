'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  HeartPulse, 
  Droplets, 
  Thermometer, 
  Gauge, 
  Activity,
  PersonStanding 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { VitalStatus, ActivityEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VitalCardProps {
  type: 'heartRate' | 'bloodOxygen' | 'temperature' | 'bloodPressure' | 'hrv' | 'activity';
  value: number | string;
  secondaryValue?: number;
  unit: string;
  history?: number[];
  activityHistory?: ActivityEntry[];
}

const vitalConfig = {
  heartRate: {
    icon: HeartPulse,
    name: 'Heart Rate',
    normalRange: '60-100 BPM',
    getStatus: (value: number): VitalStatus => {
      if (value >= 60 && value <= 100) return 'Normal';
      if ((value > 100 && value <= 120) || (value >= 50 && value < 60)) return 'Warning';
      return 'Critical';
    },
  },
  bloodOxygen: {
    icon: Droplets,
    name: 'Blood Oxygen (SpO2)',
    normalRange: '95-100%',
    getStatus: (value: number): VitalStatus => {
      if (value >= 95) return 'Normal';
      if (value >= 90 && value < 95) return 'Warning';
      return 'Critical';
    },
  },
  temperature: {
    icon: Thermometer,
    name: 'Body Temperature',
    normalRange: '36.1-37.2°C',
    getStatus: (value: number): VitalStatus => {
      if (value >= 36.1 && value <= 37.2) return 'Normal';
      if ((value > 37.2 && value <= 38.9) || (value >= 35 && value < 36.1)) return 'Warning';
      return 'Critical';
    },
  },
  bloodPressure: {
    icon: Gauge,
    name: 'Blood Pressure',
    normalRange: '90/60 - 120/80 mmHg',
    getStatus: (systolic: number, diastolic: number): VitalStatus => {
      if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80) return 'Normal';
      if (systolic > 180 || diastolic > 120) return 'Critical';
      return 'Warning';
    },
  },
  hrv: {
    icon: Activity,
    name: 'HRV',
    normalRange: '20-100ms',
    getStatus: (value: number): VitalStatus => {
      if (value >= 20 && value <= 100) return 'Normal';
      if (value >= 10 && value < 20) return 'Warning';
      return 'Critical';
    },
  },
  activity: {
    icon: PersonStanding,
    name: 'Activity Status',
    normalRange: 'Current activity',
    getStatus: (): VitalStatus => 'Normal',
  },
};

const statusColors = {
  Normal: { border: '#00FF88', bg: 'rgba(0, 255, 136, 0.05)', text: '#00FF88' },
  Warning: { border: '#FFB800', bg: 'rgba(255, 184, 0, 0.05)', text: '#FFB800' },
  Critical: { border: '#FF4444', bg: 'rgba(255, 68, 68, 0.05)', text: '#FF4444' },
};

const activityColors: Record<string, string> = {
  Resting: '#00F5FF',
  Walking: '#00FF88',
  Running: '#FFB800',
  Sleeping: '#9CA3AF',
};

export function VitalCard({
  type,
  value,
  secondaryValue,
  unit,
  history = [],
  activityHistory = [],
}: VitalCardProps) {
  const [animating, setAnimating] = useState(false);
  const prevValue = useRef(value);
  const config = vitalConfig[type];
  const IconComponent = config.icon;

  // Determine status
  let status: VitalStatus;
  if (type === 'bloodPressure' && secondaryValue !== undefined) {
    status = vitalConfig.bloodPressure.getStatus(value as number, secondaryValue);
  } else if (type === 'activity') {
    status = 'Normal';
  } else {
    status = (config.getStatus as (v: number) => VitalStatus)(value as number);
  }

  const colors = statusColors[status];

  // Trigger animation on value change
  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 300);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Format chart data
  const chartData = history.map((v, i) => ({ index: i, value: v }));

  // Display value
  const displayValue = type === 'bloodPressure' && secondaryValue !== undefined
    ? `${value}/${secondaryValue}`
    : type === 'temperature'
    ? (value as number).toFixed(1)
    : value;

  return (
    <div
      className={cn(
        'relative bg-[#111827] rounded-xl p-4 border-l-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
        animating && 'animate-value-pulse'
      )}
      style={{
        borderLeftColor: colors.border,
        backgroundColor: colors.bg,
        boxShadow: `0 0 20px ${colors.border}15`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className="w-5 h-5" style={{ color: colors.border }} />
          <h3 className="text-sm font-medium text-[#9CA3AF]">{config.name}</h3>
        </div>
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium'
          )}
          style={{
            backgroundColor: `${colors.border}20`,
            color: colors.text,
          }}
        >
          {status}
        </span>
      </div>

      {/* Value */}
      <div className="text-center mb-3">
        <span
          className={cn(
            'text-4xl font-bold transition-all duration-300',
            animating && 'scale-105'
          )}
          style={{ color: colors.text }}
        >
          {displayValue}
        </span>
        <span className="text-lg text-[#9CA3AF] ml-2">{unit}</span>
      </div>

      {/* Chart or Activity Timeline */}
      {type === 'activity' ? (
        <div className="space-y-1.5">
          {activityHistory.slice(-5).reverse().map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activityColors[entry.status] }}
                />
                <span style={{ color: activityColors[entry.status] }}>{entry.status}</span>
              </div>
              <span className="text-[#9CA3AF] font-mono">{entry.timestamp}</span>
            </div>
          ))}
          {activityHistory.length === 0 && (
            <p className="text-xs text-[#9CA3AF] text-center py-2">No activity data</p>
          )}
        </div>
      ) : (
        <div className="h-12">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.border}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-xs text-[#9CA3AF]">Waiting for data...</span>
            </div>
          )}
        </div>
      )}

      {/* Normal Range */}
      <div className="mt-3 pt-3 border-t border-[#374151]">
        <p className="text-xs text-[#9CA3AF]">
          Normal: <span className="text-[#00FF88]">{config.normalRange}</span>
        </p>
      </div>
    </div>
  );
}
