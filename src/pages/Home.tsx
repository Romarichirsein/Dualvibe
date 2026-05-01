import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, Zap, Shield, Globe, Star, ChevronRight, MessageCircle, Sparkles, Heart, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../data/translations';
import { PRODUCTS, Product } from '../data/products';
import { Country } from '../data/countries';
import { ProductCard } from '../components/ProductCard';
import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';
import { FeatureCard } from '../components/FeatureCard';
import { TestimonialCard } from '../components/TestimonialCard';

type Language = 'fr' | 'en';

export const Home = ({ lang, addToCart, country }: { lang: Language; addToCart: (p: Product) => void; country: Country }) => {
  const t = TRANSLATIONS[lang];
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 md:w-96 h-64 md:h-96 bg-[#FF006E]/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-64 md:w-96 h-64 md:h-96 bg-[#00D1FF]/10 blur-[80px] md:blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-8xl font-display font-extrabold leading-tight mb-6 md:mb-8"
          >
            <CyberpunkGlitchText>
              {lang === 'fr' ? 'Tout ce dont vous avez ' : 'Everything you '} 
              <span className="gradient-text">{lang === 'fr' ? 'besoin' : 'need'}</span>
            </CyberpunkGlitchText>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto mb-10 md:mb-12"
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/shop">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white rounded-2xl font-extrabold shadow-2xl shadow-[#FF006E]/40 flex items-center justify-center gap-3 group magnetic-button"
              >
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                {t.explore}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-display font-bold">{t.featured}</h2>
            <Link to="/shop" className="text-[#FF006E] font-bold flex items-center gap-2 hover:gap-3 transition-all">
              {t.shop} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} country={country} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[var(--section-bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t.features}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Zap />} title={t.instantAccess} desc={t.instantAccessDesc} />
            <FeatureCard icon={<Shield />} title={t.securePayment} desc={t.securePaymentDesc} />
            <FeatureCard icon={<Globe />} title={t.globalLicense} desc={t.globalLicenseDesc} />
            <FeatureCard icon={<Star />} title={t.premiumQuality} desc={t.premiumQualityDesc} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <CyberpunkGlitchText>{t.testimonials}</CyberpunkGlitchText>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson" 
              role="Digital Artist" 
              text="DualVibe has completely changed how I source my design assets. The quality is unmatched." 
              avatar="https://picsum.photos/seed/sarah/100/100" 
            />
            <TestimonialCard 
              name="Marc Kouassi" 
              role="Entrepreneur" 
              text="Le service est rapide et les produits physiques sont arrivés en parfait état. Je recommande vivement !" 
              avatar="https://picsum.photos/seed/marc/100/100" 
            />
            <TestimonialCard 
              name="Elena Rodriguez" 
              role="Developer" 
              text="The crypto course was very insightful. Great platform for both digital and physical goods." 
              avatar="https://picsum.photos/seed/elena/100/100" 
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us CTA section */}
      <section className="py-24 relative bg-[#FF006E]/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF006E]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-8"
          >
            <h2 className="text-3xl md:text-6xl font-display font-black leading-tight">
              <CyberpunkGlitchText>
                {lang === 'fr' ? "Besoin d'un projet " : "Need a custom "}
                <span className="gradient-text">{lang === 'fr' ? 'Sur-Mesure ?' : 'Project?'}</span>
              </CyberpunkGlitchText>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-200 opacity-80 max-w-2xl font-medium">
              {lang === 'fr' 
                ? 'Confiez-nous vos idées les plus folles. Notre studio de création transforme vos visions en réalité avec une touche d\'excellence.'
                : 'Entrust us with your wildest ideas. Our creative studio turns your visions into reality with a touch of excellence.'}
            </p>
            <Link to="/studio">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-white dark:bg-slate-900 border-2 border-[#FF006E] text-[#FF006E] rounded-3xl font-black text-xl flex items-center gap-4 transition-all hover:bg-[#FF006E] hover:text-white group shadow-2xl shadow-[#FF006E]/10"
              >
                <Sparkles className="w-7 h-7 group-hover:animate-spin" />
                {lang === 'fr' ? 'Accéder au Studio' : 'Go to Studio'}
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};
