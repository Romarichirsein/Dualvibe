import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, X, MessageCircle, Scissors, Eye } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', fr: 'Tout voir', en: 'View All' },
  { key: 'robe-mariage', fr: 'Robe de Mariage Traditionnel', en: 'Traditional Wedding Dress' },
  { key: 'robe-soiree', fr: 'Robe de Soirée', en: 'Evening Dress' },
  { key: 'survetement', fr: 'Survêtement', en: 'Tracksuit' },
  { key: 'tenue-cocktail', fr: 'Tenue de Cocktail', en: 'Cocktail Outfit' },
];

interface ChemsProduct {
  id: number;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  image: string;
  category: string;
}

const CHEMS_PRODUCTS: ChemsProduct[] = [
  // Robe de Mariage Traditionnel (5 images)
  ...[1,2,3,4,5].map((i) => ({
    id: i,
    name: { fr: `Robe de Mariage Traditionnel #${i}`, en: `Traditional Wedding Dress #${i}` },
    description: { fr: 'Robe de mariage traditionnel confectionnée sur mesure, alliant élégance et culture.', en: 'Custom-made traditional wedding dress, blending elegance and culture.' },
    image: `/products/chems/robe-mariage/${i}.jpeg`,
    category: 'robe-mariage',
  })),
  // Robe de Soirée (10 images)
  ...[1,2,3,4,5,6,7,8,9,10].map((i) => ({
    id: 10 + i,
    name: { fr: `Robe de Soirée #${i}`, en: `Evening Dress #${i}` },
    description: { fr: 'Robe de soirée élégante et raffinée, parfaite pour vos événements spéciaux.', en: 'Elegant and refined evening dress, perfect for your special events.' },
    image: `/products/chems/robe-soiree/${i}.jpeg`,
    category: 'robe-soiree',
  })),
  // Survêtement (4 images)
  ...[1,2,3,4].map((i) => ({
    id: 20 + i,
    name: { fr: `Survêtement #${i}`, en: `Tracksuit #${i}` },
    description: { fr: 'Survêtement moderne et confortable, conçu avec des tissus de qualité.', en: 'Modern and comfortable tracksuit, crafted with quality fabrics.' },
    image: `/products/chems/survetement/${i}.jpeg`,
    category: 'survetement',
  })),
  // Tenue de Cocktail (24 images)
  ...[...Array(24)].map((_, i) => ({
    id: 30 + i + 1,
    name: { fr: `Tenue de Cocktail #${i+1}`, en: `Cocktail Outfit #${i+1}` },
    description: { fr: 'Tenue de cocktail chic et tendance, idéale pour toutes les occasions.', en: 'Chic and trendy cocktail outfit, ideal for all occasions.' },
    image: `/products/chems/tenue-cocktail/${i+1}.jpeg`,
    category: 'tenue-cocktail',
  })),
];

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Chems({ lang }: { lang: 'fr' | 'en' }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<ChemsProduct | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<ChemsProduct | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = activeFilter === 'all'
    ? CHEMS_PRODUCTS
    : CHEMS_PRODUCTS.filter(p => p.category === activeFilter);

  const handleOrder = (product: ChemsProduct) => {
    const msg = lang === 'fr'
      ? `Bonjour CHEM'S ! ✂️\nJe viens de DualVibe et je suis intéressé(e) par :\n\n👗 ${product.name.fr}\n📂 Catégorie : ${CATEGORIES.find(c => c.key === product.category)?.fr}\n\nMerci de me confirmer les détails (prix, délai, mesures) ! 🙏`
      : `Hello CHEM'S! ✂️\nI'm coming from DualVibe and I'm interested in:\n\n👗 ${product.name.en}\n📂 Category: ${CATEGORIES.find(c => c.key === product.category)?.en}\n\nPlease confirm the details (price, timeline, measurements)! 🙏`;
    window.open(`https://wa.me/237655772944?text=${encodeURIComponent(msg)}`, '_blank');
    setSelectedProduct(null);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20 space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="w-36 h-36 md:w-44 md:h-44 mx-auto rounded-full bg-gradient-to-tr from-[#FF006E] via-[#00D1FF] to-[#FF006E] p-1.5 shadow-2xl shadow-[#FF006E]/40">
          <img src="/products/chems/logo.png" alt="CHEM'S Logo" className="w-full h-full object-cover rounded-full bg-white" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl md:text-7xl font-display font-black tracking-tight">
          CHEM'<span className="gradient-text">S</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-xl md:text-2xl font-bold text-[#FF006E]">
          {lang === 'fr' ? "La couture qui sublime votre élégance ✂️" : "Tailoring that elevates your elegance ✂️"}
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-lg opacity-80 max-w-3xl mx-auto leading-relaxed">
          {lang === 'fr'
            ? "Spécialiste en confection de robes de mariage traditionnel, robes de soirée, tenues de cocktail et survêtements. CHEM'S vous offre des créations sur-mesure qui allient style, qualité et authenticité."
            : "Specialist in traditional wedding dresses, evening gowns, cocktail outfits and tracksuits. CHEM'S offers custom creations that combine style, quality and authenticity."}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-wrap justify-center gap-4 pt-4">
          <a href="https://wa.me/237655772944" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-lg">
            <WhatsAppIcon />
            +237 6 55 77 29 44
          </a>
          <div className="flex items-center gap-2 px-6 py-3 glass rounded-full font-bold">
            <MapPin className="w-5 h-5 text-[#FF006E]" />
            Cameroun
          </div>
        </motion.div>
      </motion.div>

      {/* Category Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveFilter(cat.key)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
              activeFilter === cat.key
                ? 'bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white shadow-lg shadow-[#FF006E]/30 scale-105'
                : 'glass hover:scale-105'
            }`}
          >
            {cat[lang]}
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((prod, idx) => (
          <motion.div key={prod.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(idx * 0.04, 0.6) }} whileHover={{ y: -8 }} className="glass rounded-3xl p-4 overflow-hidden group flex flex-col">
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 cursor-pointer" onClick={() => setLightboxProduct(prod)}>
              <img src={prod.image} alt={prod.name[lang]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Category badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white">
                ✂️ {CATEGORIES.find(c => c.key === prod.category)?.[lang]}
              </div>
              {/* Eye icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg leading-tight">{prod.name[lang]}</h3>
                <p className="text-sm opacity-60 mt-1 line-clamp-2">{prod.description[lang]}</p>
              </div>
              <button onClick={() => setSelectedProduct(prod)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/20"
              >
                <WhatsAppIcon />
                {lang === 'fr' ? 'Commander' : 'Order Now'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass p-12 md:p-16 rounded-[3rem] text-center mt-20 border-[#FF006E]/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/10 via-[#00D1FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Scissors className="w-10 h-10 text-[#FF006E] mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl md:text-5xl font-display font-black mb-4 relative z-10">
          {lang === 'fr' ? "Envie d'une tenue sur-mesure ?" : 'Want a custom outfit?'}
        </h2>
        <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8 leading-relaxed relative z-10">
          {lang === 'fr'
            ? "Contactez CHEM'S directement via WhatsApp pour discuter de votre projet. Confection sur-mesure pour mariages, cérémonies, soirées et plus encore !"
            : "Contact CHEM'S directly via WhatsApp to discuss your project. Custom tailoring for weddings, ceremonies, parties and more!"}
        </p>
        <a href="https://wa.me/237655772944" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-500/20 hover:scale-105 transition-transform relative z-10">
          <WhatsAppIcon />
          {lang === 'fr' ? 'Contacter via WhatsApp' : 'Contact via WhatsApp'}
        </a>
      </motion.div>

      {/* Order Confirm Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md glass p-8 rounded-[2.5rem] border-white/10 shadow-2xl">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-6">
                <img src={selectedProduct.image} alt="" className="w-32 h-40 object-cover rounded-2xl mx-auto mb-4 shadow-lg" />
                <h3 className="text-xl font-bold mb-1">{selectedProduct.name[lang]}</h3>
                <p className="text-sm opacity-60">{selectedProduct.description[lang]}</p>
              </div>
              <button onClick={() => handleOrder(selectedProduct)}
                className="w-full py-4 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white rounded-2xl font-bold shadow-xl shadow-[#FF006E]/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <WhatsAppIcon />
                {lang === 'fr' ? 'Commander sur WhatsApp' : 'Order on WhatsApp'}
              </button>
              <p className="text-[10px] text-center opacity-40 uppercase tracking-widest mt-4">
                Secure order via DualVibe Partner Link
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxProduct(null)} className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer">
            <button onClick={() => setLightboxProduct(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10">
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={lightboxProduct.image} alt={lightboxProduct.name[lang]} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
