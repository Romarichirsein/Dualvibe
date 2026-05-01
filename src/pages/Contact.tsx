import React from 'react';
import { motion } from 'motion/react';
import { Mail, MessageCircle, Send, Music, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../data/translations';
import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';

type Language = 'fr' | 'en';

export const Contact = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00D1FF]/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-8xl font-display font-black mb-8 leading-tight">
                <CyberpunkGlitchText>
                  {lang === 'fr' ? 'Dites ' : 'Say '}
                  <span className="gradient-text">{lang === 'fr' ? 'Bonjour' : 'Hello'}</span>
                </CyberpunkGlitchText>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-200 mb-12 leading-relaxed opacity-80 font-medium">
                {t.footerDesc}
              </p>
              <div className="space-y-8 flex flex-col items-center lg:items-start">
                {[
                  { icon: Mail, label: 'Email', value: 'dualvibe237@gmail.com', color: 'text-[#FF006E]' },
                  { icon: MessageCircle, label: 'WhatsApp', value: '+1 (289) 630-1143', color: 'text-green-500' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center text-[#FF006E] shadow-xl border-white/10 group-hover:border-[#FF006E]/30 transition-all">
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm uppercase tracking-widest opacity-60 mb-1">{item.label}</h4>
                      <p className="text-xl font-display font-bold group-hover:text-[#FF006E] transition-colors">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-10 md:p-14 rounded-[3.5rem] border-white/20 shadow-2xl relative form-glow-border"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF006E]/5 blur-3xl rounded-full" />
              <div className="space-y-8 relative z-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-3">{t.name}</label>
                    <input type="text" className="w-full glass px-8 py-5 rounded-2xl outline-none focus:border-[#FF006E]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg" placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-3">{t.email}</label>
                    <input type="email" className="w-full glass px-8 py-5 rounded-2xl outline-none focus:border-[#FF006E]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg" placeholder="Email" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-3">{t.message}</label>
                  <textarea className="w-full glass px-8 py-5 rounded-2xl outline-none h-44 resize-none focus:border-[#FF006E]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg" placeholder={lang === 'fr' ? 'Message...' : 'Message...'} />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-gradient-to-r from-[#FF006E] via-[#00D1FF] to-sky-900 text-white rounded-3xl font-black text-xl shadow-2xl shadow-[#FF006E]/20 flex items-center justify-center gap-4 transition-all"
                >
                  <Send className="w-6 h-6" />
                  {t.send}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Secondary CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-12 rounded-[3.5rem] border-white/20 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 bg-[#00D1FF]/10 rounded-[2rem] flex items-center justify-center text-[#00D1FF] mb-8 group-hover:scale-110 transition-transform">
                <Music className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">{lang === 'fr' ? 'Besoin de Musique ?' : 'Need Music?'}</h3>
              <p className="text-slate-600 dark:text-slate-200 mb-8 opacity-80">
                {lang === 'fr' ? 'Découvrez notre catalogue exclusif de licences.' : 'Discover our exclusive licensing catalog.'}
              </p>
              <Link to="/music-catalog">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-[#00D1FF] text-white rounded-2xl font-bold"
                >
                  {lang === 'fr' ? 'Voir le Catalogue' : 'View Catalog'}
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-12 rounded-[3.5rem] border-white/20 text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 bg-[#FF006E]/10 rounded-[2rem] flex items-center justify-center text-[#FF006E] mb-8 group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-4">{lang === 'fr' ? 'Projet Sur-Mesure ?' : 'Custom Project?'}</h3>
              <p className="text-slate-600 dark:text-slate-200 mb-8 opacity-80">
                {lang === 'fr' ? 'Notre studio est prêt à réaliser vos idées.' : 'Our studio is ready to realize your ideas.'}
              </p>
              <Link to="/studio">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-[#FF006E] text-white rounded-2xl font-bold"
                >
                  {lang === 'fr' ? 'Aller au Studio' : 'Go to Studio'}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
