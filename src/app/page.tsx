import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      {/* Header / Brand */}
      <header className="w-full max-w-md mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-black text-lg">cc</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl leading-none">cc</h1>
            <p className="text-violet-300 text-xs mt-0.5">calculator</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 bg-white/5 rounded-full px-3 py-1 border border-white/10">
            v1.0
          </span>
        </div>
      </header>

      {/* Calculator Component */}
      <Calculator />

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-white/20 text-xs">
          Built with ❤️ · cc calculator
        </p>
      </footer>
    </main>
  );
}
