export type SlangId = 'intro' | 'niuma' | 'tangping' | 'bailan' | 'shangan' | '520' | 'juan';

export interface GameState {
  currentSlangId: SlangId;
  stats: {
    energy: number;
    money: number;
    stress: number;
  };
  history: SlangId[];
}

export interface Scenario {
  id: SlangId;
  title: string;
  chineseTerm: string;
  pinyin: string;
  visualEmoji: string; // Main visual representation
  animationClass: string;
  descriptionIt: string; // Initial brief description
  options: Choice[];
}

export interface Choice {
  label: string;
  nextId: SlangId | 'reset';
  effect: string; // Descriptive effect (e.g., "Energy -10")
}

export interface AICommentary {
  text: string;
  isLoading: boolean;
}

export interface SlangTerm {
  chinese: string;
  pinyin: string;
  literalMeaning: string;
  actualMeaning: string;
  culturalContext: string;
  category: string;
  imageUrl: string;
}
