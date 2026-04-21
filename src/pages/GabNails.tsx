import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Clock, ExternalLink, X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

const GABS_PRODUCTS = [
  // Capsule + vernis gel
  { id: 1, name: "Capsule + Vernis Gel", price: 2000, duration: "1h30", image: "/products/gabs-nails/capsule-1.jpeg", category: "capsule" },
  { id: 2, name: "Capsule + Vernis Gel", price: 2500, duration: "1h30", image: "/products/gabs-nails/capsule-2.jpeg", category: "capsule" },
  { id: 3, name: "Capsule + Vernis Gel", price: 2500, duration: "1h45", image: "/products/gabs-nails/capsule-3.jpeg", category: "capsule" },
  { id: 4, name: "Capsule + Vernis Gel", price: 2500, duration: "1h45", image: "/products/gabs-nails/capsule-4.jpeg", category: "capsule" },
  { id: 5, name: "Capsule + Vernis Gel", price: 2000, duration: "1h30", image: "/products/gabs-nails/capsule-5.jpeg", category: "capsule" },
  { id: 6, name: "Capsule + Vernis Gel", price: 2500, duration: "1h45", image: "/products/gabs-nails/capsule-6.jpeg", category: "capsule" },
  { id: 7, name: "Capsule + Vernis Gel", price: 2500, duration: "1h45", image: "/products/gabs-nails/capsule-7.jpeg", category: "capsule" },
  { id: 8, name: "Capsule + Vernis Gel", price: 2500, duration: "1h45", image: "/products/gabs-nails/capsule-8.jpeg", category: "capsule" },
  { id: 9, name: "Capsule + Vernis Gel", price: 2500, duration: "~1h45", image: "/products/gabs-nails/capsule-9.jpeg", category: "capsule" },
  { id: 10, name: "Capsule + Vernis Gel", price: 2500, duration: "1h45", image: "/products/gabs-nails/capsule-10.jpeg", category: "capsule" },
  { id: 11, name: "Capsule + Vernis Gel", price: 2000, duration: "1h45", image: "/products/gabs-nails/capsule-11.jpeg", category: "capsule" },
  { id: 12, name: "Capsule + Vernis Gel", price: 2000, duration: "1h50", image: "/products/gabs-nails/capsule-12.jpeg", category: "capsule" },

  // Construction polygel
  { id: 13, name: "Construction Polygel", price: 6500, duration: "3h", image: "/products/gabs-nails/polygel-13.jpeg", category: "polygel" },
  { id: 14, name: "Construction Polygel", price: 6000, duration: "2h50", image: "/products/gabs-nails/polygel-14.jpeg", category: "polygel" },
  { id: 15, name: "Construction Polygel", price: 6000, duration: "2h50", image: "/products/gabs-nails/polygel-15.jpeg", category: "polygel" },
  { id: 16, name: "Construction Polygel", price: 6500, duration: "2h45", image: "/products/gabs-nails/polygel-16.jpeg", category: "polygel" },
  { id: 17, name: "Construction Polygel", price: 6500, duration: "2h55", image: "/products/gabs-nails/polygel-17.jpeg", category: "polygel" },
  { id: 18, name: "Construction Polygel", price: 6000, duration: "2h45", image: "/products/gabs-nails/polygel-18.jpeg", category: "polygel" },
  { id: 19, name: "Construction Polygel", price: 6000, duration: "2h15", image: "/products/gabs-nails/polygel-19.jpeg", category: "polygel" },
  { id: 20, name: "Construction Polygel", price: 7000, duration: "3h", image: "/products/gabs-nails/polygel-20.jpeg", category: "polygel" },
  { id: 21, name: "Construction Polygel", price: 6000, duration: "2h15", image: "/products/gabs-nails/polygel-21.jpeg", category: "polygel" },
  { id: 22, name: "Construction Polygel", price: 6000, duration: "2h15", image: "/products/gabs-nails/polygel-22.jpeg", category: "polygel" },
  { id: 23, name: "Construction Polygel", price: 6000, duration: "2h15", image: "/products/gabs-nails/polygel-23.jpeg", category: "polygel" },
  { id: 24, name: "Construction Polygel", price: 6500, duration: "2h45", image: "/products/gabs-nails/polygel-24.jpeg", category: "polygel" },
  { id: 25, name: "Construction Polygel", price: 7000, duration: "3h", image: "/products/gabs-nails/polygel-25.jpeg", category: "polygel" },
  { id: 26, name: "Construction Polygel", price: 7000, duration: "3h", image: "/products/gabs-nails/polygel-26.jpeg", category: "polygel" },
  { id: 27, name: "Construction Polygel", price: 7500, duration: "3h", image: "/products/gabs-nails/polygel-27.jpeg", category: "polygel" },
  { id: 28, name: "Construction Polygel", price: 5000, duration: "2h30", image: "/products/gabs-nails/polygel-28.jpeg", category: "polygel" },
  { id: 29, name: "Construction Polygel", price: 6000, duration: "2h30", image: "/products/gabs-nails/polygel-29.jpeg", category: "polygel" },
  { id: 30, name: "Construction Polygel", price: 7000, duration: "2h55", image: "/products/gabs-nails/polygel-30.jpeg", category: "polygel" },
  { id: 31, name: "Construction Polygel", price: 7500, duration: "3h", image: "/products/gabs-nails/polygel-31.jpeg", category: "polygel" },
  { id: 32, name: "Construction Polygel", price: 7000, duration: "2h55", image: "/products/gabs-nails/polygel-32.jpeg", category: "polygel" },
];

const VALID_PROMOS = ['Princestore', 'Baecstore', 'Mervistore', 'Gicostore', 'Ashstore'];
const DISCOUNT_AMOUNT = 300;

// WhatsApp SVG icon component
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// TikTok SVG icon component
const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

export default function GabNails({ lang }: { lang: 'fr' | 'en' }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'capsule' | 'polygel'>('all');

  const [selectedProduct, setSelectedProduct] = useState<typeof GABS_PRODUCTS[0] | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = activeFilter === 'all' 
    ? GABS_PRODUCTS 
    : GABS_PRODUCTS.filter(p => p.category === activeFilter);

  const handleWhatsAppOrder = async (product: typeof GABS_PRODUCTS[0], code: string = '') => {
    setIsSubmitting(true);
    const isPromoValid = VALID_PROMOS.some(p => p.toLowerCase() === code.trim().toLowerCase());
    const finalPrice = isPromoValid ? Math.max(0, product.price - DISCOUNT_AMOUNT) : product.price;

    const finalMessage = lang === 'fr'
      ? `Bonjour Gab's Nails ! 💅\nJe viens depuis DualVibe et je suis intéressé(e) par :\n\n✨ ${product.name}\n💰 Prix : ${finalPrice} FCFA ${isPromoValid ? `(Réduction -${DISCOUNT_AMOUNT} appliquée)` : ''}\n⏱ Durée : ${product.duration}\n🎟 Code Promo : ${code || 'Aucun'}${isPromoValid ? ' ✅' : ''}\n\nMerci de me confirmer vos disponibilités ! 🙏`
      : `Hello Gab's Nails! 💅\nI'm coming from DualVibe and I'm interested in:\n\n✨ ${product.name}\n💰 Price: ${finalPrice} FCFA ${isPromoValid ? `(Discount -${DISCOUNT_AMOUNT} applied)` : ''}\n⏱ Duration: ${product.duration}\n🎟 Promo Code: ${code || 'None'}${isPromoValid ? ' ✅' : ''}\n\nPlease confirm your availability! 🙏`;

    try {
      // 1. Log to Supabase
      await supabase.from('partner_bookings').insert([{
        partner_name: "Gab's Nails",
        product_name: product.name,
        price: finalPrice,
        promo_code: code || null,
        customer_message: finalMessage
      }]);

      // 2. Notify DualVibe email
      const response = await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner: "Gab's Nails",
          product: product.name,
          price: finalPrice,
          promoCode: code + (isPromoValid ? ' (VALID)' : ''),
          message: finalMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Email API Error:', errorData);
        alert(`❌ ÉCHEC : L'email n'est pas parti.\nStatut : ${response.status}\nMessage : ${JSON.stringify(errorData.error || errorData)}`);
      } else {
        const successData = await response.json();
        console.log('Notification email sent successfully', successData);
        alert(`✅ SUCCÈS : Le signal d'envoi d'email a été accepté par Resend ! (Vérifiez votre boîte ${lang === 'fr' ? 'et vos spams' : 'and spams'})`);
      }
    } catch (error: any) {
      console.error('Tracking/Notification error:', error);
      alert(`Erreur technique lors de la réservation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setSelectedProduct(null);
      setPromoCode('');
      window.open(`https://wa.me/237695216458?text=${encodeURIComponent(finalMessage)}`, '_blank');
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
          className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full bg-gradient-to-tr from-[#84CC16] via-[#0EA5E9] to-[#84CC16] p-1.5 shadow-2xl shadow-[#84CC16]/40"
        >
          <img 
            src="/products/gabs-nails/logo.png" 
            alt="Gab's Nails Logo" 
            className="w-full h-full object-cover rounded-full bg-white" 
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-7xl font-display font-black tracking-tight"
        >
          Gab's <span className="gradient-text">Nails</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl font-bold text-[#84CC16]"
        >
          {lang === 'fr' ? "L'art de sublimer vos mains ✨" : "The art of enhancing your hands ✨"}
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg opacity-80 max-w-3xl mx-auto leading-relaxed"
        >
          {lang === 'fr' 
            ? "Spécialiste en pose d'ongles capsule et construction polygel. Que ce soit pour votre mariage, votre dot, une cérémonie ou tout simplement pour vous faire belle — Gab's Nails vous garantit un résultat impeccable et durable." 
            : "Specialist in capsule nail extensions and polygel construction. Whether for your wedding, traditional ceremony (dot), special event, or simply to treat yourself — Gab's Nails guarantees a flawless and long-lasting result."}
        </motion.p>

        {/* Social & Location badges */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <a 
            href="https://www.tiktok.com/@bla_ck020?_r=1&_t=ZS-95c7WFiUlG8" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
          >
            <TikTokIcon />
            {lang === 'fr' ? 'Suivre sur TikTok' : 'Follow on TikTok'}
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
          <div className="flex items-center gap-2 px-6 py-3 glass rounded-full font-bold">
            <MapPin className="w-5 h-5 text-[#84CC16]" />
            Cameroun
          </div>
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {[
          { key: 'all' as const, label: { fr: 'Tout voir', en: 'View All' } },
          { key: 'capsule' as const, label: { fr: 'Capsule + Vernis Gel', en: 'Capsule + Gel Polish' } },
          { key: 'polygel' as const, label: { fr: 'Construction Polygel', en: 'Polygel Construction' } },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
              activeFilter === f.key
                ? 'bg-gradient-to-r from-[#84CC16] to-[#0EA5E9] text-white shadow-lg shadow-[#84CC16]/30 scale-105'
                : 'glass hover:scale-105'
            }`}
          >
            {f.label[lang]}
          </button>
        ))}
      </motion.div>

      {/* Pricing Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="glass p-6 rounded-2xl mb-12 flex flex-wrap justify-center gap-8 text-center"
      >
        <div>
          <div className="text-2xl font-black gradient-text">2 000 - 2 500</div>
          <div className="text-xs font-bold opacity-60 mt-1">FCFA — Capsule + Vernis Gel</div>
        </div>
        <div className="w-px bg-white/10 hidden md:block" />
        <div>
          <div className="text-2xl font-black gradient-text">5 000 - 7 500</div>
          <div className="text-xs font-bold opacity-60 mt-1">FCFA — Construction Polygel</div>
        </div>
        <div className="w-px bg-white/10 hidden md:block" />
        <div>
          <div className="text-2xl font-black gradient-text">1h30 - 3h</div>
          <div className="text-xs font-bold opacity-60 mt-1">{lang === 'fr' ? 'Durée de pose' : 'Session Duration'}</div>
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod, idx) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(idx * 0.04, 0.6) }}
            whileHover={{ y: -8 }}
            className="glass rounded-3xl p-4 overflow-hidden group flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
              <img 
                src={prod.image} 
                alt={prod.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Duration badge */}
              <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-xl">
                <Clock className="w-3.5 h-3.5 text-[#84CC16]" /> {prod.duration}
              </div>

              {/* Category badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#84CC16] to-[#0EA5E9] text-white">
                {prod.category === 'capsule' ? '💅 Capsule' : '✨ Polygel'}
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg leading-tight">{prod.name}</h3>
                <p className="text-sm opacity-60 mt-1">
                  {prod.category === 'capsule' 
                    ? (lang === 'fr' ? 'Pose capsule avec finition vernis gel' : 'Capsule extensions with gel polish finish')
                    : (lang === 'fr' ? 'Construction solide et durable en polygel' : 'Solid and durable polygel construction')
                  }
                </p>
              </div>
              
              <div>
                <p className="text-2xl font-black gradient-text mb-3">{prod.price.toLocaleString()} FCFA</p>
                
                <button 
                  onClick={() => setSelectedProduct(prod)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/20"
                >
                  <WhatsAppIcon />
                  {lang === 'fr' ? 'Réserver cette pose' : 'Book This Session'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="glass p-12 md:p-16 rounded-[3rem] text-center mt-20 border-[#84CC16]/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#84CC16]/10 via-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Sparkles className="w-10 h-10 text-[#84CC16] mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 relative z-10">
          {lang === 'fr' ? 'Envie d\'ongles parfaits ?' : 'Want perfect nails?'}
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8 leading-relaxed relative z-10">
          {lang === 'fr'
            ? "Contactez Gab's Nails directement via WhatsApp pour réserver votre créneau. Service disponible pour mariages, dot, cérémonies et toute occasion spéciale !"
            : "Contact Gab's Nails directly via WhatsApp to book your session. Service available for weddings, traditional ceremonies and any special occasion!"}
        </p>
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <a 
            href="https://wa.me/237695216458" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-500/20 hover:scale-105 transition-transform"
          >
            <WhatsAppIcon />
            {lang === 'fr' ? 'Contacter via WhatsApp' : 'Contact via WhatsApp'}
          </a>
          <a 
            href="https://www.tiktok.com/@bla_ck020?_r=1&_t=ZS-95c7WFiUlG8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold text-lg border border-white/10 hover:scale-105 transition-transform"
          >
            <TikTokIcon />
            TikTok
          </a>
        </div>
      </motion.div>
      {/* Promo Code Modal */}
      <AnimatePresence>
        {selectedProduct && (
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
                <div className="w-16 h-16 bg-[#84CC16]/20 text-[#84CC16] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Code Promo ?</h3>
                <p className="opacity-70">
                  {lang === 'fr' 
                    ? "Avez-vous un code de réduction pour cette prestation ?" 
                    : "Do you have a discount code for this service?"}
                </p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text"
                  placeholder={lang === 'fr' ? "Entrez votre code (Optionnel)" : "Enter your code (Optional)"}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border rounded-2xl outline-none transition-all text-center font-bold tracking-widest ${
                    promoCode && VALID_PROMOS.some(p => p.toLowerCase() === promoCode.trim().toLowerCase())
                      ? 'border-green-500/50 text-green-400 bg-green-500/5'
                      : 'border-white/10 focus:border-[#84CC16]/50'
                  }`}
                />

                {promoCode && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center text-sm font-bold ${
                      VALID_PROMOS.some(p => p.toLowerCase() === promoCode.trim().toLowerCase())
                        ? 'text-green-500'
                        : 'text-[#84CC16]/60'
                    }`}
                  >
                    {VALID_PROMOS.some(p => p.toLowerCase() === promoCode.trim().toLowerCase())
                      ? (lang === 'fr' ? `✅ Code valide : -${DISCOUNT_AMOUNT} FCFA` : `✅ Valid code: -${DISCOUNT_AMOUNT} FCFA`)
                      : (lang === 'fr' ? 'Code non reconnu' : 'Code not recognized')}
                  </motion.p>
                )}
                
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleWhatsAppOrder(selectedProduct, promoCode)}
                  className="w-full py-4 bg-gradient-to-r from-[#84CC16] to-[#0EA5E9] text-white rounded-2xl font-bold shadow-xl shadow-[#84CC16]/20 hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {lang === 'fr' ? 'Continuer sur WhatsApp' : 'Continue to WhatsApp'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center opacity-40 uppercase tracking-widest">
                  Secure reservation via DualVibe Partner Link
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
