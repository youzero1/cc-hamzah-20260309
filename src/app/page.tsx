'use client';

import { useState, useCallback } from 'react';
import Calculator from '@/components/Calculator';
import SharedCalculations from '@/components/SharedCalculations';

export default function Home() {
  const [feedKey, setFeedKey] = useState(0);

  const handleShare = useCallback(() => {
    setFeedKey(prev => prev + 1);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">⊕</div>
          cc
        </div>
        <div className="app-tagline">Social Calculator — share your math</div>
        <div style={{ width: 80 }} />
      </header>

      <main className="main-layout">
        <section className="calculator-section">
          <Calculator onShare={handleShare} />
        </section>

        <section className="feed-section">
          <SharedCalculations key={feedKey} />
        </section>
      </main>
    </div>
  );
}
