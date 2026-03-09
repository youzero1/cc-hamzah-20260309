'use client';

import { formatExpression } from '@/lib/calculator';

interface CalculatorDisplayProps {
  expression: string;
  display: string;
  hasResult: boolean;
}

export default function CalculatorDisplay({
  expression,
  display,
  hasResult,
}: CalculatorDisplayProps) {
  const fontSize =
    display.length > 12
      ? 'text-2xl'
      : display.length > 9
      ? 'text-3xl'
      : display.length > 6
      ? 'text-4xl'
      : 'text-5xl';

  return (
    <div className="glass-card rounded-2xl p-5 mb-3">
      {/* Expression line */}
      <div className="min-h-[24px] mb-2">
        <p className="text-right text-white/40 text-sm font-mono truncate">
          {expression ? formatExpression(expression) : '\u00A0'}
        </p>
      </div>

      {/* Main display */}
      <div className="flex items-end justify-end gap-2">
        <p
          className={`text-right font-bold font-mono text-white transition-all duration-150 break-all leading-none ${
            fontSize
          } ${hasResult ? 'text-violet-200' : 'text-white'}`}
        >
          {display || '0'}
        </p>
      </div>

      {/* Subtle indicator dots */}
      <div className="flex gap-1 mt-3 justify-end">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500/60"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-pink-500/40"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
      </div>
    </div>
  );
}
