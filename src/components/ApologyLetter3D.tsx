import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Feather, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { generateLuxuryApologyPdf } from '../utils/pdfLetterGenerator';
import { logAnalyticsEvent, updateSessionSummary } from '../utils/analyticsTracker';
import { sound } from '../utils/soundEffects';

interface ApologyLetter3DProps {
  onNext: () => void;
  isReducedMotion: boolean;
}

const LETTER_LINES = [
  "Dear Ovi ma,",
  "",
  "Unna hurt pannirundha, from my heart, I'm really sorry.",
  "",
  "Sila neram kovathula pesura vaarthaigal evlo hurt pannumnu yosikkaama poiduren. Aana un feelings-ah naan light-ah eduthukala.",
  "",
  "Unna convince panradhukku mattum indha page create pannala. Naan enna thappa pannirundhen, adha purinjukittu better-ah maara virumburen.",
  "",
  "Unna naan respect pannanum. Un feelings-ah kekkanum. Unakku thevaiyana space kudukkanum.",
  "",
  "I'm sorry, Ovi ma. ❤️"
];

export const ApologyLetter3D: React.FC<ApologyLetter3DProps> = ({ onNext, isReducedMotion }) => {
  const [envelopeState, setEnvelopeState] = useState<'sealed' | 'unsealing' | 'sliding' | 'unfolded'>('sealed');
  const [visibleLineCount, setVisibleLineCount] = useState<number>(0);
  const [isDoneWriting, setIsDoneWriting] = useState<boolean>(false);
  const [stampedHearts, setStampedHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const letterRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (envelopeState !== 'unfolded') return;

    if (isReducedMotion) {
      setVisibleLineCount(LETTER_LINES.length);
      setIsDoneWriting(true);
      return;
    }

    let line = 0;
    const interval = setInterval(() => {
      line++;
      setVisibleLineCount(line);
      sound.playChime(600 + line * 30, 0.2);
      if (line >= LETTER_LINES.length) {
        setIsDoneWriting(true);
        updateSessionSummary({ letterRead: 'Yes, 100% Read ♡' });
        logAnalyticsEvent('📖 Letter Readed Perfectly', 'All lines read to the end');
        clearInterval(interval);
      }
    }, 650);

    return () => clearInterval(interval);
  }, [envelopeState, isReducedMotion]);

  useEffect(() => {
    if (envelopeState === 'unfolded' && letterRef.current && !isReducedMotion) {
      gsap.fromTo(
        letterRef.current,
        { y: 50, scale: 0.9, opacity: 0, rotateX: 12 },
        { y: 0, scale: 1, opacity: 1, rotateX: 0, duration: 1.1, ease: 'power3.out' }
      );
    }
  }, [envelopeState, isReducedMotion]);

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'sealed') return;
    
    sound.playEnvelopeOpen();

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#d9255a', '#f59e0b', '#f43f6e', '#ffffff'],
    });

    setEnvelopeState('unsealing');
    updateSessionSummary({ letterRead: 'Reading letter...' });
    logAnalyticsEvent('💌 Opened Letter', 'Ovi ma unsealed envelope and started reading');

    setTimeout(() => {
      sound.playPaperSlide();
      setEnvelopeState('sliding');
    }, 600);

    setTimeout(() => {
      setEnvelopeState('unfolded');
    }, 1200);
  };

  const handleShowAll = () => {
    setVisibleLineCount(LETTER_LINES.length);
    setIsDoneWriting(true);
    updateSessionSummary({ letterRead: 'Yes, 100% Read ♡' });
    logAnalyticsEvent('📖 Letter Readed Perfectly', 'All lines read to the end');
    sound.playChime(880, 0.3);
  };

  const handleLetterTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sound.playChime(950 + Math.random() * 200, 0.25);
    setStampedHearts((prev) => [...prev.slice(-8), { id: Date.now(), x, y }]);
  };

  const handleDownloadPdf = async () => {
    updateSessionSummary({ downloadedPdf: true });
    logAnalyticsEvent('📥 Downloaded PDF Letter', 'Saved For_Ovi_ma_Apology_Letter.pdf');
    sound.playChime(1046.5, 0.4);

    try {
      await generateLuxuryApologyPdf();
    } catch (err) {
      console.error('Luxury PDF export failed:', err);
    }
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto z-20">
      
      {/* Letter Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-roseDark-950 flex items-center justify-center gap-2">
          <span>It&apos;s from my heart</span>
          <span>❤️</span>
        </h2>
      </motion.div>

      {/* 3D Interactive Envelope Experience */}
      <div className="w-full flex flex-col items-center">
        {envelopeState !== 'unfolded' ? (
          <div className="w-full max-w-sm perspective-1000 py-4">
            
            <div
              onClick={handleOpenEnvelope}
              className="group cursor-pointer relative bg-white p-6 sm:p-7 rounded-3xl border-2 border-rosePetal-300 shadow-[0_15px_35px_rgba(217,37,90,0.18)] hover:border-velvetRose-500 transition-all duration-500 transform hover:-translate-y-2 select-none"
            >
              {/* Envelope Body */}
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-rosePetal-50 border border-rosePetal-200 flex flex-col items-center justify-center overflow-hidden shadow-inner preserve-3d">
                
                {/* Letter Inside Peeking */}
                <motion.div
                  animate={{
                    y: envelopeState === 'sliding' ? -65 : 0,
                    opacity: envelopeState === 'sliding' ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-x-6 top-8 h-28 bg-white rounded-t-lg border-t-2 border-x-2 border-rosePetal-300 shadow-md flex items-center justify-center -z-0"
                >
                  <span className="text-xs font-handwritten text-velvetRose-600 font-bold">
                    Dear Ovi ma...
                  </span>
                </motion.div>

                {/* Back flap lines */}
                <div className="absolute inset-0 border-b border-rosePetal-200 [clip-path:polygon(0_0,100%_0,50%_55%)] bg-rosePetal-100/90 shadow-sm z-10" />
                <div className="absolute inset-0 [clip-path:polygon(0_100%,100%_100%,50%_45%)] bg-rosePetal-50 z-10" />

                {/* 3D Folding Top Flap */}
                <motion.div
                  animate={{
                    rotateX: envelopeState === 'unsealing' || envelopeState === 'sliding' ? -175 : 0,
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'top center' }}
                  className="absolute inset-x-0 top-0 h-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-gradient-to-b from-rosePetal-100 to-white border-b-2 border-rosePetal-300 shadow-md z-20"
                />

                {/* Wax Seal with Real Rose Red & Gold Foil */}
                <motion.div
                  animate={{
                    scale: envelopeState === 'unsealing' ? [1, 1.25, 0] : 1,
                    opacity: envelopeState === 'unsealing' ? [1, 1, 0] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative z-30 w-16 h-16 rounded-full bg-gradient-to-tr from-velvetRose-700 via-velvetRose-600 to-rosePetal-500 flex items-center justify-center shadow-[0_8px_25px_rgba(217,37,90,0.5)] group-hover:scale-110 transition-transform border-2 border-white"
                >
                  <Heart className="w-8 h-8 text-white fill-white drop-shadow-sm animate-pulse" />
                </motion.div>

                <p className="relative z-30 text-[10px] font-cinzel text-roseDark-950 font-black uppercase tracking-widest mt-3">
                  FOR OVI MA
                </p>
              </div>

              {/* Pulsing Hint below */}
              <div className="mt-4 text-center flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-velvetRose-600 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-velvetRose-500 animate-spin-slow" />
                  <span>Tap wax seal to open letter</span>
                  <Sparkles size={14} className="text-velvetRose-500 animate-spin-slow" />
                </span>
                <span className="text-[11px] text-roseDark-700 font-semibold">
                  கடிதத்தை திறந்து படிக்கவும் 💌
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Opened Letter Paper in High Contrast & Clear Alignment */
          <motion.div
            ref={letterRef}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg relative"
          >
            {/* Animated Floating Quill */}
            {!isDoneWriting && (
              <motion.div
                ref={quillRef}
                animate={{
                  x: [0, 8, -4, 0],
                  y: [0, -3, 2, 0],
                  rotate: [15, 20, 12, 15],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-2 z-40 bg-white p-2 rounded-full shadow-md border border-rosePetal-300 flex items-center gap-1.5 pointer-events-none"
              >
                <Feather size={16} className="text-velvetRose-600" />
                <span className="text-[10px] font-cinzel font-bold text-roseDark-900">
                  Writing...
                </span>
              </motion.div>
            )}

            {/* Letter Paper Body: Authentic Vintage Lined Stationery with Deep Emotional Touch */}
            <div
              onClick={handleLetterTap}
              className="relative rounded-2xl rose-letter-paper p-5 sm:p-8 shadow-2xl text-left cursor-pointer overflow-hidden border-2 border-rosePetal-300"
            >
              {/* Left Notebook Red Margin Line */}
              <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-[1.5px] bg-rose-400/30 pointer-events-none" />

              {/* Dynamic Stamped Hearts on tap */}
              {stampedHearts.map((h) => (
                <motion.div
                  key={h.id}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.4, opacity: 0, y: -20 }}
                  transition={{ duration: 0.9 }}
                  style={{ left: h.x - 10, top: h.y - 10 }}
                  className="absolute pointer-events-none z-30"
                >
                  <Heart size={20} className="fill-velvetRose-600 text-velvetRose-600 drop-shadow" />
                </motion.div>
              ))}

              {/* Intimate Letter Header: Postmark Stamp & Handwritten Date */}
              <div className="flex items-start justify-between pb-3 mb-2 border-b border-rosePetal-200/60 relative z-10 pl-6 sm:pl-10">
                <div>
                  <p className="font-handwritten text-base sm:text-lg text-velvetRose-700 font-bold tracking-wide">
                    En Manasula Irundhu... 💌
                  </p>
                  <p className="font-serif italic text-[11px] text-roseDark-700 font-semibold">
                    Unakku mattum dhaan indha varigal
                  </p>
                </div>

                {/* Vintage Postage Stamp with Rose Postmark */}
                <div className="flex flex-col items-center border border-dashed border-velvetRose-400 bg-rosePetal-50/90 px-2.5 py-1 rounded shadow-xs rotate-2">
                  <span className="text-[9px] font-cinzel font-black tracking-widest text-velvetRose-700 uppercase">
                    AIR MAIL 🌹
                  </span>
                  <span className="text-[8px] font-mono text-roseDark-800 font-bold">
                    FOR OVI MA
                  </span>
                </div>
              </div>

              {/* Authentic Handwritten Letter Content in Cursive Calligraphy */}
              <div className="space-y-3 pl-6 sm:pl-10 relative z-10">
                {LETTER_LINES.slice(0, visibleLineCount).map((line, idx) => {
                  if (line === '') {
                    return <div key={idx} className="h-2" />;
                  }

                  if (idx === 0) {
                    return (
                      <motion.h3
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="font-handwritten text-3xl sm:text-4xl text-velvetRose-700 font-bold tracking-wide my-1 drop-shadow-xs"
                      >
                        {line}
                      </motion.h3>
                    );
                  }

                  const isEnding = idx === LETTER_LINES.length - 1;

                  return (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`font-handwritten leading-[32px] sm:leading-[34px] tracking-wide ${
                        isEnding
                          ? 'text-2xl sm:text-3xl text-velvetRose-700 font-bold pt-2'
                          : 'text-xl sm:text-2xl text-roseDark-950 font-bold'
                      }`}
                    >
                      {line}
                    </motion.p>
                  );
                })}

                {!isDoneWriting && (
                  <span className="inline-block w-2.5 h-5 bg-velvetRose-600 animate-pulse rounded-xs" />
                )}
              </div>

              {/* Hand-Signed Close & Red Wax Impression */}
              {visibleLineCount >= LETTER_LINES.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-5 pt-3 pl-6 sm:pl-10 flex items-center justify-between border-t border-rosePetal-200/50"
                >
                  <p className="font-handwritten text-xl sm:text-2xl text-roseDark-800 font-bold italic">
                    — Endrum unakkaga, naan.
                  </p>

                  {/* Wax Seal Stamp Impression */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-velvetRose-700 to-rosePetal-500 border border-white shadow-md flex items-center justify-center -rotate-6">
                    <Heart size={16} className="text-white fill-white" />
                  </div>
                </motion.div>
              )}

              {/* Skip button */}
              {!isDoneWriting && (
                <div className="mt-4 pt-2 flex justify-end">
                  <button
                    onClick={handleShowAll}
                    className="text-xs text-velvetRose-600 hover:text-velvetRose-700 underline decoration-dotted font-bold"
                  >
                    Show full letter immediately
                  </button>
                </div>
              )}

              {/* Bottom Action when done */}
              <AnimatePresence>
                {isDoneWriting && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-3 border-t-2 border-rosePetal-200 flex flex-col sm:flex-row items-center justify-between gap-3"
                  >
                    <button
                      onClick={handleDownloadPdf}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-rosePetal-50 border-2 border-velvetRose-500 text-velvetRose-700 font-cinzel text-xs font-black shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Download size={14} className="text-velvetRose-600" />
                      <span>DOWNLOAD LETTER (PDF) 📥</span>
                    </button>

                    <button
                      onClick={() => {
                        updateSessionSummary({ letterRead: 'Yes, 100% Read ♡' });
                        sound.playChime(880, 0.4);
                        onNext();
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full rose-btn-primary font-cinzel text-xs tracking-wider font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <span>CONTINUE TO FORGIVENESS</span>
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
