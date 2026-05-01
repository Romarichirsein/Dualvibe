import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export const HeartBurst: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => {
  const [particles] = useState(() => 
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 150,
      ty: -100 - Math.random() * 150,
      ts: 0.5 + Math.random() * 1.5,
      tr: (Math.random() - 0.5) * 45
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x, y }}
          animate={{ 
            opacity: 0, 
            scale: p.ts, 
            x: x + p.tx,
            y: y + p.ty,
            rotate: p.tr
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={p.id === 0 ? onComplete : undefined}
          className="absolute text-pink-500"
        >
          <Heart className="w-5 h-5 fill-current shadow-pink-500/50 filter drop-shadow-md" />
        </motion.div>
      ))}
    </div>
  );
};
