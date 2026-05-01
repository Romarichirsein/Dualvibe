import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sun, Moon, ShoppingCart, Globe, Menu, X } from 'lucide-react';
import { Country } from '../data/countries';
import { TRANSLATIONS } from '../data/translations';

type Language = 'fr' | 'en';

export const Navbar = ({ 
  lang, 
  setLang, 
  isDark, 
  setIsDark, 
  country, 
  setCountry, 
  cartCount, 
  setIsCartOpen, 
  searchQuery, 
  setSearchQuery,
  isMenuOpen,
  setIsMenuOpen
}: { 
  lang: Language; 
  setLang: (l: Language) => void; 
  isDark: boolean; 
  setIsDark: (d: boolean) => void; 
  country: Country; 
  setCountry: (c: Country | null) => void; 
  cartCount: number; 
  setIsCartOpen: (o: boolean) => void; 
  searchQuery: string; 
  setSearchQuery: (q: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (o: boolean) => void;
}) => {
  const t = TRANSLATIONS[lang];
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: t.home },
    { to: "/shop", label: t.shop },
    { to: "/music-catalog", label: lang === 'fr' ? 'Musique' : 'Music' },
    { to: "/studio", label: t.studio },
    { to: "/services", label: t.services },
    { to: "/about", label: t.about },
    { to: "/contact", label: t.contact }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img 
              src={isDark ? '/logo-dark.png' : '/logo-light.png'} 
              alt="DualVibe Logo" 
              className="h-10 w-auto"
              loading="eager"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-sm font-bold hover:text-pink-500 transition-colors relative group">
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-pink-50 transition-all ${location.pathname === link.to ? 'w-full bg-pink-500' : 'w-0 group-hover:w-full bg-pink-500'}`} />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-white/10 pr-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLang('fr')} 
              className={`text-xs font-bold transition-colors ${lang === 'fr' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
            >
              FR
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLang('en')} 
              className={`text-xs font-bold transition-colors ${lang === 'en' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
            >
              EN
            </motion.button>
          </div>
          
          <div className="hidden md:flex items-center glass px-4 py-2 rounded-full gap-2 border-white/5 focus-within:border-pink-500/50 transition-all">
            <Search className="w-4 h-4 opacity-80" />
            <input 
              type="text" 
              placeholder={t.search}
              value={searchQuery}
              onFocus={() => {
                if (location.pathname !== '/shop') navigate('/shop');
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-40 lg:w-60 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDark(!isDark)} 
            className="p-2 rounded-full glass hover:bg-pink-500/10 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[#00D1FF]" />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsCartOpen(true);
              setIsMenuOpen(false);
            }}
            className="relative p-2 rounded-full glass hover:bg-pink-500/10 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40">
                {cartCount}
              </span>
            )}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStorage.removeItem('dualvibe_country');
              setCountry(null);
              setIsMenuOpen(false);
            }}
            className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold hover:bg-pink-500/10 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {country.code}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-full glass hover:bg-pink-500/10 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold hover:text-pink-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setLang('fr')} 
                    className={`text-sm font-bold transition-colors ${lang === 'fr' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
                  >
                    FR
                  </button>
                  <button 
                    onClick={() => setLang('en')} 
                    className={`text-sm font-bold transition-colors ${lang === 'en' ? 'text-pink-500' : 'opacity-80 hover:opacity-100'}`}
                  >
                    EN
                  </button>
                </div>
                <button 
                  onClick={() => {
                    localStorage.removeItem('dualvibe_country');
                    setCountry(null);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Globe className="w-4 h-4" />
                  {country.name[lang]}
                </button>
              </div>

              <div className="pt-6">
                <div className="flex items-center glass px-4 py-3 rounded-2xl gap-3 border-white/5 focus-within:border-pink-500/50 transition-all">
                  <Search className="w-5 h-5 opacity-80" />
                  <input 
                    type="text" 
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
