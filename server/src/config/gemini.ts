import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export default genAI;
