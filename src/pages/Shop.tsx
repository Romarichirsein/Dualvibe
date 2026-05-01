import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Menu, X, Package } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { PRODUCTS, Product } from '../data/products';
import { Country } from '../data/countries';
import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';
import { ProductCard } from '../components/ProductCard';
import { slugify } from '../utils/slugify';

type Language = 'fr' | 'en';
type SortOption = 'newest' | 'priceLow' | 'priceHigh' | 'alpha';

export const Shop = ({ 
  lang, 
  country, 
  addToCart, 
  searchQuery, 
  setSearchQuery 
}: { 
  lang: Language; 
  country: Country; 
  addToCart: (p: Product, option?: any) => void;
  searchQuery: string; 
  setSearchQuery: (q: string) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const normalize = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const categories = useMemo(() => {
    const cats = new Set(PRODUCTS.map(p => p.category[lang]));
    return ['all', ...Array.from(cats)];
  }, [lang]);

  // Sync category with URL slug
  useEffect(() => {
    let extractedSlug = '';
    if (location.pathname.startsWith('/shop-')) {
      extractedSlug = location.pathname.substring(6);
    } else if (location.pathname.startsWith('/shop/')) {
      extractedSlug = location.pathname.substring(6);
    }
    
    if (extractedSlug) {
      const match = categories.find(cat => slugify(cat) === extractedSlug);
      if (match) {
        setCategory(match);
      } else {
        setCategory('all');
      }
    } else {
      setCategory('all');
    }
  }, [location.pathname, categories]);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const normalizedSearch = normalize(searchQuery);
      const searchTerms = normalizedSearch.split(' ').filter(t => t.length > 0);
      
      const productText = normalize(`${p.title[lang]} ${p.category[lang]} ${p.description[lang]}`);
      const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => productText.includes(term));
      
      const matchesType = filter === 'all' || p.type === filter;
      const matchesCategory = category === 'all' || normalize(p.category[lang]) === normalize(category);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesType && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'priceLow':
        result.sort((a, b) => (a.price * (country?.rate || 1)) - (b.price * (country?.rate || 1)));
        break;
      case 'priceHigh':
        result.sort((a, b) => (b.price * (country?.rate || 1)) - (a.price * (country?.rate || 1)));
        break;
      case 'alpha':
        result.sort((a, b) => a.title[lang].localeCompare(b.title[lang]));
        break;
    }

    return result;
  }, [searchQuery, filter, category, priceRange, lang, sortBy, country?.rate]);

  return (
    <section className="pt-32 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Shop Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight">
            <CyberpunkGlitchText>
              <span className="gradient-text">{(t as any).shopHeroTitle || (lang === 'fr' ? 'Boutique' : 'Shop')}</span>
            </CyberpunkGlitchText>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto opacity-80 leading-relaxed font-medium">
            {(t as any).shopHeroSubtitle || (lang === 'fr' ? 'Découvrez nos produits' : 'Discover our products')}
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] mx-auto rounded-full blur-[1px]" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h2 className="text-2xl font-display font-bold">{t.shop}</h2>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFilterDrawerOpen(true)}
              className="glass px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm"
            >
              <Menu className="w-4 h-4" />
              {t.categories}
            </motion.button>
          </div>

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:w-64 space-y-8">
            <div className="glass p-6 rounded-3xl space-y-6 sticky top-32">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.search}</h3>
                <div className="flex items-center glass px-4 py-2 rounded-xl gap-2 border-white/5 focus-within:border-[#FF006E]/50 transition-all">
                  <Search className="w-4 h-4 opacity-80" />
                  <input 
                    type="text" 
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.categories}</h3>
                <div className="space-y-1.5 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                  {categories.map(cat => (
                    <motion.button
                      key={cat}
                      whileHover={{ x: 6, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const slug = cat === 'all' ? '' : slugify(cat);
                        if (slug) {
                          navigate(`/shop-${slug}`);
                        } else {
                          navigate('/shop');
                        }
                        setSearchQuery('');
                        setIsFilterDrawerOpen(false);

                      }}

                      className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all relative group overflow-hidden ${category === cat ? 'bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white shadow-lg shadow-[#FF006E]/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="truncate">{cat === 'all' ? t.all : cat}</span>
                        {category === cat && <motion.div layoutId="activeCat" className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.priceRange}</h3>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="2000000" 
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF006E]"
                  />
                  <div className="flex justify-between text-xs font-bold">
                    <span>0 {country.symbol}</span>
                    <span>{Math.round(priceRange[1] * country.rate).toLocaleString()} {country.symbol}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Filter Drawer (Mobile) */}
          <AnimatePresence>
            {isFilterDrawerOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 left-0 h-full w-80 glass z-[110] p-8 lg:hidden"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">{t.categories}</h2>
                    <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.search}</h3>
                      <div className="flex items-center glass px-4 py-2 rounded-xl gap-2 border-white/5">
                        <Search className="w-4 h-4 opacity-80" />
                        <input 
                          type="text" 
                          placeholder={t.search}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none outline-none text-sm w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-4">{t.categories}</h3>
                      <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              const slug = cat === 'all' ? '' : slugify(cat);
                              if (slug) {
                                navigate(`/shop-${slug}`);
                              } else {
                                navigate('/shop');
                              }
                              setSearchQuery('');
                              setIsFilterDrawerOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all ${category === cat ? 'bg-gradient-to-r from-[#FF006E] to-[#00D1FF] text-white' : ''}`}
                          >
                            {cat === 'all' ? t.all : cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex glass p-1 rounded-2xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                {(['all', 'physical', 'digital'] as const).map((f) => (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(f)}
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-[#FF006E] text-white shadow-lg shadow-[#FF006E]/20' : 'hover:bg-white/5'}`}
                  >
                    {t[f as keyof typeof t]}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs font-bold opacity-80">{t.sortBy}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none outline-none text-sm font-bold cursor-pointer"
                >
                  <option value="newest" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.newest}</option>
                  <option value="priceLow" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.priceLow}</option>
                  <option value="priceHigh" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.priceHigh}</option>
                  <option value="alpha" className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{t.alpha}</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  key={`${category}-${filter}-${searchQuery}`}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
                >
                  {filteredProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      layout
                    >
                      <ProductCard product={p} lang={lang} country={country} addToCart={addToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 glass rounded-[3rem] text-center"
                >
                  <div className="w-20 h-20 bg-[#FF006E]/10 rounded-3xl flex items-center justify-center text-[#FF006E] mb-6">
                    <Package className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}</h3>
                  <p className="opacity-60">{lang === 'fr' ? 'Essayez de modifier vos filtres ou votre recherche.' : 'Try adjusting your filters or search.'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
