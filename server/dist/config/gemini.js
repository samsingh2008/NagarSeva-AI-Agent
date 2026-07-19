import { GoogleGenerativeAI } from '@google/generative-ai';
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
export const getGeminiModel = () => {
    if (!genAI) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};
export default genAI;
//# sourceMappingURL=gemini.js.map