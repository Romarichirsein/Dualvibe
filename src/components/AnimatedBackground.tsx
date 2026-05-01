import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { ParticleNetwork } from './ParticleNetwork';

export const AnimatedBackground = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [45, 65]);
  const gridSkewY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, 0]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 50;
      const y = (clientY / window.innerHeight - 0.5) * 50;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[var(--bg-primary)]">
      {/* Noise Overlay Filter */}
      <div className="noise-overlay" />

      {/* Neural Particle Network */}
      <ParticleNetwork />
      
      {/* Wavy Perspective Grid */}
      <motion.div 
        style={{ 
          perspective: '1000px', 
          rotateX: gridRotateX,
          skewY: gridSkewY,
          scale: gridScale
        }}
        className="absolute inset-0 origin-center transition-transform duration-700"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* 3D Motion Blobs */}
      <motion.div 
        style={{ x: smoothX, y: smoothY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* Deep Sky Blue Glow */}
        <motion.div 
          animate={{ 
            x: [0, 50, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#00D1FF]/10 rounded-full blur-[140px] mix-blend-screen dark:mix-blend-soft-light" 
        />
        
        {/* Vibrant Lime Glow */}
        <motion.div 
          animate={{ 
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1.1, 0.9, 1.2, 1.1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-15%] w-[55vw] h-[55vw] bg-pink-500/10 rounded-full blur-[120px] mix-blend-screen dark:mix-blend-soft-light" 
        />

        {/* === FULL-SCREEN CIRCULATING SMOKE SYSTEM (OPTIMIZED) === */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Layer 1 — Pink smoke top-left → bottom-right */}
          <motion.div
            animate={{ x: ['0%', '40%', '-20%', '0%'], y: ['0%', '30%', '-20%', '0%'], scale: [1, 1.4, 0.8, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'blur(100px)', willChange: 'transform', position: 'absolute', top: '-15%', left: '-15%', width: '65vw', height: '65vw', background: 'radial-gradient(circle, rgba(255, 0, 110, 0.35) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 2 — Cyan smoke top-right → center */}
          <motion.div
            animate={{ x: ['0%', '-45%', '25%', '0%'], y: ['0%', '35%', '-15%', '0%'], scale: [1.2, 0.9, 1.3, 1.2], opacity: [0.25, 0.15, 0.25] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ filter: 'blur(110px)', willChange: 'transform', position: 'absolute', top: '-10%', right: '-15%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(0, 209, 255, 0.3) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 3 — Extra Glow Center */}
          <motion.div
            animate={{ scale: [1, 1.2, 0.9, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'blur(120px)', willChange: 'transform', position: 'absolute', top: '20%', left: '20%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(255, 0, 110, 0.15) 0%, transparent 75%)', borderRadius: '50%' }}
          />
          {/* Layer 5 — Pink smoke bottom-left → top */}
          <motion.div
            animate={{ x: ['0%', '25%', '50%', '0%'], y: ['0%', '-45%', '-15%', '0%'], scale: [1, 1.3, 1, 1], opacity: [0.22, 0.12, 0.22] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            style={{ filter: 'blur(100px)', willChange: 'transform', position: 'absolute', bottom: '-15%', left: '-5%', width: '65vw', height: '65vw', background: 'radial-gradient(circle, rgba(255, 0, 110, 0.25) 0%, transparent 70%)', borderRadius: '50%' }}
          />
          {/* Layer 6 — Cyan smoke bottom-right → left */}
          <motion.div
            animate={{ x: ['0%', '-55%', '-25%', '0%'], y: ['0%', '-25%', '-55%', '0%'], scale: [0.95, 1.4, 1.1, 0.95], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
            style={{ filter: 'blur(120px)', willChange: 'transform', position: 'absolute', bottom: '-20%', right: '-15%', width: '75vw', height: '75vw', background: 'radial-gradient(circle, rgba(0, 209, 255, 0.28) 0%, transparent 70%)', borderRadius: '50%' }}
          />
        </div>
      </motion.div>

      {/* Neon Rain Drops */}
      <div className="absolute inset-0 z-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={`lime-${i}`}
            className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#FF006E] to-transparent animate-neon-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${100 + Math.random() * 150}px`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3,
            }}
          />
        ))}
        {[...Array(30)].map((_, i) => (
          <div
            key={`sky-${i}`}
            className="absolute w-[1px] bg-gradient-to-b from-transparent via-[#00D1FF] to-transparent animate-neon-rain"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${150 + Math.random() * 200}px`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 7}s`,
              opacity: 0.2,
            }}
          />
        ))}
      </div>

      {/* Grid Mesh Distortion Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-20 dark:opacity-40" />
    </div>
  );
});
