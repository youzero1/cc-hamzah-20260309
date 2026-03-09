'use client';

import { CalculationRecord } from '@/types';

interface CalculationHistoryProps {
  history: CalculationRecord[];
  onSelect: (calc: CalculationRecord) => void;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CalculationHistory({
  history,
  onSelect,
}: CalculationHistoryProps) {
  return (
    <div className="history-wrapper">
      <div className="history-title">Recent Calculations</div>
      {history.length === 0 ? (
        <div className="history-empty">No calculations yet</div>
      ) : (
        history.map((calc) => (
          <div
            key={calc.id}
            className="history-item"
            onClick={() => onSelect(calc)}
            title="Click to restore"
          >
            <div className="history-expression">
              {calc.expression} &middot; {timeAgo(calc.createdAt)}
            </div>
            <div className="history-result">= {calc.result}</div>
          </div>
        ))
      )}
    </div>
  );
}
