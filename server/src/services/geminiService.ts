import { Type, type Part } from '@google/genai';
import { z } from 'zod';
import { GEMINI_MODEL, getGeminiClient, isGeminiConfigured } from '../config/gemini.js';

export const allowedCategories = [
  'Roads & Infrastructure',
  'Sanitation & Waste',
  'Water Supply',
  'Drainage & Waterlogging',
  'Sewerage',
  'Street Lighting & Electrical',
  'Parks & Trees',
  'Traffic & Road Safety',
  'Animal Control',
  'Other',
] as const;

export const allowedSeverities = ['Low', 'Medium', 'High'] as const;

export const allowedDepartments = [
  'Public Works Department',
  'Sanitation Department',
  'Water Supply Department',
  'Drainage Department',
  'Electricity Department',
  'Traffic Department',
  'Horticulture Department',
  'Animal Welfare Department',
  'Other',
] as const;

const geminiComplaintAnalysisSchema = z
  .object({
    category: z.enum(allowedCategories),
    severity: z.enum(allowedSeverities),
    department: z.enum(allowedDepartments),
    summary: z.string().trim().min(1).max(500),
    confidence: z.number().min(0).max(1),
    suggestedActions: z.array(z.string().trim().min(1).max(200)).max(8),
  })
  .strict();

export type GeminiComplaintAnalysis = z.infer<typeof geminiComplaintAnalysisSchema>;

export interface GeminiComplaintInput {
  description?: string;
  image?: {
    buffer: Buffer;
    mimeType: string;
  };
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      enum: [...allowedCategories],
    },
    severity: {
      type: Type.STRING,
      enum: [...allowedSeverities],
    },
    department: {
      type: Type.STRING,
      enum: [...allowedDepartments],
    },
    summary: {
      type: Type.STRING,
    },
    confidence: {
      type: Type.NUMBER,
      minimum: 0,
      maximum: 1,
    },
    suggestedActions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ['category', 'severity', 'department', 'summary', 'confidence', 'suggestedActions'],
  propertyOrdering: ['category', 'severity', 'department', 'summary', 'confidence', 'suggestedActions'],
};

const buildPrompt = (description?: string) => `Analyze this municipal complaint and return STRICT JSON only.

Use only these exact categories:
${allowedCategories.map((category) => `- ${category}`).join('\n')}

Use only these exact severity values:
${allowedSeverities.map((severity) => `- ${severity}`).join('\n')}

Use only these exact departments:
${allowedDepartments.map((department) => `- ${department}`).join('\n')}

Return exactly this JSON shape with no markdown, no code fence, and no explanatory text:
{
  "category":"",
  "severity":"",
  "department":"",
  "summary":"",
  "confidence":0,
  "suggestedActions":[]
}

The confidence value must be a number between 0 and 1.

Complaint description:
${description?.trim() || 'No description provided.'}`;

export const validateGeminiComplaintAnalysis = (value: unknown): GeminiComplaintAnalysis | null => {
  const parsed = geminiComplaintAnalysisSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
};

const parseGeminiJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const analyzeComplaintWithGemini = async (
  input: GeminiComplaintInput
): Promise<GeminiComplaintAnalysis | null> => {
  if (!isGeminiConfigured()) {
    console.log("❌ GEMINI_API_KEY not configured");
    return null;
  }

  try {
    const parts: Part[] = [
      {
        text: buildPrompt(input.description),
      },
    ];

    if (input.image) {
      parts.push({
        inlineData: {
          data: input.image.buffer.toString("base64"),
          mimeType: input.image.mimeType,
        },
      });
    }

    console.log("🚀 Sending request to Gemini...");

    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts }],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    console.log("✅ Gemini raw response:");
    console.log(response.text);

    if (!response.text) {
      console.log("❌ Empty Gemini response");
      return null;
    }

    const parsed = JSON.parse(response.text);

    console.log("✅ Parsed JSON:");
    console.log(parsed);

    return validateGeminiComplaintAnalysis(parsed);
  } catch (err) {
    console.error("❌ Gemini ERROR:");
    console.error(err);
    return null;
  }
};