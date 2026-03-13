'use client';

import { Clock, Database, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus } from '@/lib/types';

interface StatusBarProps {
  uptime: string;
  totalReadings: number;
  lastSync: string;
  connectionStatus: ConnectionStatus;
}

export function StatusBar({ uptime, totalReadings, lastSync, connectionStatus }: StatusBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#0D1320] border-t border-[#374151] px-6 flex items-center justify-between text-xs text-[#9CA3AF] z-30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Uptime: <span className="text-[#00F5FF]">{uptime}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5" />
          <span>Total Readings: <span className="text-[#00FF88]">{totalReadings.toLocaleString()}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Last Sync: <span className="text-white">{lastSync}</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {connectionStatus.connected ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-[#00FF88]" />
            <span className="text-[#00FF88]">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-[#FF4444]" />
            <span className="text-[#FF4444]">Disconnected</span>
          </>
        )}
      </div>
    </div>
  );
}
