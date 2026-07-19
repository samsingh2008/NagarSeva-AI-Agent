import { GoogleGenAI } from '@google/genai';
export declare const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
export declare const getGeminiApiKey: () => string;
export declare const getGeminiModel: () => string;
export declare const getGeminiApiKeyPrefix: () => string | null;
export declare const getGeminiProjectId: () => string | null;
export declare const isGeminiConfigured: () => boolean;
export declare const getGeminiClient: () => GoogleGenAI;
export default getGeminiClient;
//# sourceMappingURL=gemini.d.ts.map