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
    const systemInstruction = `You are the GoldenDrop Honey Sommelier. 
    Your goal is to recommend one of our specific honey products based on what the user is eating or looking for.
    
    Our Products:
    1. Wildflower Raw Honey (Floral, tea, baking)
    2. Black Forest Honeydew (Malty, savory, cheese pairings, rich)
    3. Acacia Gold Reserve (Delicate, vanilla, yogurt, fruit, premium)
    4. Spicy Hot Honey (Pizza, chicken, charcuterie, cocktails)

    Rules:
    - Keep answers short (under 50 words).
    - Be warm, golden, and sweet in tone.
    - Always mention a specific product from the list above.
    - If the user asks something unrelated to food or honey, gently steer them back to honey.
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