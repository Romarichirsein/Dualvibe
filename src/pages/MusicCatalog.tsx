import React, { useState } from 'react';
import { 
  Play, Pause, Download, Shield, Music, X, MessageCircle, ShoppingCart,
  Sparkles, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MUSIC_CATALOG, MUSIC_CATEGORIES, MusicTrack } from '../data/music';

interface MusicCatalogProps {
  lang: 'fr' | 'en';
  searchQuery?: string;
  addToCart: (product: any, option?: any) => void;
  openCart: () => void;
}

const CyberpunkGlitchText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`glitch-text-container ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className="glitch-layer glitch-layer-1" aria-hidden="true">{children}</span>
      <span className="glitch-layer glitch-layer-2" aria-hidden="true">{children}</span>
      <div className="cyber-scanline" />
    </div>
  );
};

export default function MusicCatalog({ lang, searchQuery = "", addToCart, openCart }: MusicCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  
  const [buyerName, setBuyerName] = useState("");
  const [projectUse, setProjectUse] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [musicCategory, setMusicCategory] = useState("");

  // Initialize form when track is selected
  React.useEffect(() => {
    if (selectedTrack) {
      setMusicCategory(selectedTrack.category);
      setLicenseType(lang === 'fr' ? "Licence Standard (2 000 FCFA - Usage Basique)" : "Standard License (2 000 FCFA - Basic Use)");
    }
  }, [selectedTrack, lang]);

  const t = {
    fr: {
      title: "Catalogue Musical Premium",
      subtitle: "Explorez notre collection de musiques, beats et ambiances sonores uniques. Disponibles sur mesure ou sous licence.",
      all: "Tout",
      nowPlaying: "En lecture",
      contactToBuy: "Obtenir cette piste",
      secure: "Écoute sécurisée",
      antiDownload: "Téléchargement désactivé",
      contact: "Contactez-nous sur WhatsApp pour acquérir les droits",
      formTitle: "Acquérir les droits",
      buyerName: "Votre Nom / Nom d'Artiste",
      projectUse: "Description de votre projet (Ex: Album, Vidéo YouTube, Publicité...)",
      license: "Type de Licence / Offre",
      licenses: [
        "Licence Standard (2 000 FCFA - Usage Basique)",
        "Licence Pro (5 000 FCFA - Monétisation)",
        "Droits Exclusifs (30 000 FCFA - Propriété Totale)"
      ],
      cancel: "Annuler",
      submit: "Ajouter au panier",
      categoryLabel: "Catégorie de musique",
      addedNotification: "Musique ajoutée au panier !",
      categories: {
        "Amapiano & Mbole": "Amapiano & Mbole",
        "Trap & Beats": "Trap & Beats",
        "Cinématique & Ambiance": "Cinématique & Ambiance",
        "Émotion & Amour": "Émotion & Amour",
        "Baptêmes": "Baptêmes",
        "Mariage": "Mariage",
        "Dot": "Dot",
        "Toquer porte": "Toquer porte",
        "Anniversaire": "Anniversaire",
        "Deuil": "Deuil",
        "Voir Bébé": "Voir Bébé",
        "Fiançailles": "Fiançailles",
        "Demande en Mariage": "Demande en Mariage",
        "Pardon": "Pardon",
        "Réconciliation": "Réconciliation",
        "Demandes de couples": "Demandes de couples",
        "Autres": "Autres"
      }
    },
    en: {
      title: "Premium Music Catalog",
      subtitle: "Explore our collection of unique music, beats, and soundscapes. Available custom-made or licensed.",
      all: "All",
      nowPlaying: "Now Playing",
      contactToBuy: "Get this track",
      secure: "Secure listening",
      antiDownload: "Download disabled",
      contact: "Contact us on WhatsApp to acquire rights",
      formTitle: "Acquire Rights",
      buyerName: "Your Name / Artist Name",
      projectUse: "Project Description (e.g. Album, YouTube Video, Ad...)",
      license: "License Type",
      licenses: [
        "Standard License (2 000 FCFA - Basic Use)",
        "Pro License (5 000 FCFA - Monetization)",
        "Exclusive Rights (30 000 FCFA - Full Ownership)"
      ],
      cancel: "Cancel",
      submit: "Add to Cart",
      categoryLabel: "Music Category",
      addedNotification: "Music added to cart!",
      categories: {
        "Amapiano & Mbole": "Amapiano & Mbole",
        "Trap & Beats": "Trap & Beats",
        "Cinématique & Ambiance": "Cinematic & Ambient",
        "Émotion & Amour": "Emotion & Love",
        "Baptêmes": "Baptisms",
        "Mariage": "Wedding",
        "Dot": "Dowry",
        "Toquer porte": "Traditional Proposal",
        "Anniversaire": "Birthday",
        "Deuil": "Mourning",
        "Voir Bébé": "Baby Arrival",
        "Fiançailles": "Engagement",
        "Demande en Mariage": "Marriage Proposal",
        "Pardon": "Apology",
        "Réconciliation": "Reconciliation",
        "Demandes de couples": "Couple Requests",
        "Autres": "Others"
      }
    }
  }[lang];

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrack) return;
    
    // Extract price from licenseType string (e.g. "2 000")
    const priceMatch = licenseType.match(/(\d[\d\s]*)/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/\s/g, '')) : 2000;

    const cartProduct = {
      id: `music-${selectedTrack.id}`, // Unique ID for shop logic
      title: { fr: selectedTrack.title, en: selectedTrack.title },
      price: price,
      category: { fr: "Catalogue Musical", en: "Music Catalog" },
      image: "/products/musique/Music_Pulse.jpg", // Default music pulse image or similar
      type: 'digital',
      date: new Date().toISOString().split('T')[0],
      description: { fr: `Licence pour : ${selectedTrack.title}`, en: `License for: ${selectedTrack.title}` },
      reviews: [],
      customMetadata: {
        buyerName,
        projectUse,
        licenseType,
        category: musicCategory,
        trackTitle: selectedTrack.title,
        trackId: selectedTrack.id
      }
    };

    addToCart(cartProduct);
    setSelectedTrack(null);
    openCart();
  };

  const normalize = (text: string) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredMusic = MUSIC_CATALOG.filter(track => {
    const matchesCategory = activeCategory === "Tout" || track.category === activeCategory;
    const normalizedSearch = normalize(searchQuery);
    const productText = normalize(`${track.title} ${track.category}`);
    const matchesSearch = normalizedSearch === "" || productText.includes(normalizedSearch);
    
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-extrabold mb-6 relative z-10"
          >
            <CyberpunkGlitchText>{t.title}</CyberpunkGlitchText>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-200 max-w-2xl mx-auto relative z-10"
          >
            {t.subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold text-pink-500"
          >
            <Shield className="w-4 h-4" />
            {t.antiDownload}
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {MUSIC_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                  : 'glass text-slate-600 dark:text-slate-200 hover:bg-pink-500/10'
              }`}
            >
              {category === "Tout" ? t.all : (t.categories[category as keyof typeof t.categories] || category)}
            </button>
          ))}
        </div>

        {/* Music Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMusic.map((track) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={track.id}
              className={`glass rounded-[2rem] p-6 transition-all border-2 ${
                playingTrack === track.id ? 'border-pink-500' : 'border-transparent hover:border-pink-500/30'
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  playingTrack === track.id
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-pink-500/10 text-pink-500'
                }`}>
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-1">
                    {track.title}
                  </h3>
                  <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                    {t.categories[track.category as keyof typeof t.categories] || track.category}
                  </span>
                </div>
              </div>

              {/* Audio Player (Anti-download logic) */}
              <div className="bg-slate-100 rounded-xl p-4 custom-audio-wrapper">
                <audio 
                  controls 
                  controlsList="nodownload noplaybackrate" 
                  onContextMenu={(e) => e.preventDefault()}
                  onPlay={() => setPlayingTrack(track.id)}
                  className="w-full h-10 outline-none"
                >
                  <source src={track.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
                <button 
                  onClick={() => setSelectedTrack(track)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-pink-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.contactToBuy}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredMusic.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-bold">
            Aucun résultat / No results
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative border border-slate-200 dark:border-white/10 form-glow-border"
            >
              <button 
                onClick={() => setSelectedTrack(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{t.formTitle}</h2>
              <p className="text-pink-500 font-bold mb-8 text-sm line-clamp-1">{selectedTrack.title}</p>

              <form onSubmit={handleAddToCart} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80 ml-2 text-black dark:text-white">{(t as any).categoryLabel}</label>
                  <input 
                    type="text" 
                    value={musicCategory}
                    onChange={(e) => setMusicCategory(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-black dark:text-white px-6 py-4 rounded-xl outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80 ml-2 text-black dark:text-white">{t.buyerName}</label>
                  <input 
                    type="text" 
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-black dark:text-white px-6 py-4 rounded-xl outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80 ml-2 text-black dark:text-white">{t.projectUse}</label>
                  <input 
                    type="text" 
                    value={projectUse}
                    onChange={(e) => setProjectUse(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-black dark:text-white px-6 py-4 rounded-xl outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold opacity-80 ml-2 text-black dark:text-white">{t.license}</label>
                  <select 
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-black dark:text-white px-6 py-4 rounded-xl outline-none"
                    required
                  >
                    {t.licenses.map((lic, index) => (
                      <option key={index} value={lic} className="text-black dark:text-white">{lic}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedTrack(null)}
                    className="flex-1 py-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>

    {/* Music Footer CTA */}
    <section className="py-20 border-t border-white/10 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-12 rounded-[3rem] border-white/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="inline-flex p-4 bg-purple-500/10 rounded-2xl text-purple-500 mb-6 animate-float">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl md:text-4xl font-display font-bold mb-6">
            {lang === 'fr' ? 'Besoin d\'une musique ' : 'Need a custom '}
            <span className="gradient-text">{lang === 'fr' ? 'Exclusivite ?' : 'Exclusivity?'}</span>
          </h3>
          <p className="text-slate-600 dark:text-slate-200 mb-10 opacity-80">
            {lang === 'fr' 
              ? 'Notre studio crée des compositions uniques adaptées à votre projet spécifique.'
              : 'Our studio creates unique compositions tailored to your specific project.'}
          </p>
          <Link to="/studio">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto shadow-xl shadow-purple-600/20"
            >
              <Music className="w-5 h-5" />
              {lang === 'fr' ? 'Contacter le Studio' : 'Contact the Studio'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  </>
  );
}
