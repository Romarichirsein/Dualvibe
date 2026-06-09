import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, MapPin, Clock, ExternalLink, X, Check, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

// WhatsApp icon SVG component
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// TikTok icon SVG component
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

// Facebook icon SVG component
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

interface ServiceOption {
  name: { fr: string; en: string };
  price: number;
}

interface Product {
  id: number;
  name: { fr: string; en: string };
  basePrice: number;
  duration: string;
  image: string;
  category: 'tresses' | 'onglerie' | 'cils' | 'coupe';
  options?: ServiceOption[];
}

const PATY_PRODUCTS: Product[] = [
  // Tresses (with Flyer options)
  {
    id: 1,
    name: { fr: "Rasta Simple", en: "Simple Rasta" },
    basePrice: 9500,
    duration: "2h30",
    image: "/products/paty-beaute/Knotless - Rasta américain.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Au Dos", en: "To the Back" }, price: 9500 },
      { name: { fr: "Aux Fesses", en: "To the Butt" }, price: 11500 }
    ]
  },
  {
    id: 2,
    name: { fr: "Rasta avec Boucle", en: "Rasta with Curls" },
    basePrice: 11000,
    duration: "3h",
    image: "/products/paty-beaute/Knotless avec rajout.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Au Dos", en: "To the Back" }, price: 11000 },
      { name: { fr: "Aux Fesses", en: "To the Butt" }, price: 13500 }
    ]
  },
  {
    id: 3,
    name: { fr: "French Curl", en: "French Curl" },
    basePrice: 10000,
    duration: "2h45",
    image: "/products/paty-beaute/French curl.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Court", en: "Short" }, price: 10000 },
      { name: { fr: "Long", en: "Long" }, price: 18000 }
    ]
  },
  {
    id: 4,
    name: { fr: "Passion Twist", en: "Passion Twist" },
    basePrice: 8500,
    duration: "2h30",
    image: "/products/paty-beaute/Twist.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Court", en: "Short" }, price: 8500 },
      { name: { fr: "Long", en: "Long" }, price: 14000 }
    ]
  },
  {
    id: 5,
    name: { fr: "Passe Mèche Américaine", en: "American Feed-in" },
    basePrice: 5500,
    duration: "2h",
    image: "/products/paty-beaute/Passe mèche américain.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Court", en: "Short" }, price: 5500 },
      { name: { fr: "Long", en: "Long" }, price: 7000 }
    ]
  },
  {
    id: 6,
    name: { fr: "Invisible Locs", en: "Invisible Locs" },
    basePrice: 9000,
    duration: "3h",
    image: "/products/paty-beaute/Braid locks.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Simple", en: "Simple" }, price: 9000 },
      { name: { fr: "Avec Passe Mèche", en: "With Feed-in" }, price: 9000 }
    ]
  },
  {
    id: 7,
    name: { fr: "Braids Locs", en: "Braids Locs" },
    basePrice: 11000,
    duration: "3h",
    image: "/products/paty-beaute/Braid locks.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Au Dos", en: "To the Back" }, price: 11000 },
      { name: { fr: "Aux Fesses", en: "To the Butt" }, price: 12500 }
    ]
  },
  {
    id: 8,
    name: { fr: "Rasta et Passe Mèche", en: "Rasta & Feed-in" },
    basePrice: 10000,
    duration: "3h",
    image: "/products/paty-beaute/Fulani braid.jpeg",
    category: "tresses",
    options: [
      { name: { fr: "Simple Au Dos", en: "Simple To the Back" }, price: 10000 },
      { name: { fr: "Simple Aux Fesses", en: "Simple To the Butt" }, price: 12000 },
      { name: { fr: "Avec Boucle Au Dos", en: "With Curls To the Back" }, price: 12000 },
      { name: { fr: "Avec Boucle Aux Fesses", en: "With Curls To the Butt" }, price: 14000 }
    ]
  },
  // Other tresses styles from folder images
  {
    id: 9,
    name: { fr: "Coco Twist", en: "Coco Twist" },
    basePrice: 2500,
    duration: "2h",
    image: "/products/paty-beaute/Coco twist.jpeg",
    category: "tresses"
  },
  {
    id: 10,
    name: { fr: "Fulani Braid", en: "Fulani Braid" },
    basePrice: 2500,
    duration: "2h30",
    image: "/products/paty-beaute/Fulani braid 1.jpeg",
    category: "tresses"
  },
  {
    id: 11,
    name: { fr: "Italian Curl", en: "Italian Curl" },
    basePrice: 2500,
    duration: "2h45",
    image: "/products/paty-beaute/Italian curl.jpeg",
    category: "tresses"
  },
  {
    id: 12,
    name: { fr: "Short French Curl", en: "Short French Curl" },
    basePrice: 10000,
    duration: "2h15",
    image: "/products/paty-beaute/Short French curl.jpeg",
    category: "tresses"
  },
  {
    id: 13,
    name: { fr: "Stichtbraid - Passe Mèche", en: "Stitchbraid - Feed-in" },
    basePrice: 2500,
    duration: "1h45",
    image: "/products/paty-beaute/Stichtbraid - passe mèche américain.jpeg",
    category: "tresses"
  },
  {
    id: 14,
    name: { fr: "Tresses Spéciales 1", en: "Special Braids 1" },
    basePrice: 2500,
    duration: "2h",
    image: "/products/paty-beaute/WhatsApp Image 2026-06-03 at 11.54.33.jpeg",
    category: "tresses"
  },
  {
    id: 15,
    name: { fr: "Tresses Spéciales 2", en: "Special Braids 2" },
    basePrice: 2500,
    duration: "2h30",
    image: "/products/paty-beaute/WhatsApp Image 2026-06-03 at 11.54.37.jpeg",
    category: "tresses"
  },
  // Onglerie (no image, placeholder logo)
  {
    id: 16,
    name: { fr: "Pose Ongles Capsules", en: "Capsule Nail Extensions" },
    basePrice: 1000,
    duration: "1h",
    image: "/products/paty-beaute/logo.png",
    category: "onglerie"
  },
  // Extensions de cils (no image, placeholder logo)
  {
    id: 17,
    name: { fr: "Extensions de Cils", en: "Eyelash Extensions" },
    basePrice: 2500,
    duration: "1h15",
    image: "/products/paty-beaute/logo.png",
    category: "cils"
  },
  // Coupe femme et enfants (no image, placeholder logo)
  {
    id: 18,
    name: { fr: "Coupe femme et enfants", en: "Women & Kids Haircut" },
    basePrice: 2000,
    duration: "45min",
    image: "/products/paty-beaute/logo.png",
    category: "coupe"
  }
];

export default function PatyBeaute({ lang }: { lang: 'fr' | 'en' }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'tresses' | 'onglerie' | 'cils' | 'coupe'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = activeFilter === 'all'
    ? PATY_PRODUCTS
    : PATY_PRODUCTS.filter(p => p.category === activeFilter);

  const handleBooking = async (product: Product, option: ServiceOption | null) => {
    setIsSubmitting(true);
    const price = option ? option.price : product.basePrice;
    const optionName = option ? ` (${option.name[lang]})` : '';
    const finalMessage = lang === 'fr'
      ? `Bonjour Paty Beauté ! 💇‍♀️✨\nJe viens depuis DualVibe et je souhaite réserver la prestation :\n\n✨ ${product.name.fr}${optionName}\n💰 Prix : ${price.toLocaleString()} FCFA\n⏱ Durée estimée : ${product.duration}\n\nMerci de me reconfirmer vos disponibilités ! 🙏`
      : `Hello Paty Beauté! 💇‍♀️✨\nI'm coming from DualVibe and would like to book:\n\n✨ ${product.name.en}${optionName}\n💰 Price: ${price.toLocaleString()} FCFA\n⏱ Estimated Duration: ${product.duration}\n\nPlease confirm your availability! 🙏`;

    try {
      // 1. Log booking in Supabase
      await supabase.from('partner_bookings').insert([{
        partner_name: "Paty Beauté",
        product_name: product.name.fr + (option ? ` (${option.name.fr})` : ''),
        price: price,
        promo_code: null,
        customer_message: finalMessage
      }]);

      // 2. Trigger notification email
      await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner: "Paty Beauté",
          product: product.name.fr + (option ? ` (${option.name.fr})` : ''),
          price: price,
          promoCode: 'None',
          message: finalMessage
        })
      });
    } catch (error) {
      console.error('Booking logging/notification error:', error);
    } finally {
      setIsSubmitting(false);
      setSelectedProduct(null);
      setSelectedOption(null);
      // Open WhatsApp link (Paty Beauté Business Phone: +237 659077834)
      window.open(`https://wa.me/237659077834?text=${encodeURIComponent(finalMessage)}`, '_blank');
    }
  };

  const openBookingModal = (product: Product) => {
    if (product.options && product.options.length > 0) {
      setSelectedProduct(product);
      setSelectedOption(product.options[0]); // default to first option
    } else {
      handleBooking(product, null);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 space-y-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full bg-gradient-to-tr from-[#FF006E] via-[#00D1FF] to-[#FF006E] p-1.5 shadow-2xl shadow-[#FF006E]/40"
        >
          <img
            src="/products/paty-beaute/logo.png"
            alt="Paty Beauté Logo"
            className="w-full h-full object-cover rounded-full bg-white"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-display font-black tracking-tight"
        >
          Paty <span className="gradient-text">Beauté</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl font-bold text-[#FF006E] tracking-wide"
        >
          {lang === 'fr' ? "Tresses, Onglerie & Extensions de Cils ✨" : "Braids, Nails & Lash Extensions ✨"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg opacity-80 max-w-3xl mx-auto leading-relaxed"
        >
          {lang === 'fr'
            ? "Notre salon Paty Beauté est un espace chaleureux qui vous offre des prestations de tresses africaines et diverses, d'onglerie et d'extension de cils à des prix très abordables et attractifs. Nous sommes à la disposition de tous à Douala !"
            : "Our Paty Beauté salon is a warm space offering African & assorted braids, nail artistry, and eyelash extensions at highly affordable and attractive prices. Open to everyone in Douala!"}
        </motion.p>

        {/* Business and Info Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <a
            href="https://www.tiktok.com/@sonia_pat2006"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg border border-white/10"
          >
            <TikTokIcon />
            TikTok
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
          <a
            href="https://www.facebook.com/people/Sonia-paty/100063630650965/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <FacebookIcon />
            Facebook
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
          <div className="flex items-center gap-2 px-6 py-3 glass rounded-full font-bold text-sm">
            <Clock className="w-4 h-4 text-[#FF006E]" />
            {lang === 'fr' ? 'Lun - Ven à 9h (Sam sur RDV)' : 'Mon - Fri at 9am (Sat by Appt)'}
          </div>
          <div className="flex items-center gap-2 px-6 py-3 glass rounded-full font-bold text-sm">
            <MapPin className="w-4 h-4 text-[#00D1FF]" />
            Bonaloka, Collège Tercio, Douala
          </div>
        </motion.div>
      </motion.div>

      {/* Categories Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {[
          { key: 'all' as const, label: { fr: 'Tout voir', en: 'View All' } },
          { key: 'tresses' as const, label: { fr: 'Tresses', en: 'Braids' } },
          { key: 'onglerie' as const, label: { fr: 'Onglerie', en: 'Nails' } },
          { key: 'cils' as const, label: { fr: 'Extensions de Cils', en: 'Lashes' } },
          { key: 'coupe' as const, label: { fr: 'Coupe', en: 'Haircuts' } },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
              activeFilter === f.key
                ? 'bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white shadow-lg shadow-[#FF006E]/30 scale-105'
                : 'glass hover:scale-105'
            }`}
          >
            {f.label[lang]}
          </button>
        ))}
      </motion.div>

      {/* Info details banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="glass p-6 rounded-3xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10"
      >
        <div className="py-2 md:py-0">
          <div className="text-lg font-bold text-pink-500">{lang === 'fr' ? 'Sur Rendez-Vous' : 'Appointment Only'}</div>
          <div className="text-xs opacity-60 mt-1">{lang === 'fr' ? 'Planifiez votre créneau en ligne' : 'Secure your session online'}</div>
        </div>
        <div className="py-2 md:py-0">
          <div className="text-lg font-bold text-[#00D1FF]">{lang === 'fr' ? 'Paiement Flexible' : 'Flexible Payments'}</div>
          <div className="text-xs opacity-60 mt-1">Orange Money & MTN MoMo</div>
        </div>
        <div className="py-2 md:py-0">
          <div className="text-lg font-bold text-yellow-500">{lang === 'fr' ? 'Prestations à domicile' : 'Home service'}</div>
          <div className="text-xs opacity-60 mt-1">{lang === 'fr' ? 'Possible dès 10 000 FCFA' : 'Available from 10,000 FCFA'}</div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod, idx) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(idx * 0.04, 0.6) }}
            whileHover={{ y: -8 }}
            className="glass rounded-3xl p-4 overflow-hidden group flex flex-col justify-between"
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-white/5 flex items-center justify-center">
                {prod.image.includes('logo.png') ? (
                  <div className="p-8 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black/80 to-slate-900">
                    <img
                      src={prod.image}
                      alt={prod.name[lang]}
                      className="w-24 h-24 object-contain rounded-full opacity-65 mb-3"
                    />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FF006E] opacity-70">
                      {lang === 'fr' ? 'Paty Beauté' : 'Paty Beauty'}
                    </span>
                  </div>
                ) : (
                  <img
                    src={prod.image}
                    alt={prod.name[lang]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                
                {/* Duration Badge */}
                <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-xl">
                  <Clock className="w-3.5 h-3.5 text-[#FF006E]" /> {prod.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white capitalize">
                  {prod.category}
                </div>
              </div>

              {/* Service Info */}
              <h3 className="font-bold text-lg leading-tight mb-1">{prod.name[lang]}</h3>
              <p className="text-xs opacity-60 mb-4 leading-relaxed">
                {prod.category === 'tresses' && (lang === 'fr' ? 'Tresses réalisées avec soin et mèche incluse' : 'Braids styled with care, hair extensions included')}
                {prod.category === 'onglerie' && (lang === 'fr' ? 'Sublimez vos mains avec nos poses capsules' : 'Enhance your hands with beautiful capsule extensions')}
                {prod.category === 'cils' && (lang === 'fr' ? 'Extensions de cils pour un regard envoûtant' : 'Eyelash extensions for a captivating gaze')}
                {prod.category === 'coupe' && (lang === 'fr' ? 'Coupe stylée pour femmes et enfants' : 'Stylish haircut for women and children')}
              </p>
            </div>

            <div>
              <p className="text-2xl font-black gradient-text mb-3">
                {prod.options && prod.options.length > 0 ? (
                  <>
                    <span className="text-xs font-bold opacity-60 mr-1">{lang === 'fr' ? 'À partir de' : 'From'}</span>
                    {Math.min(...prod.options.map(o => o.price)).toLocaleString()} FCFA
                  </>
                ) : (
                  `${prod.basePrice.toLocaleString()} FCFA`
                )}
              </p>

              <button
                onClick={() => openBookingModal(prod)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/10"
              >
                <WhatsAppIcon />
                {lang === 'fr' ? 'Réserver la prestation' : 'Book Service'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Rules Information Card */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass p-8 rounded-[2.5rem] mt-20 border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] opacity-60" />
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#FF006E]" />
          {lang === 'fr' ? "Conditions & Infos de Coiffure" : "Coiffure Rules & Details"}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-85 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{lang === 'fr' ? 'Les prix varient également en fonction de la grosseur des tresses.' : 'Prices also vary depending on the thickness of the braids.'}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{lang === 'fr' ? 'Les autres types de coiffures non listées sont également réalisables.' : 'Other custom hairstyles not listed are also possible.'}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{lang === 'fr' ? "Prestations à domicile disponibles à partir de 10 000 FCFA (frais de transport variables)." : "Home services available from 10,000 FCFA (transport fees vary by location)."}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{lang === 'fr' ? 'Seul l’achat préalable ou le dépôt de la mèche garantit votre rendez-vous.' : 'Only providing/depositing the hair extensions guarantees your appointment slot.'}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{lang === 'fr' ? 'Les tarifs du salon sont déjà très attractifs et sont non-négociables.' : 'Salon prices are already highly competitive and are non-negotiable.'}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <span>{lang === 'fr' ? "Un service de qualité supérieure avec une styliste à l'écoute." : "Top-tier quality service with an attentive and patient stylist."}</span>
          </li>
        </ul>
      </motion.div>

      {/* Option Selection Modal */}
      <AnimatePresence>
        {selectedProduct && selectedProduct.options && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 rounded-[2.5rem] border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#FF006E]/20 text-[#FF006E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{lang === 'fr' ? 'Choisir une option' : 'Select Option'}</h3>
                <p className="text-sm opacity-70">
                  {lang === 'fr'
                    ? `Sélectionnez la variante de votre prestation pour ${selectedProduct.name.fr}`
                    : `Choose your specific variant for ${selectedProduct.name.en}`}
                </p>
              </div>

              <div className="space-y-4">
                {selectedProduct.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                      selectedOption?.name.fr === opt.name.fr
                        ? 'border-[#FF006E] bg-[#FF006E]/5 text-white scale-[1.01]'
                        : 'border-white/10 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{opt.name[lang]}</div>
                      <div className="text-xs opacity-60 mt-0.5">{lang === 'fr' ? 'Tarif prestation' : 'Service fee'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#FF006E]">{opt.price.toLocaleString()} FCFA</span>
                      {selectedOption?.name.fr === opt.name.fr && (
                        <div className="w-5 h-5 rounded-full bg-[#FF006E] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                <button
                  disabled={isSubmitting}
                  onClick={() => handleBooking(selectedProduct, selectedOption)}
                  className="w-full py-4 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white rounded-2xl font-bold shadow-xl shadow-[#FF006E]/20 hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {lang === 'fr' ? 'Confirmer & Réserver sur WhatsApp' : 'Confirm & Book on WhatsApp'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
