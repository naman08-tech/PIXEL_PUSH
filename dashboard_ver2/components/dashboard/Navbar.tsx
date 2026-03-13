'use client';

import { useState, useEffect } from 'react';
import { Heart, Settings, Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus } from '@/lib/types';

interface NavbarProps {
  connectionStatus: ConnectionStatus;
}

export function Navbar({ connectionStatus }: NavbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1320] border-b border-[#374151] z-50 px-6">
      <div className="h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Heart className="w-8 h-8 text-[#00F5FF]" fill="#00F5FF" />
            <div className="absolute inset-0 animate-pulse-glow">
              <Heart className="w-8 h-8 text-[#00F5FF] opacity-50" fill="#00F5FF" />
            </div>
          </div>
          <span className="text-xl font-bold text-white">
            Vital<span className="text-[#00F5FF]">Guard</span>
          </span>
        </div>

        {/* Center: Patient Info */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF]">Patient:</span>
            <span className="text-white font-semibold">John Doe</span>
          </div>
          <div className="h-4 w-px bg-[#374151]" />
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF]">Age:</span>
            <span className="text-white">45</span>
          </div>
          <div className="h-4 w-px bg-[#374151]" />
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF]">ID:</span>
            <span className="text-[#00F5FF] font-mono">#PX-2024-001</span>
          </div>
        </div>

        {/* Right: Clock, Status, Settings */}
        <div className="flex items-center gap-6">
          {/* Clock */}
          <div className="text-right">
            <div className="text-white font-mono text-lg">{formatTime(currentTime)}</div>
            <div className="text-[#9CA3AF] text-xs">{formatDate(currentTime)}</div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {connectionStatus.connected ? (
              <>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-[#00FF88]" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00FF88] animate-ping opacity-75" />
                </div>
                <Wifi className="w-5 h-5 text-[#00FF88]" />
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-[#FF4444]" />
                <WifiOff className="w-5 h-5 text-[#FF4444]" />
              </>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-[#1F2937] transition-colors">
            <Settings className="w-5 h-5 text-[#9CA3AF] hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
}
