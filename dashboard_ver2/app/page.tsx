'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { RiskScoreGauge } from '@/components/dashboard/RiskScoreGauge';
import { VitalsGrid } from '@/components/dashboard/VitalsGrid';
import { DecisionLog } from '@/components/dashboard/DecisionLog';
import { ActionsPanel } from '@/components/dashboard/ActionsPanel';
import { EmergencyButton } from '@/components/dashboard/EmergencyButton';
import { StatusBar } from '@/components/dashboard/StatusBar';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { DisconnectedBanner } from '@/components/dashboard/DisconnectedBanner';
import {
  VitalsData,
  RiskScore,
  AgentDecision,
  Alert,
  ActionTriggered,
  ActivityEntry,
  AgentStatus,
  ConnectionStatus,
} from '@/lib/types';
import { cn } from '@/lib/utils';

// Initial placeholder data
const initialVitals: VitalsData = {
  heartRate: 72,
  bloodOxygen: 98,
  respiratoryRate: 16,
  temperature: 36.8,
  bloodPressure: { systolic: 118, diastolic: 76 },
  hrv: 45,
  bloodGlucose: 95,
  stressLevel: 22,
  activityStatus: 'Resting',
  timestamp: new Date().toISOString(),
};

const initialRiskScore: RiskScore = {
  score: 24,
  status: 'SAFE',
  lastUpdated: new Date().toLocaleTimeString(),
};

const initialAgents: AgentStatus[] = [
  { name: 'Vitals Monitor Agent', active: true },
  { name: 'Risk Assessment Agent', active: true },
  { name: 'Emergency Response Agent', active: true },
];

const initialDecisions: AgentDecision[] = [
  {
    id: '1',
    timestamp: '02:14:33',
    agentName: 'Risk Assessment Agent',
    decision: 'Elevated risk pattern detected',
    triggers: ['HR(118)', 'SpO2(93%)', 'HRV(12ms)'],
    confidence: 84,
    action: 'Escalating to Emergency Agent',
  },
  {
    id: '2',
    timestamp: '02:14:28',
    agentName: 'Vitals Monitor Agent',
    decision: 'Anomaly logged',
    triggers: ['SpO2 dropped 4% in 90s'],
    confidence: 91,
    action: 'Flagged for assessment',
  },
  {
    id: '3',
    timestamp: '02:13:55',
    agentName: 'Vitals Monitor Agent',
    decision: 'All vitals within normal range',
    triggers: [],
    confidence: 98,
    action: 'Logged only',
  },
];

export default function Dashboard() {
  // Connection state
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    lastSync: '--:--:--',
  });

  // Vitals state
  const [vitals, setVitals] = useState<VitalsData>(initialVitals);
  const [vitalsHistory, setVitalsHistory] = useState({
    heartRate: [] as number[],
    bloodOxygen: [] as number[],
    temperature: [] as number[],
    respiratoryRate: [] as number[],
    bloodGlucose: [] as number[],
    stressLevel: [] as number[],
    systolic: [] as number[],
    diastolic: [] as number[],
    hrv: [] as number[],
  });
  const [activityHistory, setActivityHistory] = useState<ActivityEntry[]>([
    { status: 'Sleeping', timestamp: '01:30:00' },
    { status: 'Resting', timestamp: '06:45:00' },
    { status: 'Walking', timestamp: '07:15:00' },
    { status: 'Resting', timestamp: '08:00:00' },
  ]);

  // Risk score state
  const [riskScore, setRiskScore] = useState<RiskScore>(initialRiskScore);

  // Agents state
  const [agents] = useState<AgentStatus[]>(initialAgents);

  // Decision log state
  const [decisions, setDecisions] = useState<AgentDecision[]>(initialDecisions);

  // Alerts and actions state
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [actions, setActions] = useState<ActionTriggered[]>([
    {
      id: '1',
      type: 'sms',
      description: 'SMS sent to emergency contact',
      timestamp: '02:10:15',
      status: 'Completed',
    },
    {
      id: '2',
      type: 'appointment',
      description: 'Follow-up appointment scheduled',
      timestamp: '02:08:00',
      status: 'Completed',
    },
  ]);

  // System stats
  const [uptime, setUptime] = useState('00:00:00');
  const [totalReadings, setTotalReadings] = useState(0);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  // Format uptime
  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate initial connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setConnectionStatus({
        connected: true,
        lastSync: new Date().toLocaleTimeString(),
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Uptime counter
  useEffect(() => {
    if (!isLoading && connectionStatus.connected) {
      const interval = setInterval(() => {
        setUptimeSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoading, connectionStatus.connected]);

  useEffect(() => {
    setUptime(formatUptime(uptimeSeconds));
  }, [uptimeSeconds]);

  // Update vitals history helper
  const updateVitalsHistory = useCallback((newVitals: VitalsData) => {
    setVitalsHistory((prev) => ({
      heartRate: [...prev.heartRate.slice(-19), newVitals.heartRate],
      bloodOxygen: [...prev.bloodOxygen.slice(-19), newVitals.bloodOxygen],
      temperature: [...prev.temperature.slice(-19), newVitals.temperature],
      respiratoryRate: [...prev.respiratoryRate.slice(-19), newVitals.respiratoryRate],
      bloodGlucose: [...prev.bloodGlucose.slice(-19), newVitals.bloodGlucose],
      stressLevel: [...prev.stressLevel.slice(-19), newVitals.stressLevel],
      systolic: [...prev.systolic.slice(-19), newVitals.bloodPressure.systolic],
      diastolic: [...prev.diastolic.slice(-19), newVitals.bloodPressure.diastolic],
      hrv: [...prev.hrv.slice(-19), newVitals.hrv],
    }));
    setTotalReadings((prev) => prev + 1);
  }, []);

  // Update activity history helper
  const updateActivityHistory = useCallback((newActivity: VitalsData['activityStatus']) => {
    setActivityHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.status === newActivity) return prev;
      return [
        ...prev.slice(-4),
        { status: newActivity, timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) },
      ];
    });
  }, []);

  // Handle receiving vitals data (to be called when data arrives from props/backend)
  const handleVitalsUpdate = useCallback((newVitals: VitalsData) => {
    setVitals(newVitals);
    updateVitalsHistory(newVitals);
    updateActivityHistory(newVitals.activityStatus);
    setConnectionStatus((prev) => ({
      ...prev,
      lastSync: new Date().toLocaleTimeString(),
    }));
  }, [updateVitalsHistory, updateActivityHistory]);

  // Handle receiving risk score update
  const handleRiskScoreUpdate = useCallback((newScore: RiskScore) => {
    setRiskScore({
      ...newScore,
      lastUpdated: new Date().toLocaleTimeString(),
    });
  }, []);

  // Handle receiving new decision
  const handleNewDecision = useCallback((newDecision: AgentDecision) => {
    setDecisions((prev) => [newDecision, ...prev.slice(0, 49)]);
  }, []);

  // Handle dismissing alert
  const handleDismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Handle emergency trigger
  const handleEmergencyTrigger = useCallback(() => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      severity: 'critical',
      message: 'Manual emergency protocol triggered by operator',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const newAction: ActionTriggered = {
      id: Date.now().toString(),
      type: 'call',
      description: 'Emergency call initiated to medical team',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      status: 'Pending',
    };
    setActions((prev) => [...prev, newAction]);

    const newDecision: AgentDecision = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      agentName: 'Emergency Response Agent',
      decision: 'Manual emergency override activated',
      triggers: ['Operator Override'],
      confidence: 100,
      action: 'Initiating emergency response protocol',
    };
    handleNewDecision(newDecision);
  }, [handleNewDecision]);

  // Determine if system is in critical state
  const isCritical = riskScore.score > 80;

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-[#0A0F1E] transition-all duration-300',
        isCritical && 'border-4 border-[#FF4444] animate-critical-pulse'
      )}
    >
      {/* Navbar */}
      <Navbar connectionStatus={connectionStatus} />

      {/* Disconnected Banner */}
      {!connectionStatus.connected && <DisconnectedBanner />}

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 pb-8 px-6 transition-all duration-300',
          !connectionStatus.connected && 'pt-24'
        )}
      >
        <div className="max-w-7xl mx-auto space-y-6 py-6">
          {/* Risk Score Card */}
          <RiskScoreGauge riskScore={riskScore} />

          {/* Vitals Grid */}
          <VitalsGrid
            vitals={vitals}
            vitalsHistory={vitalsHistory}
            activityHistory={activityHistory}
          />

          {/* Bottom Section - Decision Log & Actions Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: '400px' }}>
            {/* Decision Log - 60% */}
            <div className="lg:col-span-3">
              <DecisionLog decisions={decisions} />
            </div>

            {/* Actions Panel - 40% */}
            <div className="lg:col-span-2">
              <ActionsPanel
                alerts={alerts}
                actions={actions}
                onDismissAlert={handleDismissAlert}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Emergency Button */}
      <EmergencyButton isCritical={isCritical} onTrigger={handleEmergencyTrigger} />

      {/* Status Bar */}
      <StatusBar
        uptime={uptime}
        totalReadings={totalReadings}
        lastSync={connectionStatus.lastSync}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}
