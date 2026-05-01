import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialCard = ({ name, role, text, avatar }: { name: string; role: string; text: string; avatar: string }) => (
  <div className="glass p-8 rounded-3xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <Quote className="w-12 h-12 text-pink-500" />
    </div>
    <p className="text-slate-600 dark:text-slate-200 mb-8 italic relative z-10">"{text}"</p>
    <div className="flex items-center gap-4">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-pink-500/20" referrerPolicy="no-referrer" />
      <div>
        <h4 className="font-bold text-sm">{name}</h4>
        <p className="text-xs text-pink-500">{role}</p>
      </div>
    </div>
  </div>
);
