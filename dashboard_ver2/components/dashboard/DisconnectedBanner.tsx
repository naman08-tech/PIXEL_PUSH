'use client';

import { WifiOff } from 'lucide-react';

export function DisconnectedBanner() {
  return (
    <div className="fixed top-16 left-0 right-0 bg-[#FF4444] text-white text-center py-2 z-40 flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Backend Disconnected - Attempting to reconnect...</span>
    </div>
  );
}
