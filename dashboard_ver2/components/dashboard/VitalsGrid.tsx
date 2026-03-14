'use client';

import { VitalCard } from './VitalCard';
import { VitalsData, ActivityEntry } from '@/lib/types';

interface VitalsGridProps {
  vitals: VitalsData;
  vitalsHistory: {
    heartRate: number[];
    bloodOxygen: number[];
    temperature: number[];
    respiratoryRate: number[];
    bloodGlucose: number[];
    stressLevel: number[];
    systolic: number[];
    diastolic: number[];
    hrv: number[];
  };
  activityHistory: ActivityEntry[];
}

export function VitalsGrid({ vitals, vitalsHistory, activityHistory }: VitalsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <VitalCard
        type="heartRate"
        value={vitals.heartRate}
        unit="BPM"
        history={vitalsHistory.heartRate}
      />
      <VitalCard
        type="bloodOxygen"
        value={vitals.bloodOxygen}
        unit="%"
        history={vitalsHistory.bloodOxygen}
      />
      <VitalCard
        type="temperature"
        value={vitals.temperature}
        unit="°C"
        history={vitalsHistory.temperature}
      />
      <VitalCard
        type="respiratoryRate"
        value={vitals.respiratoryRate}
        unit="bpm"
        history={vitalsHistory.respiratoryRate}
      />
      <VitalCard
        type="bloodGlucose"
        value={vitals.bloodGlucose}
        unit="mg/dL"
        history={vitalsHistory.bloodGlucose}
      />
      <VitalCard
        type="stressLevel"
        value={vitals.stressLevel}
        unit=""
        history={vitalsHistory.stressLevel}
      />
      <VitalCard
        type="bloodPressure"
        value={vitals.bloodPressure.systolic}
        secondaryValue={vitals.bloodPressure.diastolic}
        unit="mmHg"
        history={vitalsHistory.systolic}
      />
      <VitalCard
        type="hrv"
        value={vitals.hrv}
        unit="ms"
        history={vitalsHistory.hrv}
      />
      <VitalCard
        type="activity"
        value={vitals.activityStatus}
        unit=""
        activityHistory={activityHistory}
      />
    </div>
  );
}
