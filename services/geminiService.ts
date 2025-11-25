import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists to avoid errors on load
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getHoneyRecommendation = async (query: string): Promise<string> => {
  if (!ai) {
    return "I'm sorry, but my AI brain isn't connected right now. (API Key missing)";
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `Si Medeni Sommelier pri Čebelarstvu Tomaž. 
    Tvoja naloga je priporočiti enega izmed naših izdelkov glede na to, kaj uporabnik je ali išče.
    
    Naši izdelki:
    1. Cvetlični med (Cveten, za čaj, peko, vsakdanjo uporabo)
    2. Lipov med (Svež, mentolne note, za pomiritev, čaj)
    3. Hojev med (Intenziven, temen, bogat okus, za sire, mesne jedi)

    Pravila:
    - Odgovori naj bodo kratki (do 50 besed).
    - Bodi topel in prijazen v tonu.
    - Vedno omeni konkreten izdelek iz seznama.
    - Če uporabnik vpraša nekaj nepovezanega s hrano ali medom, ga nežno usmeri nazaj k medu.
    - Odgovarjaj v slovenščini.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't find the perfect pairing, but Wildflower is always a safe bet!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a bit of a sticky situation connecting to the hive. Please try again.";
  }
};