'use client';

import { useRef } from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'equals' | 'function' | 'zero';
  span?: number;
}

export default function CalculatorButton({
  label,
  onClick,
  variant = 'default',
  span = 1,
}: CalculatorButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      gridColumn: span > 1 ? `span ${span}` : undefined,
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.125rem',
      fontWeight: '500',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
      outline: 'none',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    };

    switch (variant) {
      case 'equals':
        return {
          ...base,
          background: 'linear-gradient(135deg, #7c6af5, #5b4fe0)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(124, 106, 245, 0.4)',
        };
      case 'operator':
        return {
          ...base,
          background: 'linear-gradient(135deg, #2a1f3d, #1f1a2e)',
          color: '#a78bfa',
          border: '1px solid #3d2f60',
        };
      case 'function':
        return {
          ...base,
          background: '#1e1e2a',
          color: '#a0a0b8',
          border: '1px solid #2a2a3d',
        };
      default:
        return {
          ...base,
          background: '#252535',
          color: '#ffffff',
          border: '1px solid #2a2a3d',
        };
    }
  };

  const handleClick = () => {
    if (btnRef.current) {
      btnRef.current.style.transform = 'scale(0.93)';
      setTimeout(() => {
        if (btnRef.current) {
          btnRef.current.style.transform = 'scale(1)';
        }
      }, 120);
    }
    onClick();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={getStyles()}
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        if (variant === 'equals') {
          target.style.filter = 'brightness(1.15)';
          target.style.boxShadow = '0 6px 20px rgba(124, 106, 245, 0.6)';
        } else {
          target.style.filter = 'brightness(1.1)';
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.filter = 'brightness(1)';
        if (variant === 'equals') {
          target.style.boxShadow = '0 4px 15px rgba(124, 106, 245, 0.4)';
        }
      }}
    >
      {label}
    </button>
  );
}
