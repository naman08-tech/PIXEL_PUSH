'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { AgentDecision } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DecisionLogProps {
  decisions: AgentDecision[];
}

const agentColors: Record<string, string> = {
  'Vitals Monitor Agent': '#00F5FF',
  'Risk Assessment Agent': '#FFB800',
  'Emergency Response Agent': '#FF4444',
};

export function DecisionLog({ decisions }: DecisionLogProps) {
  return (
    <div className="bg-[#111827] rounded-xl border border-[#374151] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#374151]">
        <h3 className="text-lg font-semibold text-white">Agent Decision Log</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
          </div>
          <span className="text-xs text-[#00FF88] font-medium">Live</span>
        </div>
      </div>

      {/* Log Entries */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {decisions.length === 0 ? (
            <p className="text-sm text-[#9CA3AF] text-center py-8">
              No decisions logged yet...
            </p>
          ) : (
            decisions.map((decision, index) => (
              <div
                key={decision.id}
                className={cn(
                  'p-3 rounded-lg bg-[#0D1320] border border-[#374151] transition-all duration-300',
                  index === 0 && 'animate-slide-in-top'
                )}
              >
                {/* Timestamp and Agent */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-[#9CA3AF]">
                    {decision.timestamp}
                  </span>
                  <span className="text-[#374151]">|</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${agentColors[decision.agentName]}20`,
                      color: agentColors[decision.agentName],
                    }}
                  >
                    {decision.agentName}
                  </span>
                </div>

                {/* Decision */}
                <p className="text-sm text-white mb-2">{decision.decision}</p>

                {/* Triggers */}
                {decision.triggers.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    <span className="text-xs text-[#9CA3AF]">Triggers:</span>
                    {decision.triggers.map((trigger, i) => (
                      <span
                        key={i}
                        className="text-xs px-1.5 py-0.5 rounded bg-[#1F2937] text-[#00F5FF]"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                )}

                {/* Confidence and Action */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">
                    Confidence: <span className="text-[#00FF88]">{decision.confidence}%</span>
                  </span>
                  <span className="text-[#FFB800]">{decision.action}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
