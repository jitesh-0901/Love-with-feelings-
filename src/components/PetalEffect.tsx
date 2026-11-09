import React, { useEffect, useRef } from 'react';

interface PetalEffectProps {
  intensity?: 'gentle' | 'shower' | 'subtle';
  interactive?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  opacity: number;
  swaySpeed: number;
  swayOffset: number;
}

export const PetalEffect: React.FC<PetalEffectProps> = ({
  intensity = 'subtle',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const count =
      intensity === 'shower'
        ? window.innerWidth < 768 ? 35 : 70
        : intensity === 'gentle'
        ? window.innerWidth < 768 ? 18 : 30
        : window.innerWidth < 768 ? 10 : 16;

    // Authentic Real Rose Petals Palette (Velvet Red, Rosebud, and Dewdrop Rose)
    const colors = [
      '#e11d48', // vibrant red rose petal
      '#d9255a', // velvet red rose
      '#f43f6e', // rich rose petal pink
      '#be123c', // deep crimson rose petal
      '#fda4af', // delicate blush rose petal
      '#ffffff', // dewy petal highlight
    ];

    const createPetal = (startY = -20): Petal => ({
      x: Math.random() * width,
      y: startY,
      size: Math.random() * 8 + 6,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.3 + 0.7,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.45 + 0.35,
      swaySpeed: Math.random() * 0.03 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
    });

    petalsRef.current = Array.from({ length: count }, () =>
      createPetal(Math.random() * height)
    );

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      petalsRef.current.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.swaySpeed + p.swayOffset) * 0.7;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Draw organic petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 2, 0, p.size);
        ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size, 0, 0);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(217, 37, 90, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleTap = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      for (let i = 0; i < 6; i++) {
        const p = createPetal(clientY + (Math.random() - 0.5) * 30);
        p.x = clientX + (Math.random() - 0.5) * 30;
        p.speedY = -(Math.random() * 2 + 1);
        p.speedX = (Math.random() - 0.5) * 3;
        petalsRef.current.push(p);
      }

      if (petalsRef.current.length > count + 20) {
        petalsRef.current.splice(0, 6);
      }
    };

    window.addEventListener('click', handleTap);
    window.addEventListener('touchstart', handleTap, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleTap);
      window.removeEventListener('touchstart', handleTap);
    };
  }, [intensity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
