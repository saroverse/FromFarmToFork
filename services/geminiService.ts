import { GoogleGenAI } from "@google/genai";
import { Coordinates, GroundingChunk } from "../types";

// Helper to get the API key
const getApiKey = () => process.env.API_KEY || '';

export interface SearchResult {
  text: string;
  chunks: GroundingChunk[];
}

/**
 * Searches for local food options using Gemini 2.5 Flash with Google Maps Grounding.
 */
export const searchLocalSustainableFood = async (
  query: string,
  userLocation: Coordinates | null
): Promise<SearchResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Construct a prompt that encourages using the maps tool
  const prompt = `Find local sustainable food options, farmers markets, or farm stands near the user. 
  Query details: "${query}". 
  Provide a helpful summary of the options found, highlighting what makes them sustainable if known.`;

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  // Add location context if available
  if (userLocation) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      },
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Must use 2.5 series for Maps grounding
      contents: prompt,
      config: config,
    });

    const text = response.text || "No results found.";
    // Cast SDK types to local GroundingChunk type which has optional fields
    const chunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as unknown as GroundingChunk[];

    return { text, chunks };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      text: "I'm having trouble connecting to the map service right now. Please try again later.",
      chunks: []
    };
  }
};

/**
 * Generates a creative description for a farmer profile.
 */
export const generateFarmDescription = async (farmName: string, products: string[]): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "A lovely local farm.";

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, inviting, 2-sentence description for a sustainable local farm named "${farmName}" that sells ${products.join(', ')}.`,
    });
    return response.text || "Fresh from the field to your table.";
  } catch (e) {
    return "Fresh from the field to your table.";
  }
};