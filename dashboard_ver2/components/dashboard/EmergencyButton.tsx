'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyButtonProps {
  isCritical: boolean;
  onTrigger: () => void;
}

export function EmergencyButton({ isCritical, onTrigger }: EmergencyButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-[#1F2937] border border-[#374151] rounded-lg text-sm text-white whitespace-nowrap animate-fade-in">
          Manually trigger emergency protocol
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#374151]" />
        </div>
      )}

      {/* Button */}
      <button
        onClick={onTrigger}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'w-16 h-16 rounded-full bg-[#FF4444] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl',
          isCritical && 'animate-critical-pulse'
        )}
        style={{
          boxShadow: isCritical
            ? '0 0 30px rgba(255, 68, 68, 0.6)'
            : '0 0 20px rgba(255, 68, 68, 0.3)',
        }}
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </button>
    </div>
  );
}
