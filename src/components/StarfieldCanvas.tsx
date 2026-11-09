import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface StarfieldCanvasProps {
  currentChapter: number;
  showCenterHeart?: boolean;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({
  currentChapter,
  showCenterHeart = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Three.js scene setup
  useEffect(() => {
    if (!webglSupported || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    // Chapter-aware fog: Deep cosmic midnight for Chapter 1, soft daydream fog for Chapters 2-8
    scene.fog = currentChapter === 1
      ? new THREE.FogExp2(0x08030c, 0.002)
      : new THREE.FogExp2(0xfff5f8, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. PASTEL BOKEH & STAR PARTICLES (Soft Dreamy Palette)
    const starCount = window.innerWidth < 768 ? 600 : 1200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xd9255a), // rich velvet rose
      new THREE.Color(0xe11d48), // red rose petal
      new THREE.Color(0xf43f6e), // rose petal pink
      new THREE.Color(0xfda4af), // blush rose
      new THREE.Color(0xffffff), // pure starlight
      new THREE.Color(0xf59e0b), // golden honey sparkle
      new THREE.Color(0xbe123c), // deep crimson rose
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 350;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 350;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 300;

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i3] = col.r;
      starColors[i3 + 1] = col.g;
      starColors[i3 + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Soft round circle texture
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const sCtx = starCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(253,164,175,0.85)');
      grad.addColorStop(0.7, 'rgba(217,37,90,0.4)');
      grad.addColorStop(1, 'rgba(255,245,247,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 32, 32);
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 2. FLOATING 3D RADIANT HEART (Parametric Heart)
    const heartGroup = new THREE.Group();
    const heartParticleCount = window.innerWidth < 768 ? 400 : 700;
    const heartGeo = new THREE.BufferGeometry();
    const heartPos = new Float32Array(heartParticleCount * 3);
    const heartCol = new Float32Array(heartParticleCount * 3);

    for (let i = 0; i < heartParticleCount; i++) {
      const t = Math.PI * 2 * Math.random();
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = (Math.random() - 0.5) * 6;

      const scale = 0.85 + (Math.random() - 0.5) * 0.15;
      const i3 = i * 3;
      heartPos[i3] = x * scale;
      heartPos[i3 + 1] = y * scale;
      heartPos[i3 + 2] = z * scale;

      const col = new THREE.Color().lerpColors(
        new THREE.Color(0xd9255a), // rich velvet rose
        new THREE.Color(0xfda4af), // soft rose petal
        Math.random()
      );
      heartCol[i3] = col.r;
      heartCol[i3 + 1] = col.g;
      heartCol[i3 + 2] = col.b;
    }

    heartGeo.setAttribute('position', new THREE.BufferAttribute(heartPos, 3));
    heartGeo.setAttribute('color', new THREE.BufferAttribute(heartCol, 3));

    const heartMat = new THREE.PointsMaterial({
      size: 4.2,
      map: starTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const heartPoints = new THREE.Points(heartGeo, heartMat);
    heartGroup.add(heartPoints);

    heartGroup.position.set(0, 0, 0);
    scene.add(heartGroup);

    // Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX * 10 - targetX) * 0.04;
      targetY += (-mouseY * 6 - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      starPoints.rotation.y = elapsedTime * 0.015;
      starPoints.rotation.x = Math.sin(elapsedTime * 0.01) * 0.04;

      if (heartGroup) {
        const pulse = 1 + Math.sin(elapsedTime * 2.2) * 0.05;
        heartGroup.scale.set(pulse, pulse, pulse);
        heartGroup.rotation.y = Math.sin(elapsedTime * 0.6) * 0.2;

        if (currentChapter === 1 || currentChapter === 5 || currentChapter === 6 || !showCenterHeart) {
          // Never show background 3D particle heart on Chapter 1 and Final Chapter
          heartGroup.visible = false;
        } else {
          heartGroup.position.y = -12;
          heartGroup.scale.set(0.6, 0.6, 0.6);
          heartGroup.visible = false;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      heartGeo.dispose();
      heartMat.dispose();
      starTexture.dispose();
    };
  }, [webglSupported, currentChapter, showCenterHeart]);

  // Fallback 2D Pastel Canvas if WebGL is disabled
  useEffect(() => {
    if (webglSupported) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.02 + 0.005,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#fff5f7');
      grad.addColorStop(1, '#ffe4ea');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.alpha += p.speed;
        const currentAlpha = Math.abs(Math.sin(p.alpha)) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 37, 90, ${currentAlpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [webglSupported]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fff5f7]">
      {/* Soft romantic rose dew background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f7] via-[#fff0f3] to-[#ffe4ea] opacity-90" />

      {/* WebGL Canvas or 2D Fallback */}
      {webglSupported ? (
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      ) : (
        <canvas ref={fallbackCanvasRef} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
};
