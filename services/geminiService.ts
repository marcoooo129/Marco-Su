import { GoogleGenAI } from "@google/genai";
import { Scenario } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProfessorCommentary = async (scenario: Scenario): Promise<string> => {
  const prompt = `
    Sei un professore universitario italiano eccentrico e divertente che insegna cultura pop cinese.
    
    L'utente (studente) è appena arrivato nella situazione: "${scenario.chineseTerm}" (${scenario.pinyin}).
    Significato base: ${scenario.descriptionIt}
    
    Compito:
    Spiega in ITALIANO, in modo molto colloquiale e teatrale (massimo 3 frasi), perché questo termine è divertente o tragico. 
    Usa metafore italiane se possibile.
    
    Esempio per Niú Mǎ: "Miei cari studenti! Ecco il 'Niú Mǎ'! Letteralmente Bue e Cavallo. In Italia diremmo 'lavorare come un mulo', ma in Cina siete *entrambi* gli animali! Che fortuna, eh?"
    Esempio per Tǎng Píng: "Ecco la filosofia del 'Tǎng Píng'! Sdraiatevi! Se non vi alzate, il capitalismo non può colpirvi! Geniale, no?"
    
    Rispondi solo col testo del professore.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Il professore sta bevendo un espresso...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Il professore è in pausa caffè (Errore connessione).";
  }
};

export const explainTermInDepth = async (term: string): Promise<string> => {
  const prompt = `
    Sei un esperto sinologo e sociologo specializzato in cultura internet cinese moderna.
    
    Spiega in dettaglio il termine slang: "${term}".
    
    La spiegazione deve essere in ITALIANO e strutturata in Markdown.
    Includi:
    - Etimologia (da dove viene)
    - Contesto sociale (perché si usa oggi)
    - Sfumature di significato che si perdono nella traduzione
    - Esempio di utilizzo in una frase
    
    Tono: Accademico ma accessibile, affascinante.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Nessuna spiegazione dettagliata disponibile al momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Impossibile contattare l'archivio centrale (Errore connessione).";
  }
};
