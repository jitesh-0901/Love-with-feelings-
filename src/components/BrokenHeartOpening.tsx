import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { storyAudio } from '../utils/audioController';
import { logAnalyticsEvent } from '../utils/analyticsTracker';

interface BrokenHeartOpeningProps {
  onOpenHeart: () => void;
  isReducedMotion: boolean;
}

// Realistic interlocking jagged crack clip paths down the center:
const LEFT_JAGGED_CLIP =
  'polygon(0 0, 50% 0, 50% 12%, 54% 28%, 46% 45%, 55% 62%, 46% 78%, 51% 90%, 50% 100%, 0 100%)';
const RIGHT_JAGGED_CLIP =
  'polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 51% 90%, 46% 78%, 55% 62%, 46% 45%, 54% 28%, 50% 12%)';

export const BrokenHeartOpening: React.FC<BrokenHeartOpeningProps> = ({
  onOpenHeart,
  isReducedMotion: _isReducedMotion,
}) => {
  // Starts BROKEN! (isMerged = false, interactiveDistance = 36)
  // Heals seamlessly when tapped!
  const [isMerged, setIsMerged] = useState<boolean>(false);
  const [interactiveDistance, setInteractiveDistance] = useState<number>(36);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Plasma lightning & sparks between the broken jagged halves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Cosmic ember particles floating in the crack
    const emberCount = 24;
    const embers = Array.from({ length: emberCount }, (_, i) => ({
      x: (Math.random() - 0.5) * 70,
      y: (Math.random() - 0.5) * 80,
      size: Math.random() * 2.2 + 1,
      speedY: -(Math.random() * 0.7 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      isCyan: i % 2 === 0,
    }));

    const render = () => {
      const w = (canvas.width = canvas.clientWidth || 340);
      const h = (canvas.height = canvas.clientHeight || 200);
      const midX = w / 2;
      const midY = h / 2;

      ctx.clearRect(0, 0, w, h);
      time += 0.04;

      const sep = interactiveDistance;

      // Draw plasma tendrils only when separated
      if (sep > 2) {
        const leftX = midX - sep;
        const rightX = midX + sep;

        // 4 electric plasma arcs leaping across the void
        for (let i = 0; i < 4; i++) {
          const arcOffset = i * 22 - 33;
          const startY = midY + arcOffset + Math.sin(time * 3 + i) * 6;
          const endY = midY + arcOffset + Math.cos(time * 3 + i) * 6;

          ctx.beginPath();
          ctx.moveTo(leftX, startY);

          const cp1x = leftX + (rightX - leftX) * 0.35 + (Math.random() - 0.5) * 6;
          const cp1y = (startY + endY) / 2 + Math.sin(time * 5 + i * 2) * 12;

          const cp2x = leftX + (rightX - leftX) * 0.65 + (Math.random() - 0.5) * 6;
          const cp2y = (startY + endY) / 2 - Math.cos(time * 5 + i * 2) * 12;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, rightX, endY);

          const grad = ctx.createLinearGradient(leftX, startY, rightX, endY);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0.9)'); // Electric cyan
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 1)'); // Hot white core
          grad.addColorStop(1, 'rgba(244, 63, 94, 0.9)'); // Velvet rose

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6 + Math.sin(time * 6 + i) * 0.6;
          ctx.shadowColor = i % 2 === 0 ? '#38bdf8' : '#f43f6e';
          ctx.shadowBlur = 10;
          ctx.stroke();
        }

        // Center glow pulse between halves
        const coreGrad = ctx.createRadialGradient(midX, midY, 0, midX, midY, sep * 1.2);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        coreGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.35)');
        coreGrad.addColorStop(0.8, 'rgba(244, 63, 94, 0.25)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(midX, midY, sep * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render cosmic embers drifting upward
      embers.forEach((emb) => {
        emb.y += emb.speedY;
        emb.x += emb.speedX;

        if (emb.y < -h / 2) {
          emb.y = h / 2;
          emb.x = (Math.random() - 0.5) * (sep * 2 + 25);
        }

        ctx.beginPath();
        ctx.arc(midX + emb.x, midY + emb.y, emb.size, 0, Math.PI * 2);
        ctx.fillStyle = emb.isCyan
          ? `rgba(56, 189, 248, ${emb.opacity})`
          : `rgba(244, 63, 94, ${emb.opacity})`;
        ctx.shadowColor = emb.isCyan ? '#38bdf8' : '#f43f6e';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [interactiveDistance]);

  // Touch action to heal the heart
  const handleOneTouchConnect = () => {
    if (isMerged) return;

    // Start Ovi ma's special song immediately as the heart joins!
    storyAudio.play();

    // Log to Google Sheet
    logAnalyticsEvent('❤️ Broken Heart Healed', 'Song started playing smoothly');

    // Stardust confetti burst
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#38bdf8', '#f43f6e', '#ffffff', '#fbbf24', '#e11d48'],
    });

    setInteractiveDistance(0);
    setIsMerged(true);

    // After heart heals and pulses with radiant love, smoothly advance to the Letter
    setTimeout(() => {
      onOpenHeart();
    }, 1800);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto text-center z-20 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center justify-center"
      >
        {/* 
          MASTER COSMIC BROKEN HEART CONTAINER
          Two interlocking jagged halves:
          Left = Cyan Electric (Me), Right = Velvet Rose (Ovi ma)
          Tapping connects them smoothly!
        */}
        <div
          onClick={handleOneTouchConnect}
          className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[16/9] mx-auto my-4 flex items-center justify-center cursor-pointer group"
          title={isMerged ? 'Our heart is healed ♡' : 'Tap to heal our heart'}
        >
          {/* Soft Dreamy Ambient Nebula Aura */}
          <div
            className={`absolute inset-0 rounded-3xl transition-all duration-1000 -z-10 blur-2xl ${
              isMerged
                ? 'bg-gradient-to-r from-sky-500/25 via-rose-500/40 to-velvetRose-600/30 opacity-100 animate-pulse-gentle'
                : 'bg-gradient-to-r from-sky-500/20 via-transparent to-rose-500/20 opacity-70'
            }`}
          />

          {/* 1. LEFT HALF: Cyan Blue Electric Heart (Jagged Interlocking Break) */}
          <motion.div
            animate={{
              x: isMerged ? 0 : -interactiveDistance,
              rotate: isMerged ? 0 : -4.5,
              y: isMerged ? 0 : -2,
              scale: isMerged ? [1, 1.03, 1] : 0.98,
            }}
            transition={{
              x: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
              rotate: { duration: 0.7, ease: 'easeOut' },
              y: { duration: 0.7, ease: 'easeOut' },
              scale: isMerged
                ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.5 },
            }}
            style={{
              clipPath: LEFT_JAGGED_CLIP,
            }}
            className={`absolute inset-0 transition-shadow duration-500 ${
              isMerged
                ? 'drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]'
                : 'drop-shadow-[0_0_35px_rgba(56,189,248,0.75)]'
            }`}
          >
            <img
              src="/images/cosmic-heart.jpg"
              alt="Left Broken Heart Piece"
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
            />
          </motion.div>

          {/* 2. RIGHT HALF: Rose Velvet Heart (Matching Jagged Complement) */}
          <motion.div
            animate={{
              x: isMerged ? 0 : interactiveDistance,
              rotate: isMerged ? 0 : 4.5,
              y: isMerged ? 0 : 2,
              scale: isMerged ? [1, 1.03, 1] : 0.98,
            }}
            transition={{
              x: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
              rotate: { duration: 0.7, ease: 'easeOut' },
              y: { duration: 0.7, ease: 'easeOut' },
              scale: isMerged
                ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.5 },
            }}
            style={{
              clipPath: RIGHT_JAGGED_CLIP,
            }}
            className={`absolute inset-0 transition-shadow duration-500 ${
              isMerged
                ? 'drop-shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                : 'drop-shadow-[0_0_35px_rgba(244,63,94,0.75)]'
            }`}
          >
            <img
              src="/images/cosmic-heart.jpg"
              alt="Right Broken Heart Piece"
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
            />
          </motion.div>

          {/* 3. DYNAMIC CANVAS PLASMA TENDRILS (Active when separated) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />

          {/* 4. RADIANT SEAM LIGHT FLASH WHEN MERGED */}
          {isMerged && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 1, 0], scaleY: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_20px_#ffffff,0_0_40px_#f43f6e] z-30 pointer-events-none"
            />
          )}
        </div>

        {/* Subtle Hint While Broken or Healed */}
        {!isMerged ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0.65, 1, 0.65], y: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-3 flex items-center justify-center gap-2 text-roseDark-800 font-serif italic text-xs sm:text-sm tracking-wide select-none"
          >
            <Sparkles size={13} className="text-sky-500 animate-spin-slow" />
            <span>Tap the heart to heal</span>
            <Heart size={13} className="text-velvetRose-500 fill-velvetRose-500" />
            <Sparkles size={13} className="text-velvetRose-500 animate-spin-slow" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 flex items-center justify-center gap-2 text-velvetRose-700 font-serif italic text-sm tracking-wide select-none"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Our heart is healed... ❤️</span>
            <Sparkles size={14} className="text-amber-500" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BrokenHeartOpening;
