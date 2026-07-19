import { GoogleGenAI } from '@google/genai';
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
let geminiClient = null;
export const GEMINI_MODEL = 'gemini-2.0-flash';
export const isGeminiConfigured = () => Boolean(geminiApiKey);
export const getGeminiClient = () => {
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    if (!geminiClient) {
        geminiClient = new GoogleGenAI({ apiKey: geminiApiKey });
    }
    return geminiClient;
};
export default getGeminiClient;
//# sourceMappingURL=gemini.js.map