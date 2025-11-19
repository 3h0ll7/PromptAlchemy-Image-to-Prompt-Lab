import { GoogleGenAI, Type } from "@google/genai";
import { CreativeMode, PromptResponse } from "../types";

// Using Gemini 2.5 Flash for multimodal capabilities
const MODEL_NAME = "gemini-2.5-flash";

export const generatePrompts = async (
  base64Image: string, 
  mimeType: string, 
  mode: CreativeMode
): Promise<PromptResponse> => {
  
  const apiKey = process.env.API_KEY;

  // Fallback for demo purposes if no API key is present
  if (!apiKey) {
    console.warn("No API Key found in process.env.API_KEY. Returning mock data.");
    return getMockData(mode);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
      Analyze this image carefully. I need you to act as a creative director and technical writer.
      The user has selected the creative mode: "${mode}".
      
      Based on the visual elements, composition, lighting, and mood of the image, generate 4 distinct outputs in JSON format:
      1. "Visual Prompt": A detailed prompt for generating a similar image in Midjourney/Dall-E style, emphasizing the '${mode}' aesthetic.
      2. "Video Screenplay": A short prompt for a video generation AI (like Sora/Veo) describing motion based on the static image.
      3. "Story Starter": A creative writing hook or opening line inspired by the image's atmosphere.
      4. "UI Concept": A prompt for a web/app interface design that uses the color palette and mood of the image.
      
      Also provide a brief 1-sentence technical analysis of the image (lighting/composition).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            prompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "One of: Visual Art, Video, Story, UI/UX" },
                  icon: { type: Type.STRING, description: "A suggested Lucide icon name (e.g. 'Image', 'Video', 'PenTool', 'Layout')" },
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as PromptResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock on error to keep UI functional
    return getMockData(mode);
  }
};

const getMockData = (mode: CreativeMode): Promise<PromptResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        analysis: "Mock Analysis: High contrast lighting with strong leading lines in a " + mode + " style.",
        prompts: [
          {
            category: "Visual Art",
            icon: "Image",
            title: "Generative Reproduction",
            text: `A highly detailed ${mode} style rendering, volumetric lighting, 8k resolution, octane render, intricate details matching the uploaded composition.`
          },
          {
            category: "Video",
            icon: "Video",
            title: "Motion Guide",
            text: "Slow pan camera movement, rack focus from foreground to background, cinematic color grading, atmospheric particles floating in air."
          },
          {
            category: "Story",
            icon: "PenTool",
            title: "Narrative Hook",
            text: "The silence was deafening, broken only by the hum of the neon lights flickering above the wet pavement..."
          },
          {
            category: "UI/UX",
            icon: "Layout",
            title: "Interface Concept",
            text: "Glassmorphism dashboard layout using the dominant teal and violet hues from the image, modern sans-serif typography, clean whitespace."
          }
        ]
      });
    }, 2000);
  });
};
