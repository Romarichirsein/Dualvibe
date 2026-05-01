import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Review, ProductOption } from '../data/products';
import { TRANSLATIONS } from '../data/translations';

type Language = 'fr' | 'en';

export const ReviewSection = ({ 
  reviews, 
  lang, 
  onAddReview 
}: { 
  reviews: Review[]; 
  lang: Language; 
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void 
}) => {
  const t = TRANSLATIONS[lang];
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;
    onAddReview({ userName, rating, comment });
    setUserName('');
    setComment('');
    setRating(5);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-12 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-display font-bold">{t.reviews}</h3>
        {averageRating && (
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{averageRating} / 5</span>
            <span className="text-xs opacity-80">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-200 italic">{t.noReviews}</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="glass p-6 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold">{r.userName}</span>
                <span className="text-xs opacity-80">{r.date}</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-slate-600'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-200">{r.comment}</p>
            </div>
          ))
        )}
      </div>

      <div className="glass p-8 rounded-[2rem] space-y-6 form-glow-border">
        <h4 className="text-xl font-bold">{t.addReview}</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-2">{t.name}</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full glass px-6 py-3 rounded-xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 ml-2">{t.rating}</label>
              <select 
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full glass px-6 py-3 rounded-xl outline-none bg-transparent"
              >
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n} className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">{n} Stars</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold opacity-80 ml-2">{t.comment}</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full glass px-6 py-3 rounded-xl outline-none h-24 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500" 
              required
            />
          </div>
          <button type="submit" className="w-full py-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/20">
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};
