'use client';

import { useEffect, useState, useCallback } from 'react';

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

interface CalculationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger: number;
  onSelectItem?: (expression: string, result: string) => void;
}

export default function CalculationHistory({
  isOpen,
  onClose,
  refreshTrigger,
  onSelectItem,
}: CalculationHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, refreshTrigger, fetchHistory]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 animate-slide-in">
        <div className="h-full glass-card border-l border-white/10 flex flex-col" style={{background: 'rgba(15, 10, 40, 0.95)'}}>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-none">History</h2>
                <p className="text-white/40 text-xs mt-0.5">{history.length} calculations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 history-scrollbar">
            {loading ? (
              <div className="flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 font-medium">No calculations yet</p>
                  <p className="text-white/20 text-sm mt-1">Your history will appear here</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem?.(item.expression, item.result)}
                    className="w-full text-left rounded-2xl p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white/50 text-xs font-mono truncate group-hover:text-white/70 transition-colors">
                          {item.expression}
                        </p>
                        <p className="text-white font-bold text-lg font-mono mt-1 truncate">
                          = {item.result}
                        </p>
                      </div>
                      <span className="text-white/20 text-xs shrink-0 mt-0.5">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <p className="text-center text-white/20 text-xs">Last 20 calculations</p>
          </div>
        </div>
      </div>
    </>
  );
}
