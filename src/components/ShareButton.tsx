'use client';

import { useState } from 'react';

interface ShareButtonProps {
  expression: string;
  result: string;
}

export default function ShareButton({ expression, result }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleShare = async () => {
    if (!result || result === '0' || result === 'Error') return;

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'cc';
    const shareText = `🧮 ${appName}: ${expression} = ${result}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const getLabel = () => {
    if (copied) return '✓ Copied!';
    if (error) return '✗ Failed';
    return '↗ Share';
  };

  const getBg = () => {
    if (copied) return 'linear-gradient(135deg, #22c55e, #16a34a)';
    if (error) return 'linear-gradient(135deg, #ef4444, #dc2626)';
    return 'linear-gradient(135deg, #1e3a5f, #1a3050)';
  };

  return (
    <button
      onClick={handleShare}
      disabled={!result || result === '0'}
      style={{
        background: getBg(),
        color: copied ? '#ffffff' : error ? '#ffffff' : '#60a5fa',
        border: `1px solid ${copied ? '#22c55e' : error ? '#ef4444' : '#1e40af'}`,
        borderRadius: '8px',
        padding: '0.4rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: result && result !== '0' ? 'pointer' : 'not-allowed',
        opacity: result && result !== '0' ? 1 : 0.5,
        transition: 'all 0.2s ease',
        letterSpacing: '0.5px',
      }}
    >
      {getLabel()}
    </button>
  );
}
