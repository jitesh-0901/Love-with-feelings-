import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, ArrowRight } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface FuturePathwayProps {
  onNext: () => void;
  isReducedMotion: boolean;
}

interface PathScene {
  step: number;
  title: string;
  tamilTitle: string;
  emoji: string;
  description: string;
  tanglishQuote: string;
}

const PATH_SCENES: PathScene[] = [
  {
    step: 1,
    title: "Supporting Your Dreams",
    tamilTitle: "உன் கனவுகளுக்கு துணை",
    emoji: "🌹",
    description: "Cheering for your goals, believing in you even when doubt creeps in.",
    tanglishQuote: "Un ambitions-ah achieve panna epovum un pakkathula ninnu cheer pannuven, Ovi ma.",
  },
  {
    step: 2,
    title: "Celebrating Little Wins",
    tamilTitle: "சின்ன வெற்றிகளை கொண்டாடுதல்",
    emoji: "🎉",
    description: "Finding joy in everyday achievements and quiet milestones.",
    tanglishQuote: "Chinna vishayam-naalum un kooda serndhu celebrate panni un smile-ah paakanum.",
  },
  {
    step: 3,
    title: "Standing By You on Dark Days",
    tamilTitle: "கடினமான நாட்களில் உடன் நிற்றல்",
    emoji: "🕯️",
    description: "No judgment, no running away — simply being a safe shelter.",
    tanglishQuote: "Kashtamaana nerathula un kaiya pidichukittu silent-ah iruka naan irupen.",
  },
  {
    step: 4,
    title: "Laughing Over Little Things",
    tamilTitle: "மனம் திறந்து சிரித்தல்",
    emoji: "☕",
    description: "Silly jokes, light-hearted conversations, and effortless comfort.",
    tanglishQuote: "Over-thinking ellam thooki pottu, manasu vittu un kooda sirikka virumburen.",
  },
  {
    step: 5,
    title: "Growing in Mutual Respect",
    tamilTitle: "சுயமரியாதையோடு வளருதல்",
    emoji: "🌱",
    description: "Never expecting perfection, always prioritizing understanding and freedom.",
    tanglishQuote: "Enakku un mela control illa, only honest respect and deep affection.",
  },
];

export const FuturePathway: React.FC<FuturePathwayProps> = ({ onNext, isReducedMotion: _isReducedMotion }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    sound.playChime(600 + step * 70, 0.3);
  };

  const handleNextStep = () => {
    if (currentStep < PATH_SCENES.length) {
      setCurrentStep((prev) => prev + 1);
      sound.playChime(600 + (currentStep + 1) * 70, 0.3);
    } else {
      onNext();
    }
  };

  const activeScene = PATH_SCENES.find((p) => p.step === currentStep) || PATH_SCENES[0];

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto z-20">
      
      {/* Chapter header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <span className="text-[11px] font-cinzel tracking-[0.25em] text-velvetRose-600 uppercase bg-white px-3.5 py-1 rounded-full border border-rosePetal-300 shadow-sm font-bold">
          Chapter IV • Our Future Path
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-roseDark-950 mt-2">
          Walking Forward Gently
        </h2>
        <p className="text-xs text-roseDark-700 font-semibold mt-1">
          Not unrealistic promises — just honest, grounded support for Ovi ma
        </p>
      </motion.div>

      {/* Pathway Stepping Stones Navigation */}
      <div className="w-full flex items-center justify-between px-2 mb-5 max-w-sm mx-auto relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-rosePetal-200 -z-0" />

        {PATH_SCENES.map((p) => {
          const isCurrent = p.step === currentStep;
          const isPassed = p.step < currentStep;

          return (
            <button
              key={p.step}
              onClick={() => handleStepClick(p.step)}
              className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                isCurrent
                  ? 'bg-gradient-to-tr from-velvetRose-600 to-rosePetal-500 text-white shadow-md scale-110 font-bold border-2 border-white'
                  : isPassed
                  ? 'bg-rosePetal-100 text-velvetRose-700 border-2 border-rosePetal-300'
                  : 'bg-white text-gray-400 border-2 border-rosePetal-100'
              }`}
            >
              <span className="text-xs">{p.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Active Pathway Card in High Contrast */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScene.step}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="w-full rose-card p-5 sm:p-6 text-center mb-5"
        >
          <div className="w-13 h-13 rounded-full bg-rosePetal-100 border-2 border-rosePetal-200 mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">
            {activeScene.emoji}
          </div>

          <span className="text-[10px] font-mono text-velvetRose-700 font-black uppercase tracking-widest block mb-1">
            STEP {activeScene.step} OF 5
          </span>

          <h3 className="text-lg sm:text-xl font-cinzel font-black text-roseDark-950">
            {activeScene.title}
          </h3>
          <p className="text-xs text-velvetRose-600 font-serif mb-3 font-bold">
            {activeScene.tamilTitle}
          </p>

          <div className="py-2.5 border-y-2 border-rosePetal-100 my-2">
            <p className="text-sm sm:text-base font-serif italic text-roseDark-950 leading-relaxed font-bold">
              &ldquo;{activeScene.tanglishQuote}&rdquo;
            </p>
          </div>

          <p className="text-xs text-roseDark-700 font-medium mt-2">
            {activeScene.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Step Navigation Controls */}
      <div className="w-full flex items-center justify-center gap-3">
        {currentStep < PATH_SCENES.length ? (
          <button
            onClick={handleNextStep}
            className="w-full sm:w-auto px-7 py-3 rounded-full rose-btn-primary font-cinzel text-xs sm:text-sm tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Footprints size={15} />
            <span>TAKE NEXT STEP ({currentStep}/5)</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playChime(880, 0.4);
              onNext();
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-full rose-btn-primary font-cinzel text-xs sm:text-sm tracking-widest font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span>APPROACH THE FORGIVENESS SCENE</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
