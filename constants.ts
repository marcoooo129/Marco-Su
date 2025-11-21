import { Scenario } from './types';

export const SCENARIOS: Record<string, Scenario> = {
  intro: {
    id: 'intro',
    title: "La Laurea",
    chineseTerm: "内卷",
    pinyin: "Nèi Juǎn",
    visualEmoji: "🌪️",
    animationClass: "animate-spin",
    descriptionIt: "Ti sei appena laureato. Benvenuto nella società! La competizione è feroce, tutti corrono come criceti in una ruota. Questo è il 'Nèi Juǎn' (Involution). Cosa fai?",
    options: [
      { label: "Cerco un lavoro in azienda!", nextId: 'niuma', effect: "Stress +50" },
      { label: "Voglio il posto fisso statale!", nextId: 'shangan', effect: "Studio +100" },
      { label: "Cerco l'amore...", nextId: '520', effect: "Soldi -50" }
    ]
  },
  niuma: {
    id: 'niuma',
    title: "La Vita Aziendale",
    chineseTerm: "牛马",
    pinyin: "Niú Mǎ",
    visualEmoji: "🐮🐴",
    animationClass: "animate-bounce",
    descriptionIt: "Hai trovato lavoro! Ma il capo ti fa lavorare 996 (9am-9pm, 6 giorni). Non sei un dipendente, sei un...",
    options: [
      { label: "Non ce la faccio più...", nextId: 'tangping', effect: "Energy -100" },
      { label: "Faccio finta di lavorare male", nextId: 'bailan', effect: "Performance -100" },
      { label: "Torno a studiare", nextId: 'shangan', effect: "Speranza +10" }
    ]
  },
  shangan: {
    id: 'shangan',
    title: "Il Concorso Pubblico",
    chineseTerm: "上岸",
    pinyin: "Shàng Àn",
    visualEmoji: "🏊🏖️",
    animationClass: "animate-pulse",
    descriptionIt: "Studi giorno e notte per l'esame statale. Il mare della disoccupazione è amaro. Riuscirai a 'salire a riva' (ottenere il posto fisso)?",
    options: [
      { label: "Troppo difficile, mi arrendo", nextId: 'tangping', effect: "Fallimento" },
      { label: "Ho bisogno di affetto", nextId: '520', effect: "Love +100" },
      { label: "Ricomincia da capo", nextId: 'intro', effect: "Reincarnazione" }
    ]
  },
  tangping: {
    id: 'tangping',
    title: "Il Riposo del Guerriero",
    chineseTerm: "躺平",
    pinyin: "Tǎng Píng",
    visualEmoji: "🛌",
    animationClass: "",
    descriptionIt: "Basta. Hai deciso di non comprare casa, non sposarti, non fare carriera. Ti sdrai. Fai il minimo indispensabile.",
    options: [
      { label: "Voglio peggiorare le cose", nextId: 'bailan', effect: "Caos +100" },
      { label: "Mi sento solo...", nextId: '520', effect: "Cerca partner" },
      { label: "Riproviamo a vivere", nextId: 'intro', effect: "Reset" }
    ]
  },
  bailan: {
    id: 'bailan',
    title: "Lasciar Marcire",
    chineseTerm: "摆烂",
    pinyin: "Bǎi Làn",
    visualEmoji: "🗑️📉",
    animationClass: "animate-pulse-fast",
    descriptionIt: "La situazione è brutta? Lasciala peggiorare! Non aggiusti niente. 'Let it rot'. Atteggiamento nichilista attivo.",
    options: [
      { label: "Torniamo seri (Reset)", nextId: 'intro', effect: "Nuova Vita" }
    ]
  },
  '520': {
    id: '520',
    title: "L'Amore Online",
    chineseTerm: "520",
    pinyin: "Wǔ Èr Líng",
    visualEmoji: "🤟🌹",
    animationClass: "animate-heartbeat",
    descriptionIt: "Oggi è il 20 Maggio (5.20). In cinese suona come 'Wǒ Ài Nǐ' (Ti amo). Hai mandato una busta rossa (Hongbao) al tuo amore?",
    options: [
      { label: "Troppo costoso, torno a lavorare", nextId: 'niuma', effect: "Soldi +10" },
      { label: "Sono single, mi sdraio", nextId: 'tangping', effect: "Relax" }
    ]
  },
  juan: {
    id: 'juan',
    title: "Concorrenza",
    chineseTerm: "内卷",
    pinyin: "Nèi Juǎn",
    visualEmoji: "🌀",
    animationClass: "animate-spin",
    descriptionIt: "L'origine di tutto. Involution. Competizione irrazionale.",
    options: []
  }
};
