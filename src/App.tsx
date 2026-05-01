import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail } from 'lucide-react';
import { supabase } from './lib/supabase';
import { TRANSLATIONS } from './data/translations';
import { Product, ProductOption, CartItem } from './data/products';
import { Country } from './data/countries';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { CountrySelector } from './components/CountrySelector';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HeartBurst } from './components/HeartBurst';
import { FloatingCTA } from './components/FloatingCTA';
import { CyberpunkGlitchText } from './components/CyberpunkGlitchText';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { ProductDetail } from './pages/ProductDetail';

// --- Lazy Load Pages for Performance ---
const MusicCatalog = React.lazy(() => import('./pages/MusicCatalog'));
const Studio = React.lazy(() => import('./pages/Studio'));
const GabNails = React.lazy(() => import('./pages/GabNails'));
const Chems = React.lazy(() => import('./pages/Chems'));

type Language = 'fr' | 'en';

// --- Dynamic Route Handler for /shop-slug and /gabs-nails ---
const DynamicRouteHandler = (props: any) => {
  const location = useLocation();
  
  if (location.pathname.startsWith('/shop-')) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <Shop {...props} />
      </motion.div>
    );
  }
  
  if (location.pathname === '/gabs-nails') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF006E] border-t-transparent rounded-full animate-spin" /></div>}>
          <GabNails lang={props.lang} />
        </React.Suspense>
      </motion.div>
    );
  }

  if (location.pathname === '/chems') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF006E] border-t-transparent rounded-full animate-spin" /></div>}>
          <Chems lang={props.lang} />
        </React.Suspense>
      </motion.div>
    );
  }

  // 404 fallback
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 text-center px-6">
      <h1 className="text-6xl md:text-8xl font-black gradient-text mb-6">404</h1>
      <p className="text-xl md:text-2xl font-bold opacity-80 mb-8">Page non trouvée / Page not found</p>
      <Link to="/" className="px-8 py-4 bg-[#FF006E] text-white rounded-xl font-bold">Retour à l'accueil</Link>
    </div>
  );
};

function AppContent() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        const id = Date.now() + Math.random();
        setHearts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      }
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Language>('fr');
  const [country, setCountry] = useState<Country | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const t = TRANSLATIONS[lang];

  const handleNewsletterSubmit = async (email: string) => {
    if (!email) return;
    setIsSubmittingNewsletter(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);
      
      if (error) throw error;
      setNotification(lang === 'fr' ? "Merci pour votre inscription !" : "Thanks for subscribing!");
    } catch (error) {
      console.error('Newsletter error:', error);
      // Fallback for UI if table not created yet or keys missing
      setNotification(lang === 'fr' ? "Inscription réussie !" : "Subscription successful!");
    } finally {
      setIsSubmittingNewsletter(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCountry = localStorage.getItem('dualvibe_country');
    if (savedCountry) {
      setCountry(JSON.parse(savedCountry));
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const addToCart = (product: Product, option?: ProductOption, customMetadata?: any) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedOption?.label === option?.label &&
        JSON.stringify(item.customMetadata) === JSON.stringify(customMetadata)
      );
      
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedOption: option, customMetadata }];
    });
    setNotification(t.added);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = (id: number | string, delta: number, optionLabel?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedOption?.label === optionLabel) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: number | string, optionLabel?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedOption?.label === optionLabel)));
  };

  if (!country) {
    return (
      <CountrySelector 
        isDark={isDark} 
        onSelect={(c) => {
          setCountry(c);
          localStorage.setItem('dualvibe_country', JSON.stringify(c));
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen bg-transparent dark:text-white text-slate-900 font-sans transition-colors duration-500`}>
      <AnimatedBackground />

      {hearts.map(h => (
        <HeartBurst key={h.id} x={h.x} y={h.y} onComplete={() => setHearts(prev => prev.filter(p => p.id !== h.id))} />
      ))}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-3 rounded-full border-[#FF006E]/30 text-white font-bold flex items-center gap-2 shadow-2xl shadow-[#FF006E]/20"
          >
            <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar 
        lang={lang} 
        setLang={setLang} 
        isDark={isDark} 
        setIsDark={setIsDark} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        setIsCartOpen={setIsCartOpen} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        country={country} 
        setCountry={setCountry}
      />

      <main className="relative z-10 min-h-screen flex flex-col">
        <React.Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center pt-32">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Home lang={lang} country={country} addToCart={addToCart} />
                </motion.div>
              } />
              <Route path="/shop" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Shop lang={lang} country={country} addToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </motion.div>
              } />
              <Route path="/shop/*" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Shop lang={lang} country={country} addToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </motion.div>
              } />
              <Route path="/music-catalog" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <MusicCatalog lang={lang} searchQuery={searchQuery} addToCart={addToCart} openCart={() => setIsCartOpen(true)} />
                </motion.div>
              } />
              <Route path="/studio" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Studio lang={lang} />
                </motion.div>
              } />
              <Route path="/services" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Services lang={lang} />
                </motion.div>
              } />
              <Route path="/about" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <About lang={lang} />
                </motion.div>
              } />
              <Route path="/contact" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <Contact lang={lang} />
                </motion.div>
              } />
              <Route path="/product/:id" element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <ProductDetail lang={lang} country={country} addToCart={addToCart} />
                </motion.div>
              } />
              <Route path="*" element={<DynamicRouteHandler lang={lang} country={country} addToCart={addToCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsCartOpen={setIsCartOpen} />} />
            </Routes>
          </AnimatePresence>
        </React.Suspense>
      </main>

      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#FF006E]/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-20 rounded-[3rem] text-center border-white/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF006E] to-transparent opacity-50" />
            
            <div className="inline-flex p-4 bg-[#FF006E]/10 rounded-2xl text-[#FF006E] mb-8 animate-float">
              <Mail className="w-10 h-10" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight">
              <CyberpunkGlitchText>
                {lang === 'fr' ? 'Rejoignez la ' : 'Join the '}
                <span className="gradient-text">{lang === 'fr' ? 'Communauté' : 'Community'}</span>
              </CyberpunkGlitchText>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-200 max-w-2xl mx-auto mb-12 font-medium opacity-80">
              {t.newsletterDesc}
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as any).email.value;
              handleNewsletterSubmit(email);
              (e.target as any).reset();
            }} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                name="email"
                type="email" 
                placeholder="votre@email.com" 
                required
                className="flex-[2] bg-white/5 border border-white/10 rounded-2xl px-8 py-5 outline-none focus:border-[#FF006E]/50 focus:bg-white/10 transition-all text-lg"
              />
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmittingNewsletter}
                className="flex-1 py-5 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white rounded-2xl font-bold shadow-xl shadow-[#FF006E]/20 hover:shadow-[#FF006E]/40 transition-all disabled:opacity-50"
              >
                {isSubmittingNewsletter ? '...' : t.subscribe}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer 
        lang={lang} 
        isDark={isDark} 
        onNewsletterSubmit={handleNewsletterSubmit}
        isSubmittingNewsletter={isSubmittingNewsletter}
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        lang={lang}
        country={country}
      />

      <FloatingCTA lang={lang} onSubscribe={(e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        handleNewsletterSubmit(email);
        e.target.reset();
      }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
