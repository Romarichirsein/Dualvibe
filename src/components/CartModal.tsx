import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Package, Trash2, Zap, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Product, ProductOption } from '../data/products';
import { Country } from '../data/countries';
import { TRANSLATIONS } from '../data/translations';

type Language = 'fr' | 'en';

export interface CartItem extends Product {
  quantity: number;
  selectedOption?: ProductOption;
  customMetadata?: {
    category?: string;
    licenseType?: string;
    buyerName?: string;
    projectUse?: string;
  };
}

export const CartModal = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeItem, 
  lang, 
  country 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: CartItem[]; 
  updateQuantity: (id: number | string, delta: number, optionLabel?: string) => void;
  removeItem: (id: number | string, optionLabel?: string) => void;
  lang: Language;
  country: Country;
}) => {
  const t = TRANSLATIONS[lang];
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  
  const [showCvForm, setShowCvForm] = useState(false);
  const [cvData, setCvData] = useState({
    fullName: '', phone: '', address: '', profile: '', experience: '', education: '', skills: '', languages: ''
  });

  const [showMusicForm, setShowMusicForm] = useState(false);
  const [musicData, setMusicData] = useState({
    category: '', event: '', emotion: '', target: '', story: ''
  });

  const VALID_PROMOS = ['Princestore', 'Baecstore', 'Mervistore', 'Gicostore', 'Ashstore'];
  const DISCOUNT_AMOUNT = 300; 

  const handleApplyPromo = () => {
    if (appliedPromo) {
      setPromoError((t as any).promoAlreadyUsed);
      setPromoInput('');
      return;
    }
    const found = VALID_PROMOS.find(p => p.toLowerCase() === promoInput.trim().toLowerCase());
    if (found) {
      setAppliedPromo(found);
      setPromoError(null);
      setPromoInput('');
    } else {
      setPromoError(t.invalidPromo);
    }
  };
  
  const total = cart.reduce((acc, item) => {
    const price = item.selectedOption ? item.selectedOption.price : item.price;
    return acc + (price * item.quantity);
  }, 0);
  const discount = appliedPromo ? DISCOUNT_AMOUNT : 0;
  const finalTotal = Math.max(0, total - discount);
  
  const convertedTotal = Math.round(finalTotal * (country.rate || 1));
  const convertedDiscount = Math.round(discount * (country.rate || 1));

  const handleCheckout = () => {
    const hasCvProduct = cart.some(item => item.id === 13 || item.id === 14);
    const hasMusicProduct = cart.some(item => [100, 101].includes(Number(item.id)));
    
    if (hasCvProduct && !showCvForm) {
      setShowCvForm(true);
      return;
    }
    if (hasMusicProduct && !showMusicForm) {
      setShowMusicForm(true);
      return;
    }

    let message = t.orderMessage;
    cart.forEach(item => {
      const price = item.selectedOption ? item.selectedOption.price : item.price;
      const title = item.selectedOption ? `${item.title[lang]} (${item.selectedOption.label})` : item.title[lang];
      message += `- ${title} (x${item.quantity}) : ${Math.round(price * country.rate)} ${country.symbol}\n`;
      
      if (item.customMetadata) {
        const meta = item.customMetadata;
        const labels = lang === 'fr' ? { cat: 'Catégorie', lic: 'Licence', name: 'Nom', proj: 'Projet' } : { cat: 'Category', lic: 'License', name: 'Name', proj: 'Project' };
        if (meta.category) message += `  [${labels.cat}: ${meta.category}]\n`;
        if (meta.licenseType) message += `  [${labels.lic}: ${meta.licenseType}]\n`;
        if (meta.buyerName) message += `  [${labels.name}: ${meta.buyerName}]\n`;
        if (meta.projectUse) message += `  [${labels.proj}: ${meta.projectUse}]\n`;
      }
    });
    
    if (appliedPromo) message += `${t.promoUsed}${appliedPromo} (-${convertedDiscount} ${country.symbol})\n`;
    message += `${t.orderTotal} ${convertedTotal} ${country.symbol}`;
    
    if (hasCvProduct && showCvForm) {
      message += `\n\n--- INFORMATIONS CV ---\nNom Complet: ${cvData.fullName}\nTéléphone: ${cvData.phone}\nAdresse: ${cvData.address}\n\nProfil:\n${cvData.profile}\n\nExpériences:\n${cvData.experience}\n\nFormations:\n${cvData.education}\n\nCompétences:\n${cvData.skills}\n\nLangues:\n${cvData.languages}\n`;
    }

    if (hasMusicProduct && showMusicForm) {
      message += `\n\n--- INSTRUCTIONS MUSICALES ---\nCatégorie: ${musicData.category}\nType: ${musicData.event}\nDestinataire: ${musicData.target}\nÉmotions: ${musicData.emotion}\n\nHistoire:\n${musicData.story}\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/12896301143?text=${encodedMessage}`, '_blank');
  };

  const musicPacksConfig = {
    'fr': {
      'Pack Cérémonies & Événements Sociaux': ["Mariage & Mariage Coutumier", "Célébrations", "Soutien & Recueillement"],
      'Pack Relations & Communication Personnelle': ["Pardon & Réconciliation", "Demandes de couples"]
    },
    'en': {
      'Ceremonies & Social Events Pack': ["Wedding & Customary Wedding", "Celebrations", "Support & Remembrance"],
      'Relations & Personal Communication Pack': ["Forgiveness & Reconciliation", "Couple Requests"]
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <ShoppingCart className="text-pink-500" />
                {showMusicForm ? (t as any).musicFormTitle : showCvForm ? (t as any).cvFormTitle : t.cart}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {showMusicForm ? (
                <div className="space-y-4">
                  <p className="text-sm opacity-80 mb-4">{(t as any).musicFormDesc}</p>
                  <div className="space-y-4">
                    <select 
                      value={musicData.category} 
                      onChange={e => setMusicData({...musicData, category: e.target.value, event: ''})}
                      className="w-full glass px-4 py-3 rounded-xl outline-none appearance-none"
                    >
                      <option value="" disabled>{(t as any).musicCategory}</option>
                      {Object.keys(musicPacksConfig[lang]).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {musicData.category && (
                      <select 
                        value={musicData.event} 
                        onChange={e => setMusicData({...musicData, event: e.target.value})}
                        className="w-full glass px-4 py-3 rounded-xl outline-none appearance-none"
                      >
                        <option value="" disabled>{(t as any).musicSubCategory}</option>
                        {musicPacksConfig[lang][musicData.category as keyof typeof musicPacksConfig['fr']].map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    )}

                    <input type="text" placeholder={(t as any).musicEvent} value={musicData.target} onChange={e => setMusicData({...musicData, target: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none" />
                    <input type="text" placeholder={(t as any).musicEmotion} value={musicData.emotion} onChange={e => setMusicData({...musicData, emotion: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none" />
                    <textarea placeholder={(t as any).musicStory} value={musicData.story} onChange={e => setMusicData({...musicData, story: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none h-32 resize-none" />
                  </div>
                </div>
              ) : showCvForm ? (
                <div className="space-y-4">
                  <p className="text-sm opacity-80 mb-4">{(t as any).cvFormDesc}</p>
                  <div className="space-y-4">
                    <input type="text" placeholder={(t as any).fullName} value={cvData.fullName} onChange={e => setCvData({...cvData, fullName: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none" />
                    <input type="tel" placeholder={(t as any).phone} value={cvData.phone} onChange={e => setCvData({...cvData, phone: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none" />
                    <input type="text" placeholder={(t as any).address} value={cvData.address} onChange={e => setCvData({...cvData, address: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none" />
                    <textarea placeholder={(t as any).profile} value={cvData.profile} onChange={e => setCvData({...cvData, profile: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none h-24 resize-none" />
                    <textarea placeholder={(t as any).experience} value={cvData.experience} onChange={e => setCvData({...cvData, experience: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none h-24 resize-none" />
                    <textarea placeholder={(t as any).education} value={cvData.education} onChange={e => setCvData({...cvData, education: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none h-24 resize-none" />
                    <textarea placeholder={(t as any).skills} value={cvData.skills} onChange={e => setCvData({...cvData, skills: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none h-24 resize-none" />
                    <textarea placeholder={(t as any).languages} value={cvData.languages} onChange={e => setCvData({...cvData, languages: e.target.value})} className="w-full glass px-4 py-3 rounded-xl outline-none h-24 resize-none" />
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-200 gap-4">
                  <Package className="w-16 h-16 opacity-20" /><p>{t.emptyCart}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, idx) => {
                    const price = item.selectedOption ? item.selectedOption.price : item.price;
                    return (
                      <div key={`${item.id}-${item.selectedOption?.label || idx}`} className="flex gap-4 glass p-4 rounded-2xl relative group">
                        <img src={item.image} alt={item.title[lang]} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{item.title[lang]}</h4>
                          {item.selectedOption && <p className="text-xs font-bold text-pink-500 mb-1">{item.selectedOption.label}</p>}
                          <div className="text-pink-500 font-bold mb-3">{Math.round(price * country.rate)} {country.symbol}</div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.id, -1, item.selectedOption?.label)} className="w-8 h-8 glass rounded-lg flex items-center justify-center">-</button>
                            <span className="font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1, item.selectedOption?.label)} className="w-8 h-8 glass rounded-lg flex items-center justify-center">+</button>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id, item.selectedOption?.label)} className="absolute top-4 right-4 opacity-60 hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    );
                  })}
                  <div className="glass p-5 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-pink-500" /><label className="text-xs font-bold uppercase tracking-widest">{t.promoCode}</label></div>
                    <div className="flex gap-2">
                      <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} disabled={!!appliedPromo} className="flex-1 glass px-5 py-3 rounded-2xl outline-none" />
                      <button onClick={handleApplyPromo} disabled={!!appliedPromo} className="px-6 py-3 bg-pink-500 text-white rounded-2xl font-bold text-sm">{t.apply}</button>
                    </div>
                    {promoError && <p className="text-xs text-red-400 font-bold">{promoError}</p>}
                    {appliedPromo && <div className="text-xs text-green-400 font-bold flex justify-between items-center bg-green-500/10 p-2 rounded-lg"><span>{t.promoApplied} ({appliedPromo})</span><button onClick={() => setAppliedPromo(null)}><X className="w-4 h-4" /></button></div>}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                {!showCvForm && !showMusicForm && (
                  <>
                    {appliedPromo && <div className="flex justify-between items-center text-sm"><span className="opacity-80">{t.discount}</span><span className="text-green-500 font-bold">-{convertedDiscount} {country.symbol}</span></div>}
                    <div className="flex justify-between items-center text-xl font-bold"><span>{t.total}</span><span className="gradient-text">{convertedTotal} {country.symbol}</span></div>
                  </>
                )}
                <div className="flex gap-4">
                  {(showCvForm || showMusicForm) && <button onClick={() => { setShowCvForm(false); setShowMusicForm(false); }} className="flex-1 py-4 glass rounded-2xl font-bold">{(t as any).backToCart}</button>}
                  <button onClick={handleCheckout} className={`${(showCvForm || showMusicForm) ? 'flex-[2]' : 'w-full'} py-4 bg-pink-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-pink-500/20`}>
                    {!showCvForm && !showMusicForm && <MessageCircle className="w-6 h-6" />}{(showCvForm || showMusicForm) ? (t as any).submitOrder : t.checkout}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
