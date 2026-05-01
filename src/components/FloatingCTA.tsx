import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, X } from 'lucide-react';

export const FloatingCTA = ({ lang, onSubscribe }: { lang: 'fr' | 'en'; onSubscribe: (email: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-24 right-8 z-[100] flex flex-col items-end gap-3"
        >
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="glass p-6 rounded-[2rem] w-80 shadow-2xl border-pink-500/20 relative overflow-hidden group form-glow-border"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-pink-500/10 transition-colors" />
              <button onClick={() => setIsExpanded(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500"><Mail className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">Newsletter</h4><p className="text-[10px] opacity-60">Offres & Nouveautés</p></div>
                </div>
                <form onSubmit={(e: any) => { e.preventDefault(); onSubscribe(e.target.email.value); e.target.reset(); setIsExpanded(false); }} className="space-y-3">
                  <input name="email" type="email" placeholder="votre@email.com" required className="w-full glass px-4 py-3 rounded-xl text-sm outline-none focus:border-pink-500/50 transition-all font-medium" />
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-pink-500/20">
                    {lang === 'fr' ? "C'est parti !" : "Let's go!"}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-pink-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/30 group relative"
          >
            <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity" />
            <Sparkles className={`w-6 h-6 transition-transform duration-500 ${isExpanded ? 'rotate-90' : ''}`} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
