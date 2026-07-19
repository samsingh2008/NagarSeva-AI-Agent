import { GoogleGenAI } from '@google/genai';
let geminiClient = null;
let geminiClientKey = null;
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash-lite';
export const getGeminiApiKey = () => process.env.GEMINI_API_KEY?.trim() || '';
export const getGeminiModel = () => process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
export const getGeminiApiKeyPrefix = () => {
    const apiKey = getGeminiApiKey();
    return apiKey ? apiKey.slice(0, 8) : null;
};
export const getGeminiProjectId = () => process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
    process.env.GOOGLE_CLOUD_PROJECT_ID?.trim() ||
    process.env.GCP_PROJECT?.trim() ||
    null;
export const isGeminiConfigured = () => Boolean(getGeminiApiKey());
export const getGeminiClient = () => {
    const geminiApiKey = getGeminiApiKey();
    if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    if (!geminiClient || geminiClientKey !== geminiApiKey) {
        geminiClient = new GoogleGenAI({ apiKey: geminiApiKey });
        geminiClientKey = geminiApiKey;
    }
    return geminiClient;
};
export default getGeminiClient;
//# sourceMappingURL=gemini.js.map