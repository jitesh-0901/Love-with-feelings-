import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { logAnalyticsEvent, updateSessionSummary } from '../utils/analyticsTracker';

interface FinalEmotionalSummaryProps {
  onReplay?: () => void;
  isReducedMotion: boolean;
}

export const FinalEmotionalSummary: React.FC<FinalEmotionalSummaryProps> = ({
  onReplay: _onReplay,
  isReducedMotion,
}) => {
  useEffect(() => {
    updateSessionSummary({ status: 'Completed Entire Story ❤️' });
    logAnalyticsEvent('✨ Reached Final Page', 'Completed Entire Story ❤️');

    if (isReducedMotion) return;

    // Gentle celebratory rose petal confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#d9255a', '#f43f6e', '#fbbf24', '#fda4af', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 45,
        origin: { x: 0.1 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: 0.9 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isReducedMotion]);

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto z-20 text-center select-none">
      
      {/* 1. ADORABLE HUGGING HEARTS & SPARKS - CREATIVE MILD ANIMATION */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative my-4 flex flex-col items-center justify-center"
      >
        {/* Soft Dreamy Ambient Aura (No image, pure dreamy light) */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-sky-400/20 via-rose-500/25 to-velvetRose-500/20 blur-3xl -z-10 animate-pulse-gentle" />

        {/* Floating Dancing Hearts Animation */}
        <div className="flex items-center justify-center gap-3 my-2">
          {/* Cyan Blue Heart (Me) */}
          <motion.div
            animate={{
              rotate: [0, 10, -5, 0],
              x: [0, 4, 0],
              y: [0, -4, 0],
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            className="text-4xl sm:text-5xl drop-shadow-md select-none"
          >
            💙
          </motion.div>

          {/* Sparkling Union Star */}
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-2xl sm:text-3xl text-amber-500 drop-shadow select-none"
          >
            ✨
          </motion.div>

          {/* Velvet Rose Heart (Ovi ma) */}
          <motion.div
            animate={{
              rotate: [0, -10, 5, 0],
              x: [0, -4, 0],
              y: [0, -4, 0],
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            className="text-4xl sm:text-5xl drop-shadow-md select-none"
          >
            💖
          </motion.div>
        </div>

        {/* Creative Mild Sub-text Animation: "Sorry... You are mine, always." */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex items-center justify-center gap-2 mt-2"
        >
          <Sparkles size={14} className="text-amber-500 animate-spin-slow" />
          <span className="font-serif italic text-velvetRose-600 font-bold text-sm sm:text-base tracking-wider">
            Sorry... You are mine always.
          </span>
          <Heart size={13} className="text-velvetRose-600 fill-velvetRose-600 inline" />
        </motion.div>
      </motion.div>

      {/* 2. OVI MA - Glowing Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-3 mb-2"
      >
        <h1 className="text-4xl sm:text-5xl font-cinzel font-black tracking-[0.2em] text-velvetRose-700 drop-shadow-[0_2px_10px_rgba(217,37,90,0.18)]">
          OVI MA
        </h1>
      </motion.div>

      {/* 3. THE SINCERE WORDS REQUESTED BY USER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
        className="my-4 space-y-3 px-2 max-w-md mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-serif font-black text-roseDark-950 tracking-wide leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          &ldquo;Ovi ma enna manshuru dii .... Namma sernthu valthu namma life aa happyy aa pathuakalam maa , I&apos;m always for you only ❤️&rdquo;
        </h2>

        <p className="text-xs sm:text-sm font-serif italic text-roseDark-800 font-semibold tracking-wide">
          Forever yours, always with you.
        </p>
      </motion.div>
    </div>
  );
};

export default FinalEmotionalSummary;
