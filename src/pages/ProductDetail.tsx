import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Music, Play, Pause } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { PRODUCTS, Product, ProductOption, Review } from '../data/products';
import { Country } from '../data/countries';
import { ReviewSection } from '../components/ReviewSection';
import { ImageGallery } from '../components/ImageGallery';

type Language = 'fr' | 'en';

export const ProductDetail = ({ 
  lang, 
  country, 
  addToCart 
}: { 
  lang: Language; 
  country: Country; 
  addToCart: (p: Product, o?: ProductOption) => void 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const p = PRODUCTS.find(p => String(p.id) === String(id));
    if (p) {
      setProduct(p);
      if (p.options && p.options.length > 0) {
        setSelectedOption(p.options[0]);
      }
    }
    else navigate('/shop');
  }, [id, navigate]);

  if (!product) return null;

  const currentPrice = selectedOption ? selectedOption.price : product.price;

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setProduct(prev => prev ? { ...prev, reviews: [review, ...prev.reviews] } : null);
  };

  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ImageGallery 
            images={product.images} 
            mainImage={product.image} 
            title={product.title[lang]} 
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="glass px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#FF006E]">
                  {product.category[lang]}
                </span>
                <span className="glass px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
                  {t[product.type]}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold">{product.title[lang]}</h1>
              <div className="text-3xl md:text-4xl font-display font-extrabold gradient-text">
                {Math.round(currentPrice * country.rate)} {country.symbol}
              </div>
            </div>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-200 leading-relaxed">
              {product.description[lang]}
            </p>

            {product.audioPreview && (
              <div className="glass p-6 rounded-3xl flex flex-col gap-4 bg-[#FF006E]/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF006E]/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-14 h-14 bg-gradient-to-tr from-[#FF006E] to-[#00D1FF] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#FF006E]/30"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </motion.button>
                  <div>
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <Music className="w-4 h-4 text-[#FF006E]" />
                      Extrait Audio
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Écoutez un aperçu du style musical</p>
                  </div>
                </div>
                {/* Audio Element Hidden */}
                <audio 
                  ref={audioRef} 
                  src={product.audioPreview} 
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            )}

            {/* Music Catalog CTA */}
            {[49, 50, 51, 52].includes(Number(product.id)) && (
              <Link 
                to="/music-catalog" 
                className="w-full py-4 mt-2 mb-2 bg-[#FF006E]/10 border border-[#FF006E]/30 text-[#FF006E] rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors hover:bg-[#FF006E] hover:text-white"
              >
                <Music className="w-5 h-5" />
                DÉCOUVRIR LE CATALOGUE MUSICAL
              </Link>
            )}

            {product.options && product.options.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wider opacity-80">{t.options || 'Options'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedOption(opt)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center ${selectedOption?.label === opt.label ? 'border-[#FF006E] bg-[#FF006E]/10' : 'border-white/10 hover:border-white/30'}`}
                    >
                      <span className="font-bold">{opt.label}</span>
                      <span className="text-sm opacity-80">{Math.round(opt.price * country.rate)} {country.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart(product, selectedOption)}
              className="w-full py-5 md:py-6 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white rounded-2xl font-bold text-lg md:text-xl shadow-xl shadow-[#FF006E]/20 flex items-center justify-center gap-4 transition-all"
            >
              <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
              {t.addToCart}
            </motion.button>

            <ReviewSection 
              reviews={product.reviews} 
              lang={lang} 
              onAddReview={handleAddReview} 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
