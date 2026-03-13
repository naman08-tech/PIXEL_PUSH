'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Phone, 
  Calendar, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, ActionTriggered } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ActionsPanelProps {
  alerts: Alert[];
  actions: ActionTriggered[];
  onDismissAlert: (id: string) => void;
}

const actionIcons: Record<string, React.ElementType> = {
  call: Phone,
  appointment: Calendar,
  sms: MessageSquare,
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Completed: { bg: 'rgba(0, 255, 136, 0.2)', text: '#00FF88' },
  Pending: { bg: 'rgba(255, 184, 0, 0.2)', text: '#FFB800' },
  Failed: { bg: 'rgba(255, 68, 68, 0.2)', text: '#FF4444' },
};

export function ActionsPanel({ alerts, actions, onDismissAlert }: ActionsPanelProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Active Alerts Card */}
      <div className="bg-[#111827] rounded-xl border border-[#374151] flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#374151]">
          <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
          <span className="text-xs text-[#9CA3AF]">{alerts.length} active</span>
        </div>

        <ScrollArea className="flex-1 p-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#00FF88]/10 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-[#00FF88]" />
              </div>
              <p className="text-[#00FF88] font-medium">No Active Alerts</p>
              <p className="text-xs text-[#9CA3AF] mt-1">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-3 rounded-lg border flex items-start gap-3',
                    alert.severity === 'critical'
                      ? 'bg-[#FF4444]/10 border-[#FF4444]/30'
                      : 'bg-[#FFB800]/10 border-[#FFB800]/30'
                  )}
                >
                  {alert.severity === 'critical' ? (
                    <AlertCircle className="w-5 h-5 text-[#FF4444] flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{alert.message}</p>
                    <span className="text-xs text-[#9CA3AF] font-mono">{alert.timestamp}</span>
                  </div>
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="p-1 rounded hover:bg-[#374151] transition-colors"
                  >
                    <X className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Actions Triggered Card */}
      <div className="bg-[#111827] rounded-xl border border-[#374151] flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#374151]">
          <h3 className="text-lg font-semibold text-white">Actions Triggered</h3>
          <span className="text-xs text-[#9CA3AF]">Last 3</span>
        </div>

        <ScrollArea className="flex-1 p-4">
          {actions.length === 0 ? (
            <p className="text-sm text-[#9CA3AF] text-center py-8">
              No actions triggered yet
            </p>
          ) : (
            <div className="space-y-3">
              {actions.slice(-3).reverse().map((action) => {
                const IconComponent = actionIcons[action.type] || Phone;
                const statusColor = statusColors[action.status];
                return (
                  <div
                    key={action.id}
                    className="p-3 rounded-lg bg-[#0D1320] border border-[#374151]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-[#00F5FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">{action.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-[#9CA3AF] font-mono">
                            {action.timestamp}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            {action.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
