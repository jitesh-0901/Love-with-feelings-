import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { STORY_CHAPTERS } from './utils/types';
import { storyAudio } from './utils/audioController';
import { logAnalyticsEvent } from './utils/analyticsTracker';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { PetalEffect } from './components/PetalEffect';
import { BrokenHeartOpening } from './components/BrokenHeartOpening';
import { ApologyLetter3D } from './components/ApologyLetter3D';
import { ForgivenessScene } from './components/ForgivenessScene';
import { InteractiveQuestions } from './components/InteractiveQuestions';
import { FinalEmotionalSummary } from './components/FinalEmotionalSummary';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';

export const App: React.FC = () => {
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [isReducedMotion] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [forgivenessChoice, setForgivenessChoice] = useState<'YES, I FORGIVE YOU' | 'NO' | 'I NEED MORE TIME' | null>(null);

  // Hidden admin gesture for opening Google Sheets modal (triple tap footer or Ctrl+Shift+L)
  const secretClickCount = useRef<number>(0);
  const secretClickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Initial visit tracking & secret key combo
  useEffect(() => {
    if (!sessionStorage.getItem('ovi_visit_logged')) {
      sessionStorage.setItem('ovi_visit_logged', '1');
      logAnalyticsEvent('🌟 Website Visit Started', 'Ovi ma opened the website');
    }

    const handleSecretKey = (e: KeyboardEvent) => {
      // Ctrl + Shift + L opens Google Sheets modal
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        setIsSettingsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleSecretKey);
    return () => window.removeEventListener('keydown', handleSecretKey);
  }, []);

  const goToChapter = (targetId: number) => {
    if (targetId < 1 || targetId > STORY_CHAPTERS.length) return;
    setDirection(targetId > currentChapter ? 1 : -1);
    setCurrentChapter(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentChapter < STORY_CHAPTERS.length) {
      goToChapter(currentChapter + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 1) {
      goToChapter(currentChapter - 1);
    }
  };

  const handleStartFromOpening = () => {
    // Start synchronized 2-song soundtrack & advance to Chapter 2 (The Secret Letter)
    storyAudio.play();
    goToChapter(2);
  };

  const handleReplay = () => {
    storyAudio.reset();
    goToChapter(1);
  };

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipes only
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter]);

  // Framer Motion slide variants
  const pageVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: isReducedMotion ? 0 : dir * 50,
      scale: isReducedMotion ? 1 : 0.97,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: isReducedMotion ? 0.3 : 0.5,
        ease: 'easeOut' as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: isReducedMotion ? 0 : -dir * 50,
      scale: isReducedMotion ? 1 : 0.97,
      transition: {
        duration: isReducedMotion ? 0.2 : 0.35,
        ease: 'easeIn' as const,
      },
    }),
  };

  const handleSecretFooterClick = () => {
    secretClickCount.current += 1;
    if (secretClickTimeout.current) clearTimeout(secretClickTimeout.current);
    if (secretClickCount.current >= 3) {
      secretClickCount.current = 0;
      setIsSettingsOpen(true);
    } else {
      secretClickTimeout.current = setTimeout(() => {
        secretClickCount.current = 0;
      }, 700);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen min-h-[100dvh] bg-rosePetal-50 text-roseDark-800 flex flex-col justify-between overflow-x-hidden selection:bg-velvetRose-600 selection:text-white"
    >
      {/* 1. Dynamic Dreamy 3D Starfield */}
      <StarfieldCanvas
        currentChapter={currentChapter}
        showCenterHeart={false}
      />

      {/* 2. Floating Cherry Blossom & Rose Petals */}
      <PetalEffect
        intensity={
          currentChapter === 5
            ? 'shower'
            : currentChapter === 2
            ? 'gentle'
            : 'subtle'
        }
        interactive={true}
      />

      {/* 3. Active Story Chapter View Area (5-Chapter Streamlined Flow) */}
      <main className="relative flex-1 flex flex-col justify-center py-4 sm:py-6 z-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentChapter}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {currentChapter === 1 && (
              <BrokenHeartOpening
                onOpenHeart={handleStartFromOpening}
                isReducedMotion={isReducedMotion}
              />
            )}
            {currentChapter === 2 && (
              <ApologyLetter3D
                onNext={() => goToChapter(3)}
                isReducedMotion={isReducedMotion}
              />
            )}
            {currentChapter === 3 && (
              <ForgivenessScene
                onSelectForgiveness={(c) => setForgivenessChoice(c)}
                savedChoice={forgivenessChoice}
                onNext={() => goToChapter(4)}
                isReducedMotion={isReducedMotion}
              />
            )}
            {currentChapter === 4 && (
              <InteractiveQuestions
                forgivenessAnswer={forgivenessChoice}
                onNext={() => goToChapter(5)}
                isReducedMotion={isReducedMotion}
              />
            )}
            {currentChapter === 5 && (
              <FinalEmotionalSummary
                onReplay={handleReplay}
                isReducedMotion={isReducedMotion}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Clean Footer Indicator & Minimal Sound Toggle */}
      <footer className="relative z-30 pb-3 pt-1 px-4 text-center flex items-center justify-center gap-2.5">
        <p
          onClick={handleSecretFooterClick}
          className="text-[10px] sm:text-[11px] text-roseDark-700 font-cinzel font-bold tracking-wider cursor-default select-none"
        >
          <span className="hidden sm:inline">SWIPE OR USE ARROWS TO NAVIGATE ♡</span>
          <span className="sm:hidden">SWIPE TO NAVIGATE ♡</span>
        </p>
        <button
          onClick={() => {
            storyAudio.toggleMute();
            setIsMuted(!isMuted);
          }}
          title={isMuted ? 'Unmute music' : 'Mute music'}
          className="text-velvetRose-600 hover:text-velvetRose-700 p-1 rounded-full transition-transform active:scale-90"
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </footer>

      {/* 6. Google Sheets Settings Modal */}
      <GoogleSheetsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
