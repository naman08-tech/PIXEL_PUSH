export interface VitalsData {
  heartRate: number;
  bloodOxygen: number;
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  hrv: number;
  activityStatus: 'Resting' | 'Walking' | 'Running' | 'Sleeping';
  timestamp: string;
}

export interface RiskScore {
  score: number;
  status: 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'CRITICAL';
  lastUpdated: string;
}

export interface AgentDecision {
  id: string;
  timestamp: string;
  agentName: 'Vitals Monitor Agent' | 'Risk Assessment Agent' | 'Emergency Response Agent';
  decision: string;
  triggers: string[];
  confidence: number;
  action: string;
}

export interface Alert {
  id: string;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: string;
}

export interface ActionTriggered {
  id: string;
  type: 'call' | 'appointment' | 'sms';
  description: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface ActivityEntry {
  status: 'Resting' | 'Walking' | 'Running' | 'Sleeping';
  timestamp: string;
}

export interface AgentStatus {
  name: string;
  active: boolean;
}

export type VitalStatus = 'Normal' | 'Warning' | 'Critical';

export interface ConnectionStatus {
  connected: boolean;
  lastSync: string;
}
