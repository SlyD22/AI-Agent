
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLegalResponse = async (
  prompt: string,
  history: Message[]
): Promise<{ text: string; sources: GroundingSource[] }> => {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `Вы — ArmLegal AI Ассистент, высококвалифицированный цифровой юридический консультант.
        Ваша цель — предоставлять точную, профессиональную и глубоко проработанную юридическую информацию на РУССКОМ языке.
        ВСЕГДА используйте инструмент Google Search для проверки актуальных законов, последних судебных дел и нормативных актов.
        Структурируйте свои ответы профессионально: используйте заголовки, маркированные списки и четкие разделы.
        Различайте общие юридические принципы и конкретную судебную практику.
        ВСЕГДА ссылайтесь на свои источники, используя предоставленную информацию о заземлении (grounding).
        Дисклеймер: четко заявляйте, что вы являетесь ИИ-помощником и ваши ответы не являются официальной юридической консультацией.`
      },
    });

    const text = response.text || "Приношу извинения, возникла ошибка при обработке вашего запроса.";
    
    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri && chunk.web.title) {
          // Avoid duplicates
          if (!sources.find(s => s.uri === chunk.web.uri)) {
            sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri
            });
          }
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
