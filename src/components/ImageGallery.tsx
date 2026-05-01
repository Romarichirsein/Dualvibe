import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';

export const ImageGallery = ({ images, mainImage, title }: { images?: string[]; mainImage: string; title: string }) => {
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const galleryImages = images && images.length > 0 ? images : [mainImage];

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-4 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={index}
            src={galleryImages[index]} 
            alt={`${title} - image ${index + 1}`} 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full aspect-[4/3] object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
          />
        </AnimatePresence>
        
        {galleryImages.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF006E]"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % galleryImages.length); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF006E]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </motion.div>

      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${index === i ? 'border-[#FF006E] scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#FF006E] transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={galleryImages[index]}
              alt={title}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length); }}
                  className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-[#FF006E] transition-colors"
                >
                  <ChevronRight className="w-8 h-8 rotate-180" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % galleryImages.length); }}
                  className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-[#FF006E] transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
