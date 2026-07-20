import React from 'react';
import { SlangId } from '../types';

interface Props {
  state: SlangId;
}

export const PixelAvatar: React.FC<Props> = ({ state }) => {
  // Simple visual composition based on state
  
  const getFace = () => {
    switch(state) {
      case 'niuma': return (
        <div className="relative animate-bounce">
            <div className="text-9xl filter drop-shadow-lg">🐴</div>
            <div className="absolute -bottom-2 -right-2 text-6xl">🐮</div>
            <div className="absolute top-0 left-0 text-4xl animate-pulse">💦</div>
        </div>
      );
      case 'tangping': return (
        <div className="relative transform rotate-90 origin-center transition-all duration-700">
            <div className="text-9xl grayscale">😐</div>
            <div className="absolute -top-10 right-0 text-6xl animate-pulse">💤</div>
        </div>
      );
      case 'bailan': return (
        <div className="relative">
            <div className="text-9xl blur-[2px] opacity-80">🫠</div>
            <div className="absolute bottom-0 w-full h-1/2 bg-gray-700/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-pixel text-xs">
                GAME OVER
            </div>
        </div>
      );
      case 'shangan': return (
        <div className="relative animate-pulse-fast">
            <div className="text-9xl">🤓</div>
            <div className="absolute -bottom-4 w-full h-4 bg-blue-500/50 rounded-full blur-md"></div>
            <div className="absolute top-0 right-0 text-5xl">📜</div>
        </div>
      );
      case '520': return (
        <div className="relative animate-heartbeat">
            <div className="text-9xl">😍</div>
            <div className="absolute -top-4 -right-4 text-6xl animate-bounce text-china-red">🧧</div>
            <div className="absolute top-10 -left-6 text-4xl text-pink-500">520</div>
        </div>
      );
      default: return (
        <div className="relative">
            <div className="text-9xl">🎓</div>
            <div className="absolute top-0 right-0 text-6xl animate-spin">🌀</div>
        </div>
      );
    }
  };

  return (
    <div className="w-64 h-64 bg-retro-card rounded-full border-4 border-china-gold flex items-center justify-center shadow-[0_0_30px_rgba(231,76,60,0.3)] transition-all duration-500">
      {getFace()}
    </div>
  );
};
