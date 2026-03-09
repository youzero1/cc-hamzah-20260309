'use client';

import { CalcButton } from '@/types';

interface ButtonProps {
  button: CalcButton;
  onClick: (value: string) => void;
}

export default function Button({ button, onClick }: ButtonProps) {
  const classNames = [
    'calc-button',
    button.type,
    button.span ? `span-${button.span}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={() => onClick(button.value)}
      aria-label={button.label}
    >
      {button.label}
    </button>
  );
}
