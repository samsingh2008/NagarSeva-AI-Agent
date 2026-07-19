import { Type, type Part } from '@google/genai';
import { z } from 'zod';
import {
  getGeminiApiKey,
  getGeminiApiKeyPrefix,
  getGeminiClient,
  getGeminiModel,
  getGeminiProjectId,
  isGeminiConfigured,
} from '../config/gemini.js';

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

const extractErrorDetails = (error: unknown): Record<string, unknown> => {
  if (!error || typeof error !== 'object') {
    return {};
  }

  return error as Record<string, unknown>;
};

const extractNestedDetails = (errorDetails: Record<string, unknown>) => {
  const nestedError = errorDetails.error;

  if (nestedError && typeof nestedError === 'object') {
    return nestedError as Record<string, unknown>;
  }

  return {};
};

const findProjectIdInValue = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const projectMatch = value.match(/projects\/([^/\s",]+)/i);
    return projectMatch?.[1] || null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const projectId = findProjectIdInValue(item);
      if (projectId) {
        return projectId;
      }
    }
    return null;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;

    for (const key of ['projectId', 'project_id', 'project', 'consumer']) {
      const projectId = findProjectIdInValue(record[key]);
      if (projectId) {
        return projectId;
      }
    }

    for (const item of Object.values(record)) {
      const projectId = findProjectIdInValue(item);
      if (projectId) {
        return projectId;
      }
    }
  }

  return null;
};

const extractQuotaDetails = (value: unknown): unknown[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const detail = item as Record<string, unknown>;
    return String(detail['@type'] || '').includes('QuotaFailure') || Array.isArray(detail.violations);
  });
};

const hasZeroQuotaSignal = (quotaDetails: unknown[]) =>
  quotaDetails.some((detail) => {
    if (!detail || typeof detail !== 'object') {
      return false;
    }

    const violations = (detail as Record<string, unknown>).violations;
    if (!Array.isArray(violations)) {
      return false;
    }

    return violations.some((violation) => {
      if (!violation || typeof violation !== 'object') {
        return false;
      }

      const quotaValue = (violation as Record<string, unknown>).quotaValue;
      return quotaValue === 0 || quotaValue === '0';
    });
  });

const logGeminiRuntimeConfig = (model: string) => {
  const apiKey = getGeminiApiKey();

  console.info('[Gemini] Runtime config', {
    configured: Boolean(apiKey),
    apiKeyPrefix: getGeminiApiKeyPrefix(),
    apiKeyLength: apiKey.length,
    model,
    projectId: getGeminiProjectId(),
  });
};

const logGeminiError = (error: unknown, model: string) => {
  const errorDetails = extractErrorDetails(error);
  const nestedError = extractNestedDetails(errorDetails);
  const status = errorDetails.status || nestedError.status || nestedError.code || null;
  const message =
    error instanceof Error
      ? error.message
      : typeof nestedError.message === 'string'
        ? nestedError.message
        : 'Unknown Gemini error';
  const details = errorDetails.details || nestedError.details || [];
  const quotaDetails = extractQuotaDetails(details);
  const projectId = getGeminiProjectId() || findProjectIdInValue(errorDetails);

  console.error('[Gemini] Request failed', {
    status,
    message,
    quotaDetails,
    quotaExhausted: status === 429 || String(status).includes('RESOURCE_EXHAUSTED'),
    possibleZeroQuota: hasZeroQuotaSignal(quotaDetails),
    model,
    projectId,
    apiKeyPrefix: getGeminiApiKeyPrefix(),
    appRetryCount: 0,
  });
};

export const analyzeComplaintWithGemini = async (input: GeminiComplaintInput): Promise<GeminiComplaintAnalysis | null> => {
  const model = getGeminiModel();

  if (!isGeminiConfigured()) {
    logGeminiRuntimeConfig(model);
    console.warn('[Gemini] GEMINI_API_KEY is not configured');
    return null;
  }

  try {
    logGeminiRuntimeConfig(model);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const parts: Part[] = [{ text: buildPrompt(input.description) }];

      if (input.image) {
        parts.push({
          inlineData: {
            data: input.image.buffer.toString('base64'),
            mimeType: input.image.mimeType,
          },
        });
      }

      console.info('[Gemini] Sending complaint analysis request', {
        model,
        hasImage: Boolean(input.image),
        appRetryCount: 0,
      });

      const response = await getGeminiClient().models.generateContent({
        model: getGeminiModel(),
        contents: [{ role: 'user', parts }],
        config: {
          abortSignal: controller.signal,
          temperature: 0,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      if (!response.text) {
        console.warn('[Gemini] Empty response text', { model });
        return null;
      }

      const rawJson = parseGeminiJson(response.text);
      const validatedAnalysis = validateGeminiComplaintAnalysis(rawJson);

      if (!validatedAnalysis) {
        console.warn('[Gemini] Response failed validation', { model, rawJson });
        return null;
      }

      return validatedAnalysis;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    logGeminiError(error, model);
    return null;
  }
};
