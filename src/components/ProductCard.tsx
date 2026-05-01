import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, FileDigit, Package } from 'lucide-react';
import { Product, ProductOption } from '../data/products';
import { Country } from '../data/countries';
import { TRANSLATIONS } from '../data/translations';

type Language = 'fr' | 'en';

export const ProductCard = ({ 
  product, 
  lang, 
  country, 
  addToCart 
}: { 
  product: Product, 
  lang: Language, 
  country: Country, 
  addToCart: (p: Product, o?: ProductOption) => void 
}) => {
  const t = TRANSLATIONS[lang];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className="glass rounded-[2rem] p-4 group relative overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
        <img 
          src={product.image} 
          alt={product.title[lang]} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
          {product.type === 'digital' ? <FileDigit className="w-3 h-3" /> : <Package className="w-3 h-3" />}
          {t[product.type]}
        </div>
      </Link>
      <div className="px-2">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors line-clamp-1">{product.title[lang]}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {product.options && product.options.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t.startingFrom}</span>
            )}
            <div className="text-2xl font-display font-extrabold">
              {Math.round(product.price * country.rate)} <span className="text-sm font-bold text-pink-500">{country.symbol}</span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, product.options?.[0])}
            className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-lg hover:shadow-pink-500/40"
          >
            <ShoppingCart className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
