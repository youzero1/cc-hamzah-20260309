'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import CalculationHistory from './CalculationHistory';
import { CalcButton, CalculationRecord } from '@/types';

const BUTTONS: CalcButton[] = [
  { label: 'AC', value: 'AC', type: 'action' },
  { label: '±', value: '±', type: 'action' },
  { label: '%', value: '%', type: 'action' },
  { label: '÷', value: '/', type: 'operator' },

  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator' },

  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '-', type: 'operator' },

  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },

  { label: '0', value: '0', type: 'number', span: 2 },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'equals' },
];

const OPERATORS = ['+', '-', '*', '/'];

function evaluate(expression: string): string {
  try {
    // Replace display chars with real operators
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Check for division by zero
    if (/\/\s*0(?![.\d])/.test(sanitized)) {
      return 'Error: ÷0';
    }

    // Safe evaluation using Function
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + sanitized + ')')();

    if (typeof result !== 'number' || !isFinite(result)) {
      return 'Error';
    }

    // Format result: avoid excessive decimals
    const str = parseFloat(result.toFixed(10)).toString();
    return str;
  } catch {
    return 'Error';
  }
}

function isOperator(char: string): boolean {
  return OPERATORS.includes(char);
}

interface CalculatorProps {
  onShare: () => void;
}

export default function Calculator({ onShare }: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [isError, setIsError] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lastSavedId, setLastSavedId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/calculations');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data.slice(0, 10));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveCalculation = useCallback(
    async (expr: string, result: string) => {
      if (result.startsWith('Error')) return null;
      try {
        const res = await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression: expr, result }),
        });
        const data = await res.json();
        if (data.success) {
          setLastSavedId(data.data.id);
          loadHistory();
          return data.data.id;
        }
      } catch (err) {
        console.error('Failed to save calculation:', err);
      }
      return null;
    },
    [loadHistory]
  );

  const handleInput = useCallback(
    async (value: string) => {
      setIsError(false);

      if (value === 'AC') {
        setExpression('');
        setDisplay('0');
        setJustEvaluated(false);
        setLastSavedId(null);
        return;
      }

      if (value === '±') {
        if (display !== '0' && display !== 'Error') {
          const negated = display.startsWith('-')
            ? display.slice(1)
            : '-' + display;
          setDisplay(negated);
          // Update expression end number
          setExpression(prev => {
            const match = prev.match(/^(.*[+\-*/])?(-?[\d.]+)$/);
            if (match) {
              const prefix = match[1] || '';
              const num = match[2];
              const negNum = num.startsWith('-') ? num.slice(1) : '-' + num;
              return prefix + negNum;
            }
            return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
          });
        }
        return;
      }

      if (value === '%') {
        if (display !== '0' && !isError) {
          const pct = parseFloat(display) / 100;
          const pctStr = parseFloat(pct.toFixed(10)).toString();
          setDisplay(pctStr);
          setExpression(prev => {
            const match = prev.match(/^(.*[+\-*/])?(-?[\d.]+)$/);
            if (match) {
              const prefix = match[1] || '';
              return prefix + pctStr;
            }
            return pctStr;
          });
        }
        return;
      }

      if (value === '=') {
        if (!expression && display === '0') return;
        const expr = expression || display;
        const result = evaluate(expr);
        if (result.startsWith('Error')) {
          setDisplay(result);
          setIsError(true);
        } else {
          setDisplay(result);
          setExpression(expr);
          setJustEvaluated(true);
          await saveCalculation(expr, result);
        }
        return;
      }

      if (isOperator(value)) {
        const currentExpr = justEvaluated ? display : expression;
        // Remove trailing operator if any
        const base = currentExpr.replace(/[+\-*/]$/, '') || display;
        setExpression(base + value);
        setDisplay(value === '-' ? '-' : display);
        setJustEvaluated(false);
        return;
      }

      // Number or decimal
      if (justEvaluated) {
        // Start fresh after evaluation
        setExpression(value);
        setDisplay(value);
        setJustEvaluated(false);
        return;
      }

      // Handle decimal
      if (value === '.') {
        // Find the current number being entered
        const parts = expression.split(/[+\-*/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return; // Already has a decimal
        setExpression(prev => (prev === '' ? '0.' : prev + '.'));
        setDisplay(prev => (prev.includes('.') ? prev : prev + '.'));
        return;
      }

      // Normal digit
      const newExpr = expression + value;
      setExpression(newExpr);

      // Update display with current number
      const parts = newExpr.split(/(?<=[\d.])(?=[+\-*/])|(?<=[+\-*/])(?=[\d.-])/);
      const lastNum = parts[parts.length - 1];
      setDisplay(lastNum || value);
    },
    [expression, display, isError, justEvaluated, saveCalculation]
  );

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { key } = e;
      if (key >= '0' && key <= '9') handleInput(key);
      else if (key === '+') handleInput('+');
      else if (key === '-') handleInput('-');
      else if (key === '*') handleInput('*');
      else if (key === '/') { e.preventDefault(); handleInput('/'); }
      else if (key === '.') handleInput('.');
      else if (key === 'Enter' || key === '=') handleInput('=');
      else if (key === 'Escape') handleInput('AC');
      else if (key === 'Backspace') {
        setExpression(prev => {
          const next = prev.slice(0, -1);
          const parts = next.split(/(?<=[\d.])(?=[+\-*/])|(?<=[+\-*/])(?=[\d.-])/);
          const last = parts[parts.length - 1];
          setDisplay(last || '0');
          return next;
        });
      }
      else if (key === '%') handleInput('%');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleInput]);

  const handleShare = async () => {
    if (!lastSavedId) {
      showToast('Calculate something first!');
      return;
    }
    setSharing(true);
    try {
      const res = await fetch(`/api/calculations/${lastSavedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shared: true }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('🎉 Shared to the community feed!');
        onShare();
        setLastSavedId(null);
      } else {
        showToast('Failed to share. Try again.');
      }
    } catch (err) {
      console.error('Share error:', err);
      showToast('Failed to share. Try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleHistorySelect = (calc: CalculationRecord) => {
    setExpression(calc.expression);
    setDisplay(calc.result);
    setJustEvaluated(true);
    setIsError(false);
    setLastSavedId(calc.id);
  };

  return (
    <>
      <div className="calculator-wrapper">
        <div className="calculator-header">
          <span className="calculator-title">Calculator</span>
          <span className="keyboard-hint">⌨️ keyboard supported</span>
        </div>

        <Display
          expression={expression}
          result={display}
          isError={isError}
        />

        <div className="button-grid">
          {BUTTONS.map((btn) => (
            <Button key={btn.label} button={btn} onClick={handleInput} />
          ))}
        </div>

        <button
          className="share-button"
          onClick={handleShare}
          disabled={sharing || !lastSavedId}
        >
          {sharing ? '⏳ Sharing...' : '📡 Share to Community'}
        </button>
      </div>

      <CalculationHistory history={history} onSelect={handleHistorySelect} />

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
