import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, XCircle, ArrowRight } from 'lucide-react';
import { logAnalyticsEvent, updateSessionSummary } from '../utils/analyticsTracker';
import { sound } from '../utils/soundEffects';

interface ForgivenessSceneProps {
  onSelectForgiveness: (choice: 'YES, I FORGIVE YOU' | 'NO') => void;
  savedChoice: 'YES, I FORGIVE YOU' | 'NO' | 'I NEED MORE TIME' | null;
  onNext: () => void;
  isReducedMotion: boolean;
}

export const ForgivenessScene: React.FC<ForgivenessSceneProps> = ({
  onSelectForgiveness,
  savedChoice,
  onNext,
  isReducedMotion: _isReducedMotion,
}) => {
  const [selected, setSelected] = useState<'YES, I FORGIVE YOU' | 'NO' | null>(
    savedChoice === 'I NEED MORE TIME' ? 'NO' : (savedChoice as 'YES, I FORGIVE YOU' | 'NO' | null)
  );

  const handleChoice = (choice: 'YES, I FORGIVE YOU' | 'NO') => {
    setSelected(choice);
    onSelectForgiveness(choice);
    updateSessionSummary({ forgiveness: choice });
    logAnalyticsEvent('🌹 Forgiveness Decision', choice);
    sound.playChime(choice === 'YES, I FORGIVE YOU' ? 1046.5 : 550, 0.6);
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto z-20 text-center">
      
      {/* Header */}

      {/* Stylized Artistic Vector Illustration: Man kneeling respectfully offering a red rose to Ovi ma */}
      <div className="relative w-64 h-56 sm:w-72 sm:h-64 mx-auto my-2 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-rosePetal-200/50 blur-2xl -z-10" />

        <svg
          viewBox="0 0 300 240"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="roseMan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d9255a" />
              <stop offset="100%" stopColor="#880e4f" />
            </linearGradient>
            <linearGradient id="roseGirl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffccd8" />
            </linearGradient>
            <linearGradient id="freshRedRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>

          {/* Ground shadow plane */}
          <ellipse cx="150" cy="220" rx="120" ry="12" fill="#ffccd8" opacity="0.6" />

          {/* GIRL FIGURE (Ovi ma - standing gracefully) */}
          <g transform="translate(190, 75)">
            <circle cx="20" cy="20" r="14" fill="#ffccd8" />
            <path d="M 12 18 Q 0 45, 10 70 Q 20 50, 22 30 Z" fill="#2e0c22" />
            <path d="M 10 35 Q 20 60, 24 85 L 35 140 Q 20 145, 0 140 L 8 85 Q 12 55, 10 35 Z" fill="url(#roseGirl)" stroke="#f43f6e" strokeWidth="1.5" />
            <path d="M 8 55 Q 0 70, 4 80" stroke="#f43f6e" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>

          {/* YOUNG MAN FIGURE (Kneeling down respectfully offering a red rose) */}
          <g transform="translate(45, 95)">
            <circle cx="55" cy="20" r="14" fill="#ffccd8" />
            <path d="M 45 35 Q 40 65, 35 90 L 60 90 Q 60 65, 55 35 Z" fill="url(#roseMan)" />
            <path d="M 35 90 L 10 120 L 5 125 L 30 125 Z" fill="#1a0512" />
            <path d="M 50 90 L 70 115 L 75 125 L 60 125 Z" fill="#2e0c22" />
            <path d="M 50 48 Q 75 52, 95 45" stroke="#f43f6e" strokeWidth="5" strokeLinecap="round" fill="none" />
            
            {/* Blooming Fresh Red Rose in Hand */}
            <g transform="translate(95, 36)">
              <path d="M 0 12 Q 10 10, 15 2" stroke="#2d6a4f" strokeWidth="3" fill="none" />
              <circle cx="15" cy="2" r="8" fill="url(#freshRedRose)" />
              <circle cx="15" cy="2" r="3.5" fill="#fda4af" />
            </g>
          </g>

          <circle cx="160" cy="90" r="2.5" fill="#e11d48" opacity="0.6" className="animate-pulse" />
          <circle cx="140" cy="130" r="2" fill="#fda4af" opacity="0.8" />
          <circle cx="210" cy="50" r="2.5" fill="#e11d48" opacity="0.7" />
          <circle cx="80" cy="70" r="2" fill="#fda4af" opacity="0.5" />
        </svg>
      </div>

      {/* Sincere Speech Dialogue with High Contrast Dark Typography */}
      <div className="w-full rose-card p-5 sm:p-6 my-2 text-center">
        <h3 className="text-xl sm:text-2xl font-serif font-black text-roseDark-950 mb-2">
          &ldquo;Ovi ma… can you forgive me?&rdquo;
        </h3>

        <p className="text-xs sm:text-sm font-serif italic text-roseDark-800 leading-relaxed mb-1 font-bold">
          &ldquo;I know one sorry cannot fix everything. But I hope one day I can earn back your smile and trust.&rdquo;
        </p>

        <p className="text-[11px] text-roseDark-600 font-semibold mt-2">
          Whatever you choose is completely accepted with love and zero guilt.
        </p>
      </div>

      {/* Two Fixed, Permanent, Non-Dodging Buttons: YES / NO */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {/* Button 1: YES */}
        <button
          onClick={() => handleChoice('YES, I FORGIVE YOU')}
          className={`p-4 rounded-2xl flex items-center justify-center gap-2.5 font-cinzel font-black text-xs sm:text-sm tracking-wider transition-all duration-300 border-2 shadow-md ${
            selected === 'YES, I FORGIVE YOU'
              ? 'bg-roseLeaf-600 text-white border-roseLeaf-600 shadow-[0_6px_20px_rgba(45,106,79,0.4)] scale-[1.02]'
              : 'bg-white hover:bg-roseLeaf-100 text-roseLeaf-700 border-roseLeaf-500'
          }`}
        >
          <Flower2 size={18} className={selected === 'YES, I FORGIVE YOU' ? 'text-white' : 'text-roseLeaf-600'} />
          <span>YES, I FORGIVE YOU</span>
        </button>

        {/* Button 2: NO (as specifically requested in 3rd upload) */}
        <button
          onClick={() => handleChoice('NO')}
          className={`p-4 rounded-2xl flex items-center justify-center gap-2.5 font-cinzel font-black text-xs sm:text-sm tracking-wider transition-all duration-300 border-2 shadow-md ${
            selected === 'NO'
              ? 'bg-velvetRose-600 text-white border-velvetRose-600 shadow-[0_6px_20px_rgba(217,37,90,0.4)] scale-[1.02]'
              : 'bg-white hover:bg-rosePetal-100 text-velvetRose-700 border-velvetRose-500'
          }`}
        >
          <XCircle size={18} className={selected === 'NO' ? 'text-white' : 'text-velvetRose-600'} />
          <span>NO</span>
        </button>
      </div>

      {/* Gentle Message after selection */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rose-card p-4 text-center my-2 border-2 border-velvetRose-300"
          >
            {selected === 'YES, I FORGIVE YOU' ? (
              <p className="text-xs sm:text-sm font-serif italic text-roseDark-950 font-bold">
                &ldquo;Thank you, Ovi ma. Your forgiveness is the most precious gift. I will honor this second chance with all my heart.&rdquo;
              </p>
            ) : (
              <p className="text-xs sm:text-sm font-serif italic text-roseDark-950 font-bold leading-relaxed">
                &ldquo;Puriyudhu Ovi ma... I completely understand and respect your decision. En mela unakku irukura kovam nyayamaana onnu. Zero pressure, zero guilt. Un happiness and peace dhaan enakku eppovum mukkiyam.&rdquo;
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue to Questions */}
      <div className="w-full flex justify-center mt-3">
        <button
          onClick={() => {
            sound.playChime(880, 0.4);
            onNext();
          }}
          className="w-full sm:w-auto px-7 py-3 rounded-full rose-btn-primary font-cinzel text-xs sm:text-sm tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <span>ANSWER A FEW GENTLE QUESTIONS</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
