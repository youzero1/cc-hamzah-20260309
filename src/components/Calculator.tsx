'use client';

import { useState, useEffect, useCallback } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';
import CalculationHistory from './CalculationHistory';
import ShareButton from './ShareButton';
import { CalculationRecord } from '@/types';

type ButtonVariant = 'default' | 'operator' | 'equals' | 'function' | 'zero';

interface ButtonConfig {
  label: string;
  action: string;
  variant: ButtonVariant;
  span?: number;
}

const BUTTONS: ButtonConfig[] = [
  { label: 'AC', action: 'clear', variant: 'function' },
  { label: '±', action: 'negate', variant: 'function' },
  { label: '%', action: 'percent', variant: 'function' },
  { label: '÷', action: '/', variant: 'operator' },
  { label: '7', action: '7', variant: 'default' },
  { label: '8', action: '8', variant: 'default' },
  { label: '9', action: '9', variant: 'default' },
  { label: '×', action: '*', variant: 'operator' },
  { label: '4', action: '4', variant: 'default' },
  { label: '5', action: '5', variant: 'default' },
  { label: '6', action: '6', variant: 'default' },
  { label: '-', action: '-', variant: 'operator' },
  { label: '1', action: '1', variant: 'default' },
  { label: '2', action: '2', variant: 'default' },
  { label: '3', action: '3', variant: 'default' },
  { label: '+', action: '+', variant: 'operator' },
  { label: '⌫', action: 'backspace', variant: 'function' },
  { label: '0', action: '0', variant: 'default' },
  { label: '.', action: '.', variant: 'default' },
  { label: '=', action: '=', variant: 'equals' },
];

function evaluate(expr: string): string {
  try {
    // Replace display operators with JS operators
    const cleaned = expr.replace(/×/g, '*').replace(/÷/g, '/');
    // Basic safety check
    if (!/^[0-9+\-*/.\s()%]+$/.test(cleaned)) {
      return 'Error';
    }
    // Check for division by zero
    if (/\/\s*0(?![.0-9])/.test(cleaned)) {
      return 'Error: ÷0';
    }
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + cleaned + ')')();
    if (!isFinite(result)) return 'Error';
    // Format result
    const rounded = Math.round(result * 1e10) / 1e10;
    return String(rounded);
  } catch {
    return 'Error';
  }
}

export default function Calculator() {
  const [current, setCurrent] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [lastExpression, setLastExpression] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const saveCalculation = async (expr: string, result: string) => {
    try {
      await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, result }),
      });
      await fetchHistory();
    } catch (err) {
      console.error('Failed to save calculation:', err);
    }
  };

  const handleAction = useCallback(
    (action: string) => {
      // Digits
      if (/^[0-9]$/.test(action)) {
        if (waitingForOperand) {
          setCurrent(action);
          setWaitingForOperand(false);
        } else {
          setCurrent((prev) =>
            prev === '0' ? action : prev.length >= 16 ? prev : prev + action
          );
        }
        return;
      }

      // Decimal
      if (action === '.') {
        if (waitingForOperand) {
          setCurrent('0.');
          setWaitingForOperand(false);
          return;
        }
        if (!current.includes('.')) {
          setCurrent((prev) => prev + '.');
        }
        return;
      }

      // Operators
      if (['+', '-', '*', '/'].includes(action)) {
        const opDisplay = action === '*' ? '×' : action === '/' ? '÷' : action;
        if (expression && !waitingForOperand) {
          // Chain operation: evaluate first
          const fullExpr = expression + ' ' + current;
          const result = evaluate(fullExpr);
          if (!result.startsWith('Error')) {
            setExpression(result + ' ' + opDisplay);
            setCurrent(result);
          } else {
            setExpression(current + ' ' + opDisplay);
          }
        } else {
          setExpression(current + ' ' + opDisplay);
        }
        setWaitingForOperand(true);
        return;
      }

      // Equals
      if (action === '=') {
        if (!expression) return;
        const fullExpr = expression + ' ' + current;
        const result = evaluate(fullExpr);
        setLastExpression(fullExpr);
        setCurrent(result);
        setExpression('');
        setWaitingForOperand(true);
        if (!result.startsWith('Error')) {
          saveCalculation(fullExpr, result);
        }
        return;
      }

      // Clear
      if (action === 'clear') {
        setCurrent('0');
        setExpression('');
        setWaitingForOperand(false);
        setLastExpression('');
        return;
      }

      // Backspace
      if (action === 'backspace') {
        if (waitingForOperand) return;
        setCurrent((prev) => {
          if (prev.length <= 1 || prev === 'Error') return '0';
          return prev.slice(0, -1);
        });
        return;
      }

      // Negate
      if (action === 'negate') {
        setCurrent((prev) => {
          if (prev === '0') return '0';
          return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
        });
        return;
      }

      // Percent
      if (action === 'percent') {
        setCurrent((prev) => {
          const num = parseFloat(prev);
          if (isNaN(num)) return prev;
          return String(num / 100);
        });
        return;
      }
    },
    [current, expression, waitingForOperand]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        handleAction(key);
      } else if (key === '.') {
        handleAction('.');
      } else if (key === '+') {
        handleAction('+');
      } else if (key === '-') {
        handleAction('-');
      } else if (key === '*') {
        handleAction('*');
      } else if (key === '/') {
        e.preventDefault();
        handleAction('/');
      } else if (key === 'Enter' || key === '=') {
        handleAction('=');
      } else if (key === 'Backspace') {
        handleAction('backspace');
      } else if (key === 'Escape') {
        handleAction('clear');
      } else if (key === '%') {
        handleAction('percent');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction]);

  const handleHistorySelect = (record: CalculationRecord) => {
    setCurrent(record.result);
    setExpression('');
    setWaitingForOperand(true);
  };

  const hasError = current.startsWith('Error');

  const displayExpression = expression
    ? expression
    : lastExpression
    ? lastExpression
    : '';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '1.5rem',
        alignItems: 'start',
      }}
      className="calc-grid"
    >
      <style>{`
        @media (max-width: 700px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
          .history-panel {
            max-height: 300px !important;
          }
        }
      `}</style>

      {/* Calculator Panel */}
      <div
        style={{
          background: '#1a1a24',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid #2a2a3d',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <ShareButton expression={displayExpression} result={current} />
        </div>

        <CalculatorDisplay
          expression={displayExpression}
          current={current}
          hasError={hasError}
        />

        {/* Button Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
          }}
        >
          {BUTTONS.map((btn) => (
            <CalculatorButton
              key={btn.action + btn.label}
              label={btn.label}
              onClick={() => handleAction(btn.action)}
              variant={btn.variant}
              span={btn.span}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <div
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: '#6b6b88',
            fontSize: '0.7rem',
          }}
        >
          ⌨️ Keyboard supported
        </div>
      </div>

      {/* History Panel */}
      <div
        className="history-panel"
        style={{
          height: '520px',
        }}
      >
        <CalculationHistory
          history={history}
          onSelect={handleHistorySelect}
          loading={historyLoading}
        />
      </div>
    </div>
  );
}
