import React, { useState, useEffect } from 'react';
import { SlangTerm } from '../types';
import { X, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { explainTermInDepth } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface DetailModalProps {
  term: SlangTerm | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ term, onClose }) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setAiExplanation(null);
    setLoadingAi(false);
  }, [term]);

  if (!term) return null;

  const handleAiExplain = async () => {
    setLoadingAi(true);
    try {
        const explanation = await explainTermInDepth(term.chinese);
        setAiExplanation(explanation);
    } catch (e) {
        setAiExplanation("Errore nella connessione con il professore AI.");
    } finally {
        setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-paper-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
        >
            <X className="w-6 h-6 text-gray-800" />
        </button>

        {/* Left Side: Visual & Big Text */}
        <div className="w-full md:w-2/5 bg-china-red text-white p-8 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/shigley-drops.png')]"></div>
            
            <div className="z-10 text-center">
                <h2 className="text-8xl font-black mb-2 tracking-tighter">{term.chinese}</h2>
                <p className="text-2xl font-mono opacity-90 mb-6">{term.pinyin}</p>
                <div className="w-16 h-1 bg-china-gold mx-auto mb-6"></div>
                <p className="text-xl font-medium italic">"{term.literalMeaning}"</p>
            </div>
            
            <button className="mt-12 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all text-sm backdrop-blur-md">
                <Volume2 className="w-4 h-4" />
                <span>Ascolta pronuncia</span>
                {/* Audio functionality placeholder */}
            </button>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-3/5 p-8 md:p-12 bg-paper-white text-gray-800">
            <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Significato Reale</h3>
                <p className="text-2xl font-serif leading-relaxed text-ink-black">
                    {term.actualMeaning}
                </p>
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contesto Culturale</h3>
                <p className="text-lg leading-relaxed text-gray-600">
                    {term.culturalContext}
                </p>
            </div>

            {/* AI Interaction Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                {!aiExplanation ? (
                    <button 
                        onClick={handleAiExplain}
                        disabled={loadingAi}
                        className="flex items-center gap-2 text-china-red hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                    >
                        {loadingAi ? (
                            <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                Chiedo al Professore AI...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Approfondisci con AI Guru
                            </>
                        )}
                    </button>
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-2 mb-3 text-china-red">
                            <BookOpen className="w-5 h-5" />
                            <span className="font-bold">Il commento del Professore:</span>
                        </div>
                        <div className="prose prose-sm prose-red text-gray-600 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};