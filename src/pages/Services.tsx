import React from 'react';
import { motion } from 'motion/react';
import { Heart, Moon, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../data/translations';
import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';

type Language = 'fr' | 'en';

export const Services = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const serviceCategories = [
    { 
      id: 'engagement', 
      title: { fr: 'Fiançailles', en: 'Engagement' }, 
      icon: Heart, 
      color: 'from-pink-500 to-[#FF006E]',
      desc: { fr: 'Organisation, décoration et cadeaux pour célébrer l\'engagement.', en: 'Organization, decoration, and gifts to celebrate commitment.' }
    },
    { 
      id: 'wedding', 
      title: { fr: 'Mariage', en: 'Wedding' }, 
      icon: Moon, 
      color: 'from-sky-700 to-sky-900',
      desc: { fr: 'Services premium pour le plus beau jour de votre vie.', en: 'Premium services for the most beautiful day of your life.' }
    },
    { 
      id: 'birthday', 
      title: { fr: 'Anniversaire', en: 'Birthday' }, 
      icon: Sparkles, 
      color: 'from-yellow-500 to-orange-500',
      desc: { fr: 'Animation, gâteaux et planification pour des moments inoubliables.', en: 'Animation, cakes, and planning for unforgettable moments.' }
    },
    { 
      id: 'others', 
      title: { fr: 'Autres', en: 'Others' }, 
      icon: Zap, 
      color: 'from-slate-500 to-slate-700',
      desc: { fr: 'Tout autre service créatif ou événementiel.', en: 'Any other creative or event services.' }
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <CyberpunkGlitchText className="text-4xl md:text-7xl font-display font-black mb-6">
          {(t as any).servicesTitle || (lang === 'fr' ? 'Nos Services' : 'Our Services')}
        </CyberpunkGlitchText>
        <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto font-medium lead-relaxed">
          {(t as any).servicesSubtitle || (lang === 'fr' ? 'Découvrez ce que nous avons à offrir' : 'Discover what we have to offer')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {serviceCategories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] border-white/10 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-30 transition-opacity`} />
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-xl mb-6`}>
              <cat.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{cat.title[lang]}</h3>
            <p className="text-sm opacity-70 leading-relaxed mb-6">{cat.desc[lang]}</p>
            <button className="text-sm font-bold flex items-center gap-2 text-pink-500 group-hover:gap-3 transition-all">
              {lang === 'fr' ? 'Explorer' : 'Explore'} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Gab's Nails Promotional Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass p-8 md:p-12 rounded-[3rem] mb-20 border-pink-500/30 relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-700/10 via-pink-500/5 to-transparent pointer-events-none" />
        
        <div className="w-40 h-40 md:w-64 md:h-64 shrink-0 rounded-full bg-gradient-to-tr from-pink-500 to-sky-700 p-1 shadow-2xl shadow-pink-500/20 relative z-10">
          <img 
            src="/products/gabs-nails/logo.png" 
            alt="Gab's Nails Logo" 
            className="w-full h-full object-cover rounded-full bg-white"
          />
        </div>

        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-500 rounded-full font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Partenaire Recommandé
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black mb-4">
            Gab's <span className="gradient-text">Nails</span>
          </h2>
          <p className="text-lg opacity-80 mb-6 leading-relaxed">
            {lang === 'fr' 
              ? "L'expertise en onglerie pour tous vos événements : Mariages, dot, cérémonies professionnelles ou simple moment de beauté. Profitez de poses en capsule, vernis gel et construction polygel d'une durabilité exceptionnelle." 
              : "Expert nail artistry for all your events: Weddings, traditional ceremonies, or simply treating yourself. Enjoy high-quality capsules, gel polish, and durable polygel constructions."}
          </p>
          <Link to="/gabs-nails" className="inline-flex px-8 py-4 bg-gradient-to-r from-pink-500 to-sky-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-pink-500/30 hover:scale-105 transition-transform items-center gap-2">
            {lang === 'fr' ? "Visiter le catalogue Gab's Nails" : "Visit Gab's Nails Catalog"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>


      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass p-12 md:p-20 rounded-[3rem] text-center border-pink-500/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <h2 className="text-3xl md:text-5xl font-display font-black mb-8">
          {lang === 'fr' ? 'Envie de proposer votre ' : 'Want to offer your '}
          <span className="gradient-text">{lang === 'fr' ? 'Propre Service ?' : 'Own Service?'}</span>
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {lang === 'fr' 
            ? 'Rejoignez notre réseau de prestataires et gagnez en visibilité auprès de milliers de clients potentiels.' 
            : 'Join our service provider network and gain visibility among thousands of potential clients.'}
        </p>
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-pink-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-500/20"
        >
          {lang === 'fr' ? 'Soumettre mon service' : 'Submit my service'}
        </motion.button>
      </motion.div>
    </div>
  );
};
