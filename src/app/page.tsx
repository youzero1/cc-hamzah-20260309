import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #0f0f13 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #7c6af5, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}
          >
            {process.env.NEXT_PUBLIC_APP_NAME || 'cc'}
          </h1>
          <p
            style={{
              color: '#6b6b88',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Your smart calculator
          </p>
        </div>

        <Calculator />
      </div>
    </main>
  );
}
