import React, { useState, useEffect, useRef } from 'react';
import { SCENARIOS } from './constants';
import { SlangId, AICommentary } from './types';
import { PixelAvatar } from './components/PixelAvatar';
import { getProfessorCommentary } from './services/geminiService';
import { Play, RotateCcw, Volume2, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentId, setCurrentId] = useState<SlangId>('intro');
  const [commentary, setCommentary] = useState<AICommentary>({ text: "", isLoading: false });
  const [showMeaning, setShowMeaning] = useState(false);
  
  // Audio effect ref (mock)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scenario = SCENARIOS[currentId];

  useEffect(() => {
    // Check for API Key
    if(!process.env.API_KEY) {
        setCommentary({ text: "API KEY mancante! Inseriscila per sentire il professore.", isLoading: false });
        return;
    }

    // Reset state for new screen
    setShowMeaning(false);
    
    // Fetch AI commentary specific to this scene
    const fetchCommentary = async () => {
      setCommentary(prev => ({ ...prev, isLoading: true }));
      const text = await getProfessorCommentary(scenario);
      setCommentary({ text, isLoading: false });
    };

    fetchCommentary();
  }, [currentId]);

  const handleChoice = (nextId: SlangId | 'reset') => {
    if (nextId === 'reset') {
      setCurrentId('intro');
    } else {
      setCurrentId(nextId);
    }
  };

  return (
    <div className="min-h-screen bg-retro-bg font-mono text-gray-100 flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Header / HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 border-b-4 border-china-red pb-4 bg-retro-card p-4 rounded-t-lg shadow-lg">
        <div className="flex flex-col">
            <h1 className="font-pixel text-china-gold text-xl md:text-3xl tracking-tighter">
                VITA CINESE SIMULATOR
            </h1>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Corso di Sopravvivenza Digitale</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2 text-xs">
                <div className="bg-black/30 px-3 py-1 rounded text-green-400">ENERGY: 50%</div>
                <div className="bg-black/30 px-3 py-1 rounded text-yellow-400">MONEY: ¥250</div>
            </div>
            <button 
                onClick={() => setCurrentId('intro')}
                className="bg-china-red p-2 rounded hover:bg-red-600 transition-colors border-b-4 border-red-900 active:border-b-0 active:translate-y-1"
            >
                <RotateCcw size={20} />
            </button>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visuals */}
        <div className="lg:col-span-5 flex flex-col items-center">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <PixelAvatar state={currentId} />
            </div>
            
            {/* The "Slang Card" Reveal */}
            <div className={`bg-paper-white w-full rounded-xl p-6 text-center transition-all duration-500 border-4 ${showMeaning ? 'border-china-gold bg-gray-800' : 'border-gray-600 bg-gray-700/50'}`}>
                <h2 className="text-4xl md:text-6xl font-black mb-2 text-white">
                    {scenario.chineseTerm}
                </h2>
                <p className="text-xl text-china-gold font-pixel mb-4">{scenario.pinyin}</p>
                
                {!showMeaning ? (
                    <button 
                        onClick={() => setShowMeaning(true)}
                        className="animate-pulse bg-china-red text-white px-4 py-2 rounded font-bold hover:bg-red-500 text-sm"
                    >
                        SVELA SIGNIFICATO
                    </button>
                ) : (
                    <div className="animate-fadeIn">
                        <p className="text-lg font-bold text-white mb-2 border-b border-white/20 pb-2">
                            "{scenario.title}"
                        </p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {scenario.descriptionIt}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Narrative & Interaction */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[400px]">
            
            {/* AI Professor Bubble */}
            <div className="bg-white text-retro-bg p-6 rounded-2xl rounded-tl-none shadow-xl mb-6 relative border-4 border-gray-300">
                <div className="absolute -top-4 -left-1 bg-china-red text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    IL PROFESSORE DICE:
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="min-w-[50px] h-[50px] bg-gray-200 rounded-full overflow-hidden border-2 border-gray-400">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ProfessorX&clothing=blazerAndShirt&eyebrows=raisedExcited" alt="Prof" />
                    </div>
                    <div className="flex-1">
                        {commentary.isLoading ? (
                            <div className="flex items-center gap-2 text-gray-500 h-full">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        ) : (
                            <p className="font-serif text-lg italic leading-relaxed">
                                "{commentary.text}"
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Choices Panel */}
            <div className="flex flex-col gap-3">
                <div className="text-sm text-gray-400 font-pixel mb-2 uppercase">Cosa fai?</div>
                {scenario.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleChoice(option.nextId)}
                        className="group relative w-full bg-retro-card hover:bg-china-gold hover:text-retro-bg text-left p-4 rounded-lg border-2 border-gray-600 hover:border-white transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
                    >
                        <span className="font-bold text-lg block group-hover:translate-x-2 transition-transform">
                            {String.fromCharCode(65 + idx)}. {option.label}
                        </span>
                        <span className="text-xs opacity-50 group-hover:opacity-100 absolute right-4 top-1/2 -translate-y-1/2 font-mono">
                            {option.effect}
                        </span>
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-xs font-mono">
        Powered by Gemini 2.5 Flash • Designed for Italian Students
      </footer>
    </div>
  );
};

export default App;
