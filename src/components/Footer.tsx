import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Twitter, Instagram, Github, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

type Language = 'fr' | 'en';

export const Footer = ({ 
  lang, 
  isDark, 
  onNewsletterSubmit, 
  isSubmittingNewsletter 
}: { 
  lang: Language; 
  isDark: boolean; 
  onNewsletterSubmit: (email: string) => void;
  isSubmittingNewsletter: boolean;
}) => {
  const t = TRANSLATIONS[lang];
  return (
    <footer className="py-12 md:py-20 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img 
                src={isDark ? '/logo-dark.png' : '/logo-light.png'} 
                alt="DualVibe Logo" 
                className="h-8 w-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Github].map((Icon, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:text-pink-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">{t.shop}</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
              <li><Link to="/shop" className="hover:text-pink-500 transition-colors">{t.all}</Link></li>
              <li><Link to="/shop" className="hover:text-pink-500 transition-colors">{t.physical}</Link></li>
              <li><Link to="/shop" className="hover:text-pink-500 transition-colors">{t.digital}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t.about}</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
              <li><Link to="/about" className="hover:text-pink-500 transition-colors">{t.about}</Link></li>
              <li><Link to="/contact" className="hover:text-pink-500 transition-colors">{t.contact}</Link></li>
              <li><button className="hover:text-pink-500 transition-colors">{t.privacy}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t.contact}</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-200">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-pink-500" />
                <span>+1 (289) 630-1143</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <span>dualvibe237@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">{t.newsletter}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">{t.newsletterDesc}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              onNewsletterSubmit(email);
              (e.target as any).reset();
            }} className="flex gap-2">
              <input name="email" type="email" placeholder="Email" required className="w-full glass px-4 py-2 rounded-xl text-sm outline-none focus:border-pink-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
              <motion.button 
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={isSubmittingNewsletter}
                className="bg-pink-500 text-white p-2 rounded-xl shadow-lg shadow-pink-500/20 disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold opacity-80 text-center md:text-left">
          <p>© 2024 DualVibe. All rights reserved.</p>
          <div className="flex gap-6">
            <button>{t.privacy}</button>
            <button>{t.cookies}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
