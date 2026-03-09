'use client';

import { CalculationRecord } from '@/types';

interface CalculationHistoryProps {
  history: CalculationRecord[];
  onSelect: (record: CalculationRecord) => void;
  loading: boolean;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function CalculationHistory({
  history,
  onSelect,
  loading,
}: CalculationHistoryProps) {
  return (
    <div
      style={{
        background: '#1a1a24',
        borderRadius: '20px',
        padding: '1rem',
        border: '1px solid #2a2a3d',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #2a2a3d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#7c6af5',
              boxShadow: '0 0 8px rgba(124, 106, 245, 0.8)',
            }}
          />
          <span
            style={{
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            History
          </span>
        </div>
        <span
          style={{
            background: '#252535',
            color: '#a0a0b8',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '999px',
            border: '1px solid #2a2a3d',
          }}
        >
          {history.length} calcs
        </span>
      </div>

      {/* Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          scrollbarWidth: 'thin',
          scrollbarColor: '#7c6af5 transparent',
        }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: '#6b6b88',
              fontSize: '0.875rem',
            }}
          >
            Loading...
          </div>
        ) : history.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: '#6b6b88',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🧮</span>
            <span style={{ fontSize: '0.8rem' }}>No calculations yet</span>
          </div>
        ) : (
          history.map((record) => (
            <button
              key={record.id}
              onClick={() => onSelect(record)}
              style={{
                background: '#1e1e2a',
                border: '1px solid #2a2a3d',
                borderRadius: '12px',
                padding: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                animation: 'fadeIn 0.3s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#252535';
                e.currentTarget.style.borderColor = '#7c6af5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1e1e2a';
                e.currentTarget.style.borderColor = '#2a2a3d';
              }}
            >
              <div
                style={{
                  color: '#a0a0b8',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                }}
              >
                {record.expression}
              </div>
              <div
                style={{
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                = {record.result}
              </div>
              <div
                style={{
                  color: '#6b6b88',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>🕐</span>
                {timeAgo(record.createdAt)}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
