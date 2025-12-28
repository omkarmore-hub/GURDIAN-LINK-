
import { GoogleGenAI, Type } from "@google/genai";
import { ProblemResponse } from "../types";

export const getLegalAndSafetyAdvice = async (problem: string, language: string = 'en'): Promise<ProblemResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following problem: "${problem}". 
    CRITICAL: You must provide the entire response in the following language: ${language}.
    Act as a wise, friendly, and supportive legal advisor and mental health ally. 
    1. Determine if the situation described is generally legal or illegal. 
    2. Provide a clear explanation in ${language}. 
    3. List at least 5 actionable solutions or steps to take. 
    4. Provide a warm, comforting mental support message in ${language}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isLegal: { type: Type.STRING, description: "Simply 'Legal', 'Illegal', or 'Requires Caution' in requested language" },
          legalityExplanation: { type: Type.STRING },
          solutions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Exactly 5 or more solutions in requested language"
          },
          mentalSupportMessage: { type: Type.STRING }
        },
        required: ["isLegal", "legalityExplanation", "solutions", "mentalSupportMessage"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
