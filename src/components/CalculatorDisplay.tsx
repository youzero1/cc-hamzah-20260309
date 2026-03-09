'use client';

interface CalculatorDisplayProps {
  expression: string;
  current: string;
  hasError: boolean;
}

export default function CalculatorDisplay({
  expression,
  current,
  hasError,
}: CalculatorDisplayProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #12121a, #1a1a28)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1rem',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        border: '1px solid #2a2a3d',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(124, 106, 245, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Expression line */}
      <div
        style={{
          color: '#6b6b88',
          fontSize: '0.875rem',
          marginBottom: '0.5rem',
          minHeight: '1.25rem',
          wordBreak: 'break-all',
          textAlign: 'right',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {expression || '\u00A0'}
      </div>

      {/* Main display */}
      <div
        style={{
          color: hasError ? '#f56a6a' : '#ffffff',
          fontSize: current.length > 12 ? '1.5rem' : current.length > 8 ? '2rem' : '2.5rem',
          fontWeight: '300',
          letterSpacing: '-1px',
          wordBreak: 'break-all',
          textAlign: 'right',
          maxWidth: '100%',
          lineHeight: '1.2',
          transition: 'font-size 0.1s ease',
        }}
      >
        {current || '0'}
      </div>
    </div>
  );
}
