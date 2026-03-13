"use client";

import {
  Heart,
  Droplets,
  Thermometer,
  Gauge,
  Activity,
  PersonStanding,
} from "lucide-react";
import { VitalCard } from "./VitalCard";

interface VitalsData {
  heartRate: { value: number; history: number[] };
  spO2: { value: number; history: number[] };
  temperature: { value: number; history: number[] };
  bloodPressure: { systolic: number; diastolic: number; history: number[] };
  hrv: { value: number; history: number[] };
  activity: { current: string; timeline: { state: string; time: string }[] };
}

interface VitalsGridProps {
  vitals: VitalsData;
}

function getHeartRateStatus(value: number) {
  if (value >= 60 && value <= 100) return "normal";
  if (value >= 50 && value <= 120) return "warning";
  return "critical";
}

function getSpO2Status(value: number) {
  if (value >= 95) return "normal";
  if (value >= 90) return "warning";
  return "critical";
}

function getTempStatus(value: number) {
  if (value >= 36.1 && value <= 37.2) return "normal";
  if (value >= 35.5 && value <= 38.5) return "warning";
  return "critical";
}

function getBPStatus(systolic: number, diastolic: number) {
  if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80)
    return "normal";
  if (systolic >= 80 && systolic <= 140 && diastolic >= 50 && diastolic <= 90)
    return "warning";
  return "critical";
}

function getHRVStatus(value: number) {
  if (value >= 20 && value <= 100) return "normal";
  if (value >= 10 && value <= 120) return "warning";
  return "critical";
}

function getActivityStatus(activity: string) {
  return "normal";
}

export function VitalsGrid({ vitals }: VitalsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Heart Rate */}
      <VitalCard
        icon={<Heart className="w-5 h-5" />}
        name="Heart Rate"
        value={vitals.heartRate.value}
        unit="BPM"
        status={getHeartRateStatus(vitals.heartRate.value)}
        normalRange="60-100 BPM"
        history={vitals.heartRate.history}
      />

      {/* Blood Oxygen */}
      <VitalCard
        icon={<Droplets className="w-5 h-5" />}
        name="Blood Oxygen (SpO2)"
        value={vitals.spO2.value}
        unit="%"
        status={getSpO2Status(vitals.spO2.value)}
        normalRange="95-100%"
        history={vitals.spO2.history}
      />

      {/* Body Temperature */}
      <VitalCard
        icon={<Thermometer className="w-5 h-5" />}
        name="Body Temperature"
        value={vitals.temperature.value.toFixed(1)}
        unit="°C"
        status={getTempStatus(vitals.temperature.value)}
        normalRange="36.1-37.2°C"
        history={vitals.temperature.history}
      />

      {/* Blood Pressure */}
      <VitalCard
        icon={<Gauge className="w-5 h-5" />}
        name="Blood Pressure"
        value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
        unit="mmHg"
        status={getBPStatus(
          vitals.bloodPressure.systolic,
          vitals.bloodPressure.diastolic
        )}
        normalRange="90/60 - 120/80 mmHg"
        history={vitals.bloodPressure.history}
      />

      {/* HRV */}
      <VitalCard
        icon={<Activity className="w-5 h-5" />}
        name="HRV (Heart Rate Variability)"
        value={vitals.hrv.value}
        unit="ms"
        status={getHRVStatus(vitals.hrv.value)}
        normalRange="20-100ms"
        history={vitals.hrv.history}
      />

      {/* Activity Status */}
      <VitalCard
        icon={<PersonStanding className="w-5 h-5" />}
        name="Activity Status"
        value={vitals.activity.current}
        unit=""
        status={getActivityStatus(vitals.activity.current)}
        normalRange="Varies"
        history={[]}
        isActivity
        activityTimeline={vitals.activity.timeline}
      />
    </div>
  );
}
