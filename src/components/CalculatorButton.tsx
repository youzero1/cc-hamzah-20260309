'use client';

import { MouseEvent } from 'react';

type ButtonVariant = 'number' | 'operator' | 'action' | 'equals' | 'zero';

interface CalculatorButtonProps {
  label: string;
  onClick: (value: string) => void;
  variant?: ButtonVariant;
  colSpan?: number;
}

const variantClasses: Record<ButtonVariant, string> = {
  number:
    'bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/10 hover:border-white/20',
  operator:
    'bg-violet-500/20 hover:bg-violet-500/35 active:bg-violet-500/45 text-violet-300 border border-violet-500/30 hover:border-violet-400/50',
  action:
    'bg-pink-500/20 hover:bg-pink-500/35 active:bg-pink-500/45 text-pink-300 border border-pink-500/30 hover:border-pink-400/50',
  equals:
    'bg-gradient-to-br from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 active:from-violet-600 active:to-pink-600 text-white border-0 shadow-lg shadow-violet-500/30',
  zero:
    'bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/10 hover:border-white/20',
};

export default function CalculatorButton({
  label,
  onClick,
  variant = 'number',
  colSpan,
}: CalculatorButtonProps) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick(label);
  };

  const colClass = colSpan === 2 ? 'col-span-2' : '';

  return (
    <button
      onClick={handleClick}
      className={`calculator-btn ${
        variantClasses[variant]
      } ${colClass} rounded-2xl font-semibold text-lg h-14 flex items-center justify-center cursor-pointer select-none transition-all duration-150 hover:shadow-md`}
    >
      {label}
    </button>
  );
}
