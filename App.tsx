
import React, { useState, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import RadarChart from './components/RadarChart';
import { calculateLoveAI } from './services/loveService';
import { LoveResult } from './types';

const STEPS = [
  "Awakening Cupid's Whispers...",
  "Consulting the FLAMES of Passion...",
  "Unlocking Numerological Secrets...",
  "Measuring Heartbeat Symmetry...",
  "Sealing Your Valentine's Fate..."
];

const App: React.FC = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<LoveResult | null>(null);
  const [error, setError] = useState('');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading) {
      const stepInterval = setInterval(() => {
        setLoadingStep(s => (s < STEPS.length - 1 ? s + 1 : s));
      }, 1000);
      return () => clearInterval(stepInterval);
    } else {
      setLoadingStep(0);
    }
  }, [loading]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      setError('Please enter both names for the Valentine magic to work!');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const loveData = await calculateLoveAI(name1, name2);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResult(loveData);
    } catch (err) {
      setError('The heavens are a bit crowded with hearts. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setName1('');
    setName2('');
    setResult(null);
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 85) return 'text-rose-600';
    if (pct >= 70) return 'text-pink-500';
    if (pct >= 50) return 'text-red-400';
    if (pct >= 30) return 'text-rose-300';
    return 'text-slate-400';
  };

  const getHeartEmoji = (pct: number) => {
    if (pct >= 85) return '💖';
    if (pct >= 70) return '❤️';
    if (pct >= 50) return '💌';
    if (pct >= 30) return '🌹';
    return '🥀';
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#fff1f2] overflow-y-auto">
      <FloatingHearts />
      
      <div className="w-full max-w-xl z-10 py-10">
        <header className="text-center mb-8">
          <h1 className={`text-6xl text-rose-600 font-love mb-2 transition-transform duration-1000 ${pulse ? 'scale-105' : 'scale-100'}`}>
            HeartBound
          </h1>
          <p className="text-rose-400 text-lg">Your Valentine's Destiny • Unveiled</p>
        </header>

        <main className="glass rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {!result && !loading && (
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="relative">
                  <label className="block text-rose-500 font-bold mb-2 ml-2 text-sm uppercase tracking-wider">First Heart</label>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Enter Name"
                    className="w-full bg-white/60 border-2 border-rose-100 focus:border-rose-400 rounded-2xl px-6 py-4 outline-none transition-all placeholder:text-rose-200 text-rose-700 font-bold text-lg"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-rose-500 font-bold mb-2 ml-2 text-sm uppercase tracking-wider">Second Heart</label>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Enter Name"
                    className="w-full bg-white/60 border-2 border-rose-100 focus:border-rose-400 rounded-2xl px-6 py-4 outline-none transition-all placeholder:text-rose-200 text-rose-700 font-bold text-lg"
                  />
                </div>

                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-0.5 z-20 items-center justify-center bg-white shadow-md rounded-full w-10 h-10 border border-rose-100">
                  <span className="text-rose-500 text-xl">🏹</span>
                </div>
              </div>

              {error && <p className="text-red-500 text-center font-bold animate-pulse">{error}</p>}

              <button
                type="submit"
                className="w-full py-5 rounded-2xl font-black text-2xl text-white shadow-xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 bg-[length:200%_auto] animate-gradient hover:scale-[1.02] transition-transform active:scale-95"
              >
                Discover Our Bond
              </button>
              <p className="text-center text-[10px] text-rose-300 uppercase tracking-widest font-bold">Valentine analysis based on true names, numerology, and the FLAMES of fate.</p>
            </form>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">💘</div>
              </div>
              <div className="text-center">
                <p className="text-rose-600 font-bold text-xl h-8">{STEPS[loadingStep]}</p>
                <div className="mt-4 flex gap-1 justify-center">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= loadingStep ? 'bg-rose-500' : 'bg-rose-100'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in zoom-in slide-in-from-bottom-4 duration-700">
              <div className="text-center relative">
                <div className={`text-9xl font-black ${getScoreColor(result.percentage)} drop-shadow-sm tracking-tighter`}>
                  {result.percentage}%
                </div>
                <div className="text-rose-400 font-bold uppercase tracking-[0.3em] -mt-2">
                  {getHeartEmoji(result.percentage)} Bound by Destiny
                </div>
              </div>

              <div className="bg-rose-50/50 rounded-3xl p-6 text-center border border-rose-100/50">
                <h2 className="text-2xl font-black text-rose-700 leading-tight mb-2">"{result.verdict}"</h2>
                <p className="text-rose-600 font-medium opacity-80 italic">{result.advice}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-2xl p-4 border border-rose-100 flex flex-col justify-between">
                  <h3 className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-4">Destiny Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-rose-400 font-semibold">The Flame:</span>
                      <span className="text-rose-600 font-bold bg-rose-100 px-3 py-1 rounded-full">{result.logicInsights.flames}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-rose-400 font-semibold">Numerology:</span>
                      <span className="text-rose-600 font-bold text-right pl-2">{result.logicInsights.numerologyMatch}</span>
                    </div>
                    <div className="pt-2 border-t border-rose-50">
                      <p className="text-rose-400 font-semibold text-xs mb-2">Coupled Essence:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.logicInsights.sharedTraits.map(trait => (
                          <span key={trait} className="bg-white px-2 py-1 rounded-lg text-[10px] text-rose-500 font-bold border border-rose-50 shadow-sm">{trait}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-2xl p-4 border border-rose-100 flex items-center justify-center">
                  <RadarChart factors={result.compatibilityFactors} />
                </div>
              </div>

              <button
                onClick={reset}
                className="w-full py-4 text-rose-400 hover:text-rose-600 font-black text-sm uppercase tracking-[0.2em] transition-colors"
              >
                ← Test Another Duo
              </button>
            </div>
          )}
        </main>

        <footer className="mt-8 text-center text-rose-300 text-xs font-bold uppercase tracking-widest">
          HeartBound v2.2 • Romantic Algorithms
        </footer>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
