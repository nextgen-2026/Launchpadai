import { GoogleGenAI, Type } from "@google/genai";
import { StudentData, StudentType, RoadmapResponse } from "../types";

export const generateRoadmap = async (
  type: StudentType, 
  data: StudentData
): Promise<RoadmapResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as an expert elite career strategist and academic architect.
    I need a high-performance personalized roadmap for a ${type.toLowerCase()} student.
    
    Student Profile:
    - Name: ${data.name}
    - Current Level: ${data.year}
    - Ambition: ${data.goals}

    Requirement:
    Generate a STRICT JSON response based on the schema.
    
    CRITICAL INSTRUCTIONS FOR CONTENT:
    1. 'roadmapContent': 
       - Create a step-by-step actionable guide in Markdown.
       - **MANDATORY**: You MUST embed clickable links DIRECTLY into the sentences for every step.
       - Do not just list links at the end. Wiggle them into the text.
       - Usage format: "For this step, go to [Resource Name](URL) to learn X."
       - Example: "Phase 1: Foundations. Start by learning the basics of biology at [Khan Academy](https://www.khanacademy.org/science/biology). Then, practice your skills on [Quizlet](https://quizlet.com)."
       - Ensure you provide at least 2-3 inline links per major phase.
    
    2. 'weeklySchedule': 
       - detailed Markdown string outlining a routine.
    
    3. 'referenceLinks': 
       - An array of the top 5 most critical resources from the roadmap, summarized for quick access.
       - URL Rules: USE MAIN DOMAINS or CATEGORY PAGES to avoid 404s.

    Response Keys (Exact Match Required):
    - motivationalQuote
    - roadmapContent
    - weeklySchedule
    - referenceLinks
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            motivationalQuote: {
              type: Type.STRING,
              description: "A short, punchy, and powerful motivational quote (max 10 words)."
            },
            roadmapContent: {
              type: Type.STRING,
              description: "Detailed roadmap in Markdown with EMBEDDED LINKS [Title](URL)."
            },
            weeklySchedule: {
              type: Type.STRING,
              description: "Weekly schedule in Markdown."
            },
            referenceLinks: {
              type: Type.ARRAY,
              description: "List of 5+ recommended resources.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Resource Name" },
                  url: { type: Type.STRING, description: "Valid URL" },
                  description: { type: Type.STRING, description: "Short description of why this is useful." }
                },
                required: ["title", "url", "description"]
              }
            }
          },
          required: ["motivationalQuote", "roadmapContent", "weeklySchedule", "referenceLinks"]
        }
      }
    });

    let text = response.text || "{}";

    // Robust cleaning: Find the first '{' and the last '}' to ignore any preamble text
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    // Parse JSON
    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Failed to process AI response. Please try again.");
    }

    // Validate Keys
    if (!parsedData.roadmapContent || !parsedData.weeklySchedule) {
      console.warn("Missing keys in response:", parsedData);
      // Fallback for missing content
      if (!parsedData.roadmapContent) parsedData.roadmapContent = "## Roadmap Generation Incomplete\nPlease try regenerating.";
      if (!parsedData.weeklySchedule) parsedData.weeklySchedule = "- Schedule data unavailable.";
      if (!parsedData.motivationalQuote) parsedData.motivationalQuote = "The future belongs to those who prepare for it today.";
    }

    if (!parsedData.referenceLinks || !Array.isArray(parsedData.referenceLinks)) {
        parsedData.referenceLinks = [
            { title: "Coursera", url: "https://www.coursera.org", description: "Online courses for various subjects." },
            { title: "Khan Academy", url: "https://www.khanacademy.org", description: "Free educational resources." }
        ];
    }

    return parsedData as RoadmapResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate roadmap. Please check your connection and try again.");
  }
};