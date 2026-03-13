'use client';

import { Heart, Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-6">
          <Heart className="w-16 h-16 text-[#00F5FF] mx-auto" fill="#00F5FF" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-16 h-16 text-[#00F5FF] animate-ping opacity-30" fill="#00F5FF" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Vital<span className="text-[#00F5FF]">Guard</span>
        </h1>

        {/* Loading Status */}
        <div className="flex items-center justify-center gap-2 text-[#9CA3AF]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Connecting to backend...</span>
        </div>

        {/* Connection Info */}
        <p className="text-xs text-[#9CA3AF] mt-4">
          Establishing secure connection to monitoring servers
        </p>
      </div>
    </div>
  );
}
