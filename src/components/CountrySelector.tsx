import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Country, COUNTRIES } from '../data/countries';

export const CountrySelector = ({ onSelect, isDark }: { onSelect: (c: Country) => void; isDark: boolean }) => {
  const [selected, setSelected] = useState<Country | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black backdrop-blur-xl p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-zinc-950 border border-white/10 max-w-md w-full p-8 rounded-[2.5rem] text-center shadow-2xl"
      >
        <img 
          src={isDark ? '/logo-dark.png' : '/logo-light.png'} 
          alt="DualVibe Logo" 
          className="h-16 w-auto mx-auto mb-6"
        />
        <p className="text-white mb-8 opacity-90">Veuillez sélectionner votre pays / Please select your country</p>
        
        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 mb-8 custom-scrollbar">
          {COUNTRIES.map((c) => (
            <motion.button
              key={c.code}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(c)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${selected?.code === c.code ? 'border-pink-500 bg-pink-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >
              <span className="font-medium text-white">{c.name.fr} / {c.name.en}</span>
              <span className="text-pink-500 font-bold">{c.symbol}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 transition-all"
        >
          Continuer / Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
