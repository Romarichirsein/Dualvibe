import React, { useState } from 'react';
import { 
  Music, Heart, Users, MessageCircle, X, Sparkles, Send, Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MUSIC_PACKS, MusicType, MusicPack } from '../data/music';
import { CyberpunkGlitchText } from '../components/CyberpunkGlitchText';

interface MusicCatalogProps {
  lang: 'fr' | 'en';
}

export default function MusicCatalog({ lang }: MusicCatalogProps) {
  const [selectedType, setSelectedType] = useState<{type: MusicType, pack: MusicPack} | null>(null);
  
  // Form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [projectDetails, setProjectDetails] = useState("");

  const t = {
    fr: {
      title: "CRÉATION DE MUSIQUES",
      subtitle: "DES MUSIQUES UNIQUES POUR CHAQUE MOMENT DE VIE",
      fromPrice: "À PARTIR DE 2000 FCFA",
      orderNow: "COMMANDER MAINTENANT",
      contactWhatsApp: "SUR WHATSAPP",
      features: ["DISCRÉTION", "QUALITÉ", "ÉMOTION"],
      slogan: "VOTRE HISTOIRE, NOTRE MUSIQUE.",
      formTitle: "Commander une musique",
      nameLabel: "Votre Nom",
      phoneLabel: "Numéro de téléphone",
      detailsLabel: "Détails du projet (Émotions, contexte, cibles...)",
      cancel: "Annuler",
      submit: "Envoyer sur WhatsApp",
      pack1Icon: <Gift className="w-8 h-8" />,
      pack2Icon: <Heart className="w-8 h-8" />
    },
    en: {
      title: "MUSIC CREATION",
      subtitle: "UNIQUE MUSIC FOR EVERY MOMENT OF LIFE",
      fromPrice: "STARTING FROM 2000 FCFA",
      orderNow: "ORDER NOW",
      contactWhatsApp: "ON WHATSAPP",
      features: ["DISCRETION", "QUALITY", "EMOTION"],
      slogan: "YOUR STORY, OUR MUSIC.",
      formTitle: "Order a custom track",
      nameLabel: "Your Name",
      phoneLabel: "Phone Number",
      detailsLabel: "Project Details (Emotions, context, target...)",
      cancel: "Cancel",
      submit: "Send on WhatsApp",
      pack1Icon: <Gift className="w-8 h-8" />,
      pack2Icon: <Heart className="w-8 h-8" />
    }
  }[lang];

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    
    let message = `🎵 *NOUVELLE DEMANDE DE MUSIQUE - DUALVIBE*\n\n`;
    message += `*Pack :* ${selectedType.pack.title} - ${selectedType.pack.subtitle}\n`;
    message += `*Type :* ${selectedType.type.name}\n\n`;
    message += `*Client :* ${clientName}\n`;
    message += `*Téléphone :* ${clientPhone}\n\n`;
    message += `*Détails du projet :*\n${projectDetails}\n\n`;
    message += `_Via DualVibe Marketplace_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/12896301143?text=${encodedMessage}`, '_blank');
    setSelectedType(null); // Close modal
  };

  return (
    <>
      <section className="pt-32 md:pt-40 pb-20 min-h-screen relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF006E]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D1FF]/10 blur-[120px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full text-[#FF006E] font-bold text-sm mb-8 uppercase tracking-widest border border-[#FF006E]/30"
            >
              <Sparkles className="w-4 h-4" />
              DualVibe Marketplace
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 tracking-tight uppercase"
            >
              <CyberpunkGlitchText>{t.title}</CyberpunkGlitchText>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-slate-400 font-bold uppercase tracking-widest"
            >
              {t.subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF006E] to-[#00D1FF] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass bg-black/50 border-2 border-[#FF006E]/50 px-8 py-4 rounded-[2rem] flex items-center justify-center gap-4">
                <span className="text-2xl font-bold text-white">{t.fromPrice}</span>
              </div>
            </motion.div>
          </div>

          {/* Packs Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {MUSIC_PACKS.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="glass rounded-[3rem] p-8 md:p-10 border-2 border-white/10 hover:border-[#FF006E]/30 transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   {index === 0 ? t.pack1Icon : t.pack2Icon}
                </div>

                {/* Pack Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF006E] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-[#FF006E]/30">
                    {pack.title.replace('PACK ', '0')}
                  </div>
                  <div>
                    <h2 className="text-sm text-[#FF006E] font-bold tracking-widest uppercase">PACK</h2>
                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{pack.subtitle}</h3>
                  </div>
                </div>

                {/* SubCategories */}
                <div className="space-y-8">
                  {pack.subCategories.map((sub) => (
                    <div key={sub.id} className="relative pl-6 border-l-2 border-white/10 group-hover:border-[#FF006E]/30 transition-colors">
                      <div className="absolute w-3 h-3 rounded-full bg-[#FF006E] -left-[7px] top-1.5 shadow-[0_0_10px_rgba(255,0,110,0.5)]" />
                      <h4 className="text-[#00D1FF] font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                        {sub.title}
                      </h4>
                      <ul className="space-y-3">
                        {sub.types.map((type) => (
                          <li key={type.id}>
                            <button
                              onClick={() => setSelectedType({ type, pack })}
                              className="w-full text-left flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#FF006E]/10 border border-transparent hover:border-[#FF006E]/30 transition-all group/btn"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-slate-500 group-hover/btn:bg-[#00D1FF] transition-colors" />
                                <span className="text-slate-300 group-hover/btn:text-white font-medium">{type.name}</span>
                              </div>
                              <span className="text-xs font-bold text-[#FF006E] opacity-0 group-hover/btn:opacity-100 transition-opacity flex items-center gap-1">
                                {t.orderNow} <Sparkles className="w-3 h-3" />
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Features */}
          <div className="mt-20 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8">
              {t.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 font-bold tracking-widest">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[#FF006E]">✓</div>
                  {feature}
                </div>
              ))}
            </div>
            <p className="text-2xl md:text-3xl font-display font-black gradient-text uppercase tracking-widest">
              {t.slogan}
            </p>
          </div>

        </div>

        {/* Order Modal */}
        <AnimatePresence>
          {selectedType && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#0f172a] rounded-[3rem] p-8 w-full max-w-lg shadow-2xl relative border border-white/10 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF006E] to-[#00D1FF]" />
                
                <button 
                  onClick={() => setSelectedType(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#FF006E] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white uppercase mb-2">{t.formTitle}</h2>
                  <p className="text-slate-400 text-sm">Vous avez sélectionné :</p>
                  <p className="text-[#00D1FF] font-bold text-lg mt-1">{selectedType.type.name}</p>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-2">{t.nameLabel}</label>
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 focus:border-[#FF006E]/50 transition-colors placeholder:text-slate-600" 
                      required
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-2">{t.phoneLabel}</label>
                    <input 
                      type="tel" 
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 focus:border-[#FF006E]/50 transition-colors placeholder:text-slate-600" 
                      required
                      placeholder="+237 6XX XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-2">{t.detailsLabel}</label>
                    <textarea 
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      className="w-full bg-white/5 text-white px-6 py-4 rounded-2xl outline-none border border-white/10 focus:border-[#FF006E]/50 transition-colors resize-none h-32 placeholder:text-slate-600" 
                      required
                      placeholder="Décrivez l'ambiance, à qui s'adresse la musique, l'histoire à raconter..."
                    />
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedType(null)}
                      className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-2xl font-bold shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {t.submit}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
