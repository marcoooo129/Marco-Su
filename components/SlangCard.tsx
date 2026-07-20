import React from 'react';
import { SlangTerm } from '../types';
import { ChevronRight } from 'lucide-react';

interface SlangCardProps {
  term: SlangTerm;
  onClick: (term: SlangTerm) => void;
}

export const SlangCard: React.FC<SlangCardProps> = ({ term, onClick }) => {
  return (
    <div 
      onClick={() => onClick(term)}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
    >
      <div className="h-48 overflow-hidden relative">
         <img 
            src={term.imageUrl} 
            alt={term.chinese}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
         <div className="absolute bottom-3 left-4 text-white">
            <span className="text-xs font-bold uppercase tracking-wider bg-china-red px-2 py-0.5 rounded-sm">
                {term.category}
            </span>
         </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-china-red transition-colors">
            {term.chinese}
            </h3>
            <p className="text-sm text-gray-500 font-mono mb-3">{term.pinyin}</p>
            <p className="text-gray-700 font-medium line-clamp-2">
            "{term.actualMeaning}"
            </p>
        </div>
        
        <div className="mt-4 flex items-center text-china-red font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
            Scopri di più <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};