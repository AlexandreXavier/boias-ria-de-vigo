import { GoogleGenAI, Tool } from "@google/genai";
import { GroundingLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash as requested for Maps Grounding
const MODEL_NAME = "gemini-2.5-flash";

interface ChatResponse {
  text: string;
  groundingLinks: GroundingLink[];
}

export const sendMessageToGemini = async (
  message: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<ChatResponse> => {
  try {
    const tools: Tool[] = [
      {
        googleMaps: {},
      },
    ];

    const toolConfig = userLocation
      ? {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        }
      : undefined;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: message,
      config: {
        tools,
        toolConfig,
        // System instruction to help the model behave like a maritime assistant
        systemInstruction: "You are a helpful maritime assistant for the Ria de Vigo area in Spain. Help users find coordinates, marinas, and points of interest. If users ask for coordinates, provide them clearly.",
      },
    });

    const text = response.text || "No response generated.";
    
    // Extract grounding chunks if available
    const groundingLinks: GroundingLink[] = [];
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk) => {
        // Handle Google Maps grounding chunks
        if (chunk.web) {
            groundingLinks.push({
                title: chunk.web.title || "Web Source",
                uri: chunk.web.uri || "#"
            });
        }
      });
    }

    return { text, groundingLinks };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};