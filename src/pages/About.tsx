import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, MessageCircle, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../data/translations';
import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';

type Language = 'fr' | 'en';

export const About = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <>
      <section className="pt-40 pb-20 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF006E]/10 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-display font-black mb-12 text-center"
          >
            <CyberpunkGlitchText>
              {lang === 'fr' ? 'Notre ' : 'Our '}
              <span className="gradient-text">{lang === 'fr' ? 'Histoire' : 'Story'}</span>
            </CyberpunkGlitchText>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-10 md:p-16 rounded-[3rem] space-y-10 border-white/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF006E]/5 blur-3xl rounded-full" />
            <p className="text-xl text-slate-600 dark:text-slate-200 leading-relaxed font-medium">
              {t.aboutText}
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-display font-bold text-[#FF006E] flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  {t.mission}
                </h2>
                <p className="text-slate-600 dark:text-slate-200 leading-relaxed opacity-80">
                  {t.missionText}
                </p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-gradient-to-br from-[#FF006E] via-[#00D1FF] to-sky-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-6xl font-black mb-3 text-shadow-lg">10k+</div>
                <div className="text-lg font-bold opacity-90 uppercase tracking-widest">
                  {lang === 'fr' ? 'Clients Satisfaits' : 'Happy Clients'}
                </div>
                <Sparkles className="absolute bottom-6 right-6 w-12 h-12 opacity-20 group-hover:rotate-45 transition-transform" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About CTA Section */}
      <section className="py-24 bg-[#FF006E]/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-16 rounded-[4rem] border-white/20 overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 relative z-10">
              <CyberpunkGlitchText>
                {lang === 'fr' ? 'Prêt à ' : 'Ready to '}
                <span className="gradient-text">{lang === 'fr' ? 'Explorer ?' : 'Explore?'}</span>
              </CyberpunkGlitchText>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-[#FF006E] text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-[#FF006E]/20"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {t.shop}
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 glass border-2 border-[#FF006E] text-[#FF006E] rounded-2xl font-black flex items-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  {t.contact}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
