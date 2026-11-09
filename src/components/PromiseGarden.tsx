import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ear, ShieldCheck, HeartHandshake, Sparkles, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface PromiseGardenProps {
  onNext: () => void;
  isReducedMotion: boolean;
}

interface FlowerPromise {
  id: number;
  name: string;
  flowerType: string;
  tamilTitle: string;
  tagline: string;
  icon: typeof Ear;
  promiseTanglish: string;
  promiseEnglish: string;
}

const FLOWERS: FlowerPromise[] = [
  {
    id: 1,
    name: 'LISTEN',
    flowerType: 'White Jasmine (மல்லிகை)',
    tamilTitle: 'முழுசா கேட்பேன்',
    tagline: 'Hearing with an open heart',
    icon: Ear,
    promiseTanglish: 'Un pecha full-ah kekka try pannuven. Never interrupting, never arguing to defend myself.',
    promiseEnglish: 'I will listen with patient humility to understand you, never just to respond.',
  },
  {
    id: 2,
    name: 'RESPECT',
    flowerType: 'Velvet Red Rose (செந்ரோஜா)',
    tamilTitle: 'உன் சுதந்திரத்தை மதிப்பேன்',
    tagline: 'Your feelings & personal space',
    icon: ShieldCheck,
    promiseTanglish: 'Un feelings and personal space respect pannuven. Un comfort dhaan first priority.',
    promiseEnglish: 'I will honor your boundaries and emotions with genuine dignity and care.',
  },
  {
    id: 3,
    name: 'UNDERSTAND',
    flowerType: 'Pink Camellia (அரளி)',
    tamilTitle: 'கோபப்படாமல் புரிந்துகொள்வேன்',
    tagline: 'Empathy before reaction',
    icon: HeartHandshake,
    promiseTanglish: 'Kovathula react panradhukku badhila understand panna try pannuven. Choosing gentleness over ego.',
    promiseEnglish: 'Instead of impulsive reactions, I will pause and seek deep emotional understanding.',
  },
  {
    id: 4,
    name: 'IMPROVE',
    flowerType: 'Blooming Lotus (தாமரை)',
    tamilTitle: 'செயலில் காட்டுவேன்',
    tagline: 'Real change through actions',
    icon: Sparkles,
    promiseTanglish: 'Words mattum illa, actions-la change kaamikka try pannuven. Consistency every single day.',
    promiseEnglish: 'Not just apologies in words, but demonstrable positive evolution in every action.',
  },
];

export const PromiseGarden: React.FC<PromiseGardenProps> = ({ onNext, isReducedMotion: _isReducedMotion }) => {
  const [bloomedFlowers, setBloomedFlowers] = useState<Record<number, boolean>>({
    1: true,
  });
  const [sealedPromise, setSealedPromise] = useState<boolean>(false);

  const toggleBloom = (id: number) => {
    sound.playChime(600 + id * 80, 0.4);
    setBloomedFlowers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const bloomedCount = Object.values(bloomedFlowers).filter(Boolean).length;
  const allBloomed = bloomedCount === 4;

  const handleSealCeremony = () => {
    sound.playChime(1046.5, 0.8);
    setSealedPromise(true);
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto z-20">
      
      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <span className="text-[11px] font-cinzel tracking-[0.25em] text-velvetRose-600 uppercase bg-white px-3.5 py-1 rounded-full border border-rosePetal-300 shadow-sm font-bold">
          Chapter III • Promise Ceremony
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-roseDark-950 mt-2">
          My Promises to Ovi ma
        </h2>
        <p className="text-xs text-roseDark-700 font-semibold mt-1">
          Tap each rose card to reveal my four sincere commitments
        </p>

        {/* Counter */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-white border border-rosePetal-300 shadow-sm text-xs text-velvetRose-700 font-bold">
          <Sparkles size={12} className={allBloomed ? 'text-velvetRose-600 animate-spin-slow' : 'text-gray-400'} />
          <span>{bloomedCount} of 4 Promises Revealed</span>
        </div>
      </motion.div>

      {/* 4 Interactive Blooming Flower Cards */}
      <div className="w-full flex flex-col gap-3 my-2">
        {FLOWERS.map((flower) => {
          const isBloomed = !!bloomedFlowers[flower.id];
          const IconComponent = flower.icon;

          return (
            <div
              key={flower.id}
              onClick={() => toggleBloom(flower.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none ${
                isBloomed
                  ? 'bg-white border-velvetRose-500 shadow-[0_8px_25px_rgba(217,37,90,0.15)]'
                  : 'bg-white/80 border-rosePetal-200 hover:border-rosePetal-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Flower Icon */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                      isBloomed
                        ? 'bg-gradient-to-tr from-velvetRose-600 to-rosePetal-500 shadow-md scale-105'
                        : 'bg-rosePetal-100 text-velvetRose-600'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isBloomed ? 'text-white' : 'text-velvetRose-600'}`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-velvetRose-700 font-black">
                        PROMISE 0{flower.id}
                      </span>
                      <span className="text-[10px] text-roseDark-600 font-serif italic font-medium">
                        {flower.flowerType}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-cinzel font-black text-roseDark-950">
                      {flower.name} • {flower.tamilTitle}
                    </h3>
                  </div>
                </div>

                {/* Status indicator */}
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-all ${
                    isBloomed
                      ? 'border-velvetRose-500 bg-rosePetal-100 text-velvetRose-600'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {isBloomed ? '🌹' : '🌱'}
                </div>
              </div>

              {/* Bloomed Commitment Content in High-Contrast Dark Text */}
              <AnimatePresence>
                {isBloomed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t-2 border-rosePetal-100 text-left overflow-hidden"
                  >
                    <p className="text-xs sm:text-sm font-serif italic text-roseDark-950 leading-relaxed mb-1 font-bold">
                      &ldquo;{flower.promiseTanglish}&rdquo;
                    </p>
                    <p className="text-xs text-roseDark-700 font-medium">
                      {flower.promiseEnglish}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Promise Acknowledgment / Seal Button */}
      <div className="w-full flex flex-col items-center gap-3 mt-4">
        {allBloomed && !sealedPromise && (
          <button
            onClick={handleSealCeremony}
            className="px-5 py-2 rounded-full bg-white hover:bg-rosePetal-50 border-2 border-velvetRose-500 text-velvetRose-700 text-xs font-cinzel font-black flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span>SEAL PROMISES TO OVI MA 🤝</span>
          </button>
        )}

        {sealedPromise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs text-velvetRose-700 font-serif italic font-bold"
          >
            <Check size={14} className="text-emerald-600 font-bold" />
            <span>&ldquo;These promises are rooted in my heart, forever.&rdquo;</span>
          </motion.div>
        )}

        <button
          onClick={() => {
            sound.playChime(880, 0.4);
            onNext();
          }}
          className="w-full sm:w-auto px-7 py-3 rounded-full rose-btn-primary font-cinzel text-xs sm:text-sm tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
        >
          <span>WALK OUR FUTURE PATH</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
