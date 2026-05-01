import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Camera, 
  Video, 
  Palette, 
  Upload, 
  Link as LinkIcon, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  Send,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudioProps {
  lang: 'fr' | 'en';
}

import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';

const TRANSLATIONS = {
  fr: {
    studioTitle: "Espace Créatif & Personnalisation",
    studioSubtitle: "Donnez vie à vos idées. Configurez vos projets sur-mesure et notre équipe d'experts s'occupe du reste.",
    musicCustom: "Musique Sur-Mesure",
    photoCustom: "Retouche & Image",
    videoCustom: "Montage Vidéo",
    designCustom: "Design Graphique",
    startCustom: "Personnaliser",
    uploadDrop: "Cliquez ou glissez vos fichiers ici (Photos, maquettes, sons...)",
    projectDetails: "Détails du projet",
    projectLinks: "Liens (Drive, WeTransfer...)",
    sendStudio: "Envoyer ma demande au Studio",
    musicDesc: "Compositions originales, beats, jingles et identités sonores.",
    photoDesc: "Retouche haute-fidélité, restauration et traitement d'images pro.",
    videoDesc: "Montage dynamique, étalonnage et effets visuels pour vos contenus.",
    designDesc: "Logos, chartes graphiques, affiches et identité visuelle complète.",
    placeholderDetails: "Décrivez votre vision, le style, les couleurs, l'ambiance...",
    placeholderLinks: "Collez ici les liens vers vos fichiers sources ou références."
  },
  en: {
    studioTitle: "Creative Studio & Customization",
    studioSubtitle: "Bring your ideas to life. Configure your custom projects and our team of experts handles the rest.",
    musicCustom: "Custom Music",
    photoCustom: "Retouching & Image",
    videoCustom: "Video Editing",
    designCustom: "Graphic Design",
    startCustom: "Customize Now",
    uploadDrop: "Click or drag your files here (Photos, mockups, sounds...)",
    projectDetails: "Project Details",
    projectLinks: "Links (Drive, WeTransfer...)",
    sendStudio: "Send Request to Studio",
    musicDesc: "Original compositions, beats, jingles, and sonic identities.",
    photoDesc: "High-fidelity retouching, restoration, and pro image processing.",
    videoDesc: "Dynamic editing, grading, and visual effects for your content.",
    designDesc: "Logos, brand identities, posters, and full visual identity.",
    placeholderDetails: "Describe your vision, style, colors, mood...",
    placeholderLinks: "Paste links to your source files or references here."
  }
};

type CategoryId = 'photo' | 'video' | 'design';

export default function Studio({ lang }: StudioProps) {
  const t = TRANSLATIONS[lang];
  const [activeCategory, setActiveCategory] = useState<CategoryId>('photo');
  const [details, setDetails] = useState('');
  const [links, setLinks] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const categories = [
    { id: 'photo' as CategoryId, icon: Camera, title: t.photoCustom, desc: t.photoDesc, color: 'from-blue-500 to-cyan-500' },
    { id: 'video' as CategoryId, icon: Video, title: t.videoCustom, desc: t.videoDesc, color: 'from-[#00D1FF] to-[#00D1FF]' },
    { id: 'design' as CategoryId, icon: Palette, title: t.designCustom, desc: t.designDesc, color: 'from-orange-500 to-yellow-500' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find(c => c.id === activeCategory);
    
    let message = `🚀 *NOUVELLE DEMANDE STUDIO - DUALVIBE*\n\n`;
    message += `*Service :* ${category?.title}\n`;
    message += `*Détails :*\n${details}\n\n`;
    
    if (links) {
      message += `*Liens :*\n${links}\n\n`;
    }
    
    if (files.length > 0) {
      message += `*Fichiers joints (UI) :* ${files.map(f => f.name).join(', ')}\n\n`;
    }
    
    message += `Merci de me recontacter pour discuter du devis et des délais.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/12896301143?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
    <div className="pt-32 md:pt-40 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-[#FF006E] font-bold text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            DualVibe Studio
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <CyberpunkGlitchText className="text-4xl md:text-7xl font-display font-black mb-6">
              {t.studioTitle}
            </CyberpunkGlitchText>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-medium lead-relaxed">
              {t.studioSubtitle}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Categories Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-6 rounded-[2rem] transition-all flex items-center gap-6 group relative overflow-hidden ${
                  activeCategory === cat.id 
                    ? 'glass border-[#FF006E]/50 shadow-xl' 
                    : 'glass border-transparent opacity-60 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div 
                    layoutId="active-bg"
                    className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-5`}
                  />
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                  activeCategory === cat.id ? `bg-gradient-to-tr ${cat.color} text-white shadow-lg` : 'bg-slate-500/10'
                }`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
                  <p className="text-xs opacity-70 leading-relaxed">{cat.desc}</p>
                </div>
                {activeCategory === cat.id && (
                  <ChevronRight className="w-5 h-5 ml-auto text-[#FF006E]" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden form-glow-border"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${categories.find(c => c.id === activeCategory)?.color} opacity-[0.03] blur-3xl -mr-32 -mt-32`} />
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest opacity-60 ml-2 flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-[#FF006E]" />
                       {t.projectDetails}
                    </label>
                    <textarea 
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={t.placeholderDetails}
                      className="w-full glass bg-white/5 border border-white/10 rounded-[2rem] p-6 h-48 outline-none focus:border-[#FF006E]/50 transition-all resize-none text-lg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-widest opacity-60 ml-2 flex items-center gap-2">
                         <LinkIcon className="w-4 h-4 text-[#FF006E]" />
                         {t.projectLinks}
                      </label>
                      <input 
                        type="text"
                        value={links}
                        onChange={(e) => setLinks(e.target.value)}
                        placeholder={t.placeholderLinks}
                        className="w-full glass bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#FF006E]/50 transition-all"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-widest opacity-60 ml-2 flex items-center gap-2">
                         <Upload className="w-4 h-4 text-[#FF006E]" />
                         Fichiers (UI Only)
                      </label>
                      <div className="relative group/upload">
                        <input 
                          type="file" 
                          multiple 
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        <div className="glass bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 group-hover/upload:border-[#FF006E]/50 transition-all">
                          <Upload className="w-5 h-5 opacity-40 group-hover/upload:text-[#FF006E]" />
                          <span className="text-xs font-bold opacity-40 group-hover/upload:opacity-100">
                            {files.length > 0 ? `${files.length} fichiers sélectionnés` : t.uploadDrop}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-6 bg-gradient-to-r from-[#FF006E] via-[#00D1FF] to-[#00D1FF] text-white rounded-[2rem] font-extrabold text-xl shadow-xl shadow-[#FF006E]/20 flex items-center justify-center gap-4 transition-all group"
                  >
                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    {t.sendStudio}
                    <MessageCircle className="w-6 h-6 opacity-40" />
                  </motion.button>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Studio Footer CTA */}
      <section className="py-20 mt-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[3rem] border-white/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF006E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h3 className="text-2xl md:text-4xl font-display font-bold mb-6 relative z-10">
              {lang === 'fr' ? 'Prêt à explorer notre ' : 'Ready to explore our '}
              <span className="gradient-text">{lang === 'fr' ? 'Boutique ?' : 'Shop?'}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-200 mb-10 relative z-10">
              {lang === 'fr' 
                ? 'Découvrez des centaines de produits digitaux et physiques prêts à l\'emploi.'
                : 'Discover hundreds of ready-to-use digital and physical products.'}
            </p>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#FF006E] text-white rounded-2xl font-bold flex items-center gap-3 mx-auto relative z-10 shadow-xl shadow-[#FF006E]/20"
              >
                <ShoppingCart className="w-5 h-5" />
                {lang === 'fr' ? 'Aller à la Boutique' : 'Go to Shop'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
