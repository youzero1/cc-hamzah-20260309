'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalculationRecord } from '@/types';

function timeAgo(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const AVATARS = ['🦊', '🐺', '🦁', '🐯', '🦝', '🐸', '🦄', '🐙', '🦋', '🦜'];
const NAMES = [
  'MathWizard',
  'CalcPro',
  'NumberNinja',
  'AlgebraAce',
  'PiLover',
  'MatrixMind',
  'FractalFan',
  'PrimeSolver',
  'CurveTracer',
  'SetTheory',
];

function getAvatarForId(id: number) {
  return AVATARS[id % AVATARS.length];
}

function getNameForId(id: number) {
  return NAMES[id % NAMES.length];
}

export default function SharedCalculations() {
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const fetchShared = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        setCalculations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch shared calculations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShared();
  }, [fetchShared]);

  const handleLike = async (id: number) => {
    if (likedIds.has(id)) return;

    try {
      const res = await fetch(`/api/history/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLikedIds(prev => new Set([...prev, id]));
        setCalculations(prev =>
          prev.map(c => (c.id === id ? { ...c, likes: data.data.likes } : c))
        );
      }
    } catch (err) {
      console.error('Failed to like calculation:', err);
    }
  };

  return (
    <div>
      <div className="feed-header">
        <div>
          <div className="feed-title">📡 Community Feed</div>
          <div className="feed-subtitle">Shared calculations from the community</div>
        </div>
        <button className="feed-refresh" onClick={fetchShared}>
          <span>↻</span> Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : calculations.length === 0 ? (
        <div className="feed-empty">
          <div className="feed-empty-icon">🔢</div>
          <div className="feed-empty-title">No shared calculations yet</div>
          <div className="feed-empty-text">
            Be the first to share a calculation with the community!
          </div>
        </div>
      ) : (
        calculations.map((calc) => (
          <div key={calc.id} className="calculation-card">
            <div className="card-header">
              <div className="card-avatar">{getAvatarForId(calc.id)}</div>
              <div className="card-user-info">
                <div className="card-username">{getNameForId(calc.id)}</div>
                <div className="card-time">{timeAgo(calc.createdAt)}</div>
              </div>
              <div className="card-badge">✨ Shared</div>
            </div>

            <div className="card-expression">{calc.expression}</div>
            <div className="card-result">= {calc.result}</div>

            <div className="card-actions">
              <button
                className={`card-action-btn${likedIds.has(calc.id) ? ' liked' : ''}`}
                onClick={() => handleLike(calc.id)}
                disabled={likedIds.has(calc.id)}
              >
                <span>{likedIds.has(calc.id) ? '❤️' : '🤍'}</span>
                <span>{calc.likes} {calc.likes === 1 ? 'like' : 'likes'}</span>
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                🔢 #{calc.id}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
