"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RiskScoreGauge } from "@/components/dashboard/RiskScoreGauge";
import { VitalsGrid } from "@/components/dashboard/VitalsGrid";
import { DecisionLog, LogEntry } from "@/components/dashboard/DecisionLog";
import { ActionsPanel, Alert, Action } from "@/components/dashboard/ActionsPanel";
import { EmergencyButton } from "@/components/dashboard/EmergencyButton";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

// Helper to generate random value within range
const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Generate initial vitals data
const generateInitialHistory = (base: number, variance: number, count = 20) =>
  Array.from({ length: count }, () =>
    base + (Math.random() - 0.5) * variance * 2
  );

const activities = ["Resting", "Walking", "Running", "Sleeping"];

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [startTime] = useState(Date.now());
  const [totalReadings, setTotalReadings] = useState(15847);
  const [lastSync, setLastSync] = useState(new Date());

  // Vitals state
  const [vitals, setVitals] = useState({
    heartRate: { value: 78, history: generateInitialHistory(78, 10) },
    spO2: { value: 97, history: generateInitialHistory(97, 2) },
    temperature: { value: 36.8, history: generateInitialHistory(36.8, 0.3) },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      history: generateInitialHistory(120, 10),
    },
    hrv: { value: 45, history: generateInitialHistory(45, 15) },
    activity: {
      current: "Resting",
      timeline: [
        { state: "Sleeping", time: "06:00" },
        { state: "Resting", time: "08:30" },
        { state: "Walking", time: "09:15" },
        { state: "Resting", time: "10:00" },
        { state: "Resting", time: "Now" },
      ],
    },
  });

  // Risk score
  const [riskScore, setRiskScore] = useState(24);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Decision log entries
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "02:14:33",
      agent: "Risk",
      decision: "Elevated risk pattern detected",
      triggers: ["HR(118)", "SpO2(93%)", "HRV(12ms)"],
      confidence: 84,
      action: "Escalating to Emergency Agent",
    },
    {
      id: "2",
      timestamp: "02:14:28",
      agent: "Monitor",
      decision: "Anomaly logged",
      triggers: ["SpO2 dropped 4% in 90 seconds"],
      confidence: 91,
      action: "Flagged for assessment",
    },
    {
      id: "3",
      timestamp: "02:13:55",
      agent: "Monitor",
      decision: "All vitals within normal range",
      triggers: [],
      confidence: 98,
      action: "Logged only",
    },
  ]);

  // Alerts and actions
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [actions, setActions] = useState<Action[]>([
    {
      id: "1",
      type: "notification",
      description: "Sent vital summary to Dr. Smith",
      timestamp: "02:10:00",
      status: "completed",
    },
    {
      id: "2",
      type: "appointment",
      description: "Scheduled follow-up checkup",
      timestamp: "01:45:22",
      status: "completed",
    },
    {
      id: "3",
      type: "call",
      description: "Emergency contact notified",
      timestamp: "01:30:15",
      status: "pending",
    },
  ]);

  // Calculate uptime
  const getUptime = useCallback(() => {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [startTime]);

  const [uptime, setUptime] = useState(getUptime());

  // Check if system is in critical state
  const isCritical = riskScore >= 80;

  // Update vitals every 2 seconds
  useEffect(() => {
    const updateVitals = () => {
      setVitals((prev) => {
        const newHeartRate = Math.round(
          Math.max(50, Math.min(150, prev.heartRate.value + randomInRange(-5, 5)))
        );
        const newSpO2 = Math.round(
          Math.max(88, Math.min(100, prev.spO2.value + randomInRange(-1, 1)))
        );
        const newTemp = Math.max(
          35.5,
          Math.min(39.5, prev.temperature.value + randomInRange(-0.1, 0.1))
        );
        const newSystolic = Math.round(
          Math.max(85, Math.min(160, prev.bloodPressure.systolic + randomInRange(-3, 3)))
        );
        const newDiastolic = Math.round(
          Math.max(55, Math.min(100, prev.bloodPressure.diastolic + randomInRange(-2, 2)))
        );
        const newHRV = Math.round(
          Math.max(8, Math.min(120, prev.hrv.value + randomInRange(-5, 5)))
        );

        // Occasionally change activity
        let newActivity = prev.activity.current;
        if (Math.random() < 0.05) {
          newActivity = activities[Math.floor(Math.random() * activities.length)];
        }

        return {
          heartRate: {
            value: newHeartRate,
            history: [...prev.heartRate.history.slice(1), newHeartRate],
          },
          spO2: {
            value: newSpO2,
            history: [...prev.spO2.history.slice(1), newSpO2],
          },
          temperature: {
            value: newTemp,
            history: [...prev.temperature.history.slice(1), newTemp],
          },
          bloodPressure: {
            systolic: newSystolic,
            diastolic: newDiastolic,
            history: [...prev.bloodPressure.history.slice(1), newSystolic],
          },
          hrv: {
            value: newHRV,
            history: [...prev.hrv.history.slice(1), newHRV],
          },
          activity: {
            current: newActivity,
            timeline:
              newActivity !== prev.activity.current
                ? [
                    ...prev.activity.timeline.slice(1, 4),
                    { state: prev.activity.current, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) },
                    { state: newActivity, time: "Now" },
                  ]
                : prev.activity.timeline,
          },
        };
      });

      // Update risk score based on vitals
      setRiskScore((prev) => {
        const change = randomInRange(-5, 5);
        return Math.round(Math.max(0, Math.min(100, prev + change)));
      });

      setLastUpdated(new Date());
      setTotalReadings((prev) => prev + 1);
      setLastSync(new Date());
    };

    const vitalsTimer = setInterval(updateVitals, 2000);
    return () => clearInterval(vitalsTimer);
  }, []);

  // Update uptime every second
  useEffect(() => {
    const uptimeTimer = setInterval(() => {
      setUptime(getUptime());
    }, 1000);
    return () => clearInterval(uptimeTimer);
  }, [getUptime]);

  // Occasionally add log entries
  useEffect(() => {
    const logTimer = setInterval(() => {
      if (Math.random() < 0.3) {
        const agents: Array<"Monitor" | "Risk" | "Emergency"> = ["Monitor", "Risk", "Emergency"];
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const decisions = {
          Monitor: [
            "All vitals within normal range",
            "Minor fluctuation detected",
            "Heart rate stabilized",
          ],
          Risk: [
            "Risk level reassessed",
            "Pattern analysis complete",
            "Elevated risk pattern detected",
          ],
          Emergency: [
            "Emergency protocols on standby",
            "Alert threshold checked",
            "Response team notified",
          ],
        };

        const newEntry: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          agent,
          decision: decisions[agent][Math.floor(Math.random() * decisions[agent].length)],
          triggers:
            Math.random() > 0.5
              ? [`HR(${vitals.heartRate.value})`, `SpO2(${vitals.spO2.value}%)`]
              : [],
          confidence: Math.round(randomInRange(75, 99)),
          action: Math.random() > 0.5 ? "Logged only" : "Flagged for review",
        };

        setLogEntries((prev) => [newEntry, ...prev.slice(0, 19)]);
      }
    }, 5000);

    return () => clearInterval(logTimer);
  }, [vitals]);

  // Handle alert dismissal
  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Handle emergency button
  const handleEmergencyTrigger = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      severity: "critical",
      message: "Emergency protocol manually triggered",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    };
    setAlerts((prev) => [newAlert, ...prev]);

    const newAction: Action = {
      id: Date.now().toString(),
      type: "call",
      description: "Emergency services contacted",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      status: "pending",
    };
    setActions((prev) => [newAction, ...prev.slice(0, 2)]);

    const newLogEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      agent: "Emergency",
      decision: "Manual emergency override activated",
      triggers: ["User triggered"],
      confidence: 100,
      action: "Emergency protocol initiated",
    };
    setLogEntries((prev) => [newLogEntry, ...prev.slice(0, 19)]);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        isCritical && "animate-critical-pulse"
      )}
    >
      <Navbar />

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless menu is open */}
      <div
        className={cn(
          "hidden md:block",
          mobileMenuOpen && "!block"
        )}
      >
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content */}
      <main
        className={cn(
          "pt-20 pb-12 px-4 transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-[220px]"
        )}
      >
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Risk Score */}
          <RiskScoreGauge score={riskScore} lastUpdated={lastUpdated} />

          {/* Vitals Grid */}
          <VitalsGrid vitals={vitals} />

          {/* Bottom Section - Log and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Decision Log - 60% width */}
            <div className="lg:col-span-3 h-[400px]">
              <DecisionLog entries={logEntries} />
            </div>

            {/* Actions Panel - 40% width */}
            <div className="lg:col-span-2 h-[400px]">
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
        lastSync={lastSync}
        apiStatus="connected"
      />
    </div>
  );
}
