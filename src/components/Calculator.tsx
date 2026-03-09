'use client';

import { useState, useEffect, useCallback } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';
import CalculationHistory from './CalculationHistory';
import ShareButton from './ShareButton';
import { evaluate } from '@/lib/calculator';

type ButtonDef = {
  label: string;
  variant: 'number' | 'operator' | 'action' | 'equals' | 'zero';
  value?: string;
  colSpan?: number;
};

const BUTTONS: ButtonDef[] = [
  { label: 'AC', variant: 'action', value: 'clear' },
  { label: '⌫', variant: 'action', value: 'backspace' },
  { label: '%', variant: 'operator', value: '%' },
  { label: '÷', variant: 'operator', value: '/' },

  { label: '7', variant: 'number' },
  { label: '8', variant: 'number' },
  { label: '9', variant: 'number' },
  { label: '×', variant: 'operator', value: '*' },

  { label: '4', variant: 'number' },
  { label: '5', variant: 'number' },
  { label: '6', variant: 'number' },
  { label: '−', variant: 'operator', value: '-' },

  { label: '1', variant: 'number' },
  { label: '2', variant: 'number' },
  { label: '3', variant: 'number' },
  { label: '+', variant: 'operator' },

  { label: '0', variant: 'zero', colSpan: 2 },
  { label: '.', variant: 'number' },
  { label: '=', variant: 'equals', value: 'equals' },
];

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [hasResult, setHasResult] = useState(false);
  const [lastResult, setLastResult] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [lastSaved, setLastSaved] = useState<{ expression: string; result: string } | null>(null);

  const saveCalculation = useCallback(
    async (expr: string, result: string) => {
      try {
        await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expression: expr, result }),
        });
        setLastSaved({ expression: expr, result });
        setHistoryRefresh((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to save calculation:', err);
      }
    },
    []
  );

  const handleButton = useCallback(
    (value: string) => {
      const operators = ['+', '-', '*', '/'];

      if (value === 'clear') {
        setExpression('');
        setDisplay('0');
        setHasResult(false);
        setLastResult('');
        setLastSaved(null);
        return;
      }

      if (value === 'backspace') {
        if (hasResult) {
          setExpression('');
          setDisplay('0');
          setHasResult(false);
          return;
        }
        const newExpr = expression.slice(0, -1);
        setExpression(newExpr);
        setDisplay(newExpr || '0');
        return;
      }

      if (value === 'equals') {
        if (!expression) return;
        const result = evaluate(expression);
        setDisplay(result);
        if (result !== 'Error') {
          setLastResult(result);
          setHasResult(true);
          saveCalculation(expression, result);
        } else {
          setHasResult(false);
        }
        return;
      }

      // Handle operators
      if (operators.includes(value) || value === '%') {
        if (hasResult && lastResult) {
          // Continue from result
          const newExpr = lastResult + value;
          setExpression(newExpr);
          setDisplay(newExpr);
          setHasResult(false);
          return;
        }
        if (!expression) return;
        // Replace trailing operator
        const lastChar = expression[expression.length - 1];
        if (operators.includes(lastChar)) {
          const newExpr = expression.slice(0, -1) + value;
          setExpression(newExpr);
          setDisplay(newExpr);
          return;
        }
        const newExpr = expression + value;
        setExpression(newExpr);
        setDisplay(newExpr);
        return;
      }

      // Handle decimal
      if (value === '.') {
        if (hasResult) {
          setExpression('0.');
          setDisplay('0.');
          setHasResult(false);
          return;
        }
        // Find the last number segment
        const parts = expression.split(/[+\-*/%]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
        const newExpr = expression + '.';
        setExpression(newExpr);
        setDisplay(newExpr);
        return;
      }

      // Handle digits
      if (hasResult) {
        // Start fresh with new number
        setExpression(value);
        setDisplay(value);
        setHasResult(false);
        return;
      }

      const newExpr = expression === '0' ? value : expression + value;
      setExpression(newExpr);
      setDisplay(newExpr);
    },
    [expression, hasResult, lastResult, saveCalculation]
  );

  // Keyboard support
  useEffect(() => {
    const keyMap: Record<string, string> = {
      '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
      '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
      '+': '+', '-': '-', '*': '*', '/': '/',
      '.': '.', '%': '%',
      'Enter': 'equals', '=': 'equals',
      'Backspace': 'backspace',
      'Escape': 'clear', 'c': 'clear', 'C': 'clear',
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        handleButton(mapped);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButton]);

  const handleHistorySelect = (expr: string, result: string) => {
    setExpression(expr);
    setDisplay(result);
    setLastResult(result);
    setHasResult(true);
    setHistoryOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-md">
        {/* Calculator Card */}
        <div className="glass-card rounded-3xl p-4 shadow-2xl shadow-black/50">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>

            {hasResult && lastSaved && (
              <div className="animate-fade-in">
                <ShareButton
                  expression={lastSaved.expression}
                  result={lastSaved.result}
                />
              </div>
            )}
          </div>

          {/* Display */}
          <CalculatorDisplay
            expression={expression}
            display={display}
            hasResult={hasResult}
          />

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {BUTTONS.map((btn) => (
              <CalculatorButton
                key={btn.label}
                label={btn.label}
                onClick={() => handleButton(btn.value ?? btn.label)}
                variant={btn.variant}
                colSpan={btn.colSpan}
              />
            ))}
          </div>

          {/* Bottom: keyboard hint */}
          <p className="text-center text-white/15 text-xs mt-4">
            ⌨️ Keyboard shortcuts supported
          </p>
        </div>

        {/* Social proof / stats bar */}
        <div className="mt-3 glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {['from-violet-400 to-pink-400', 'from-blue-400 to-cyan-400', 'from-orange-400 to-yellow-400'].map((grad, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${grad} border-2 border-black/30`}
                />
              ))}
            </div>
            <span className="text-white/40 text-xs">cc users calculating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white/30 text-xs">Live</span>
          </div>
        </div>
      </div>

      {/* History Panel */}
      <CalculationHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        refreshTrigger={historyRefresh}
        onSelectItem={handleHistorySelect}
      />
    </>
  );
}
